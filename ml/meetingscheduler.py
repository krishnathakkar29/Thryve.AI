import os
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.cloud import aiplatform
import google.generativeai as genai
from google.auth.transport.requests import Request
import pickle
from enum import Enum
from dataclasses import dataclass
from typing import List, Tuple, Optional, Dict
import json
import pytz
class MeetingPriority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    URGENT = 4

@dataclass
class MeetingRequest:
    subject: str
    duration_minutes: int
    participants: List[str]
    priority: MeetingPriority
    preferred_time_ranges: List[Tuple[datetime, datetime]] = None
    required_participants: List[str] = None

class MeetingSchedulerAgent:
    def __init__(self, credentials_path: str):
        """
        Initialize the meeting scheduler agent.
        
        Args:
            credentials_path (str): Path to the Google OAuth credentials JSON file
        """
        self.SCOPES = ['https://www.googleapis.com/auth/calendar']
        self.credentials_path = credentials_path
        self.creds = None
        self.REDIRECT_PORT = 8085  # Fixed port for OAuth redirect
        
        # Initialize Google Calendar API
        self.initialize_credentials()
        
        # Initialize Gemini
        GOOGLE_API_KEY = 'AIzaSyDmM7SLLMiBbRxFQOu_BeGL8x4PP2D-jKw'
        if not GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        genai.configure(api_key=GOOGLE_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    def initialize_credentials(self):
        """Initialize Google Calendar credentials with fixed redirect port"""
        try:
            # Check for existing token
            if os.path.exists('token.pickle'):
                with open('token.pickle', 'rb') as token:
                    self.creds = pickle.load(token)

            # If no valid credentials available, authenticate
            if not self.creds or not self.creds.valid:
                if self.creds and self.creds.expired and self.creds.refresh_token:
                    self.creds.refresh(Request())
                else:
                    if not os.path.exists(self.credentials_path):
                        raise FileNotFoundError(
                            f"Credentials file not found at {self.credentials_path}"
                        )

                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.credentials_path,
                        self.SCOPES,
                        redirect_uri=f'http://localhost:{self.REDIRECT_PORT}/'
                    )
                    self.creds = flow.run_local_server(
                        port=self.REDIRECT_PORT,
                        prompt='consent',
                        access_type='offline'
                    )

                # Save credentials
                with open('token.pickle', 'wb') as token:
                    pickle.dump(self.creds, token)

            # Build the service
            self.service = build('calendar', 'v3', credentials=self.creds)

        except Exception as e:
            raise Exception(f"""
                Authentication failed. Please ensure:
                1. You've registered http://localhost:{self.REDIRECT_PORT}/ in Google Cloud Console
                2. Your credentials.json file is valid and in the correct location
                3. You have enabled the Google Calendar API in your project
                
                Error: {str(e)}
            """)

    def get_participant_availability(self, participant_email: str, 
                                   start_date: str, end_date: str) -> List[Tuple[datetime, datetime]]:
        """
        Get a participant's busy times from their calendar.
        
        Args:
            participant_email (str): Email of the participant
            start_date (str): Start date in ISO format
            end_date (str): End date in ISO format
            
        Returns:
            List of tuples containing busy time periods
        """
        try:
            body = {
                "timeMin": start_date,
                "timeMax": end_date,
                "items": [{"id": participant_email}]
            }
            freebusy = self.service.freebusy().query(body=body).execute()
            busy_periods = freebusy['calendars'][participant_email]['busy']
            return [(datetime.fromisoformat(period['start'].replace('Z', '+00:00')), 
                    datetime.fromisoformat(period['end'].replace('Z', '+00:00'))) 
                    for period in busy_periods]
        except Exception as e:
            print(f"Error getting availability for {participant_email}: {e}")
            return []

    def _calculate_slot_score(self, slot_time: datetime, 
                            meeting_request: MeetingRequest) -> float:
        """
        Calculate a score for a time slot based on various factors.
        
        Args:
            slot_time (datetime): The time slot to evaluate
            meeting_request (MeetingRequest): The meeting request details
            
        Returns:
            float: Score for the time slot
        """
        score = 100.0  # Base score
        
        # Priority multiplier
        priority_multipliers = {
            MeetingPriority.LOW: 1.0,
            MeetingPriority.MEDIUM: 1.5,
            MeetingPriority.HIGH: 2.0,
            MeetingPriority.URGENT: 3.0
        }
        score *= priority_multipliers[meeting_request.priority]
        
        # Time of day preferences
        hour = slot_time.hour
        if meeting_request.priority in (MeetingPriority.HIGH, MeetingPriority.URGENT):
            # Prefer morning slots for high priority meetings
            if 9 <= hour <= 12:
                score += 50
            elif 13 <= hour <= 15:
                score += 30
            else:
                score += 10
        else:
            # For lower priority meetings, prefer mid-day
            if 11 <= hour <= 15:
                score += 30
            elif 9 <= hour <= 10 or 16 <= hour <= 17:
                score += 20
        
        # Preferred time ranges
        if meeting_request.preferred_time_ranges:
            for start, end in meeting_request.preferred_time_ranges:
                if start <= slot_time <= end:
                    score += 100
        
        # Day of week preference (prefer mid-week for non-urgent meetings)
        if meeting_request.priority != MeetingPriority.URGENT:
            weekday = slot_time.weekday()
            if weekday in [1, 2, 3]:  # Tuesday, Wednesday, Thursday
                score += 20
        
        return score

    def find_optimal_slot(self, meeting_request: MeetingRequest, 
                         date_range: Tuple[str, str]) -> Optional[datetime]:
        """
        Find the optimal meeting slot based on priority and participant availability.
        
        Args:
            meeting_request (MeetingRequest): Meeting request details
            date_range (Tuple[str, str]): Start and end dates for the search
            
        Returns:
            Optional[datetime]: The optimal meeting time, if found
        """
        start_date, end_date = date_range
        
        # Get busy times for all participants
        all_busy_times = []
        for participant in meeting_request.participants:
            busy_times = self.get_participant_availability(participant, start_date, end_date)
            all_busy_times.extend(busy_times)
        
        # Sort and merge busy times
        all_busy_times.sort(key=lambda x: x[0])
        merged_busy_times = []
        for busy_period in all_busy_times:
            if not merged_busy_times or merged_busy_times[-1][1] < busy_period[0]:
                merged_busy_times.append(busy_period)
            else:
                merged_busy_times[-1] = (
                    merged_busy_times[-1][0],
                    max(merged_busy_times[-1][1], busy_period[1])
                )

        # Find free slots
        free_slots = self._find_free_slots(merged_busy_times, start_date, end_date, (9, 17))
        
        # Find suitable slots and score them
        duration = timedelta(minutes=meeting_request.duration_minutes)
        suitable_slots = []
        
        for start, end in free_slots:
            if end - start >= duration:
                slot_score = self._calculate_slot_score(start, meeting_request)
                suitable_slots.append((start, slot_score))
        
        if not suitable_slots:
            return None
            
        # Sort by score (higher is better)
        suitable_slots.sort(key=lambda x: x[1], reverse=True)
        return suitable_slots[0][0]

    def _find_free_slots(self, busy_slots: List[Tuple[datetime, datetime]], 
                    start_date: str, end_date: str, 
                    working_hours: Tuple[int, int]) -> List[Tuple[datetime, datetime]]:
        """Find available time slots between busy periods"""
        free_slots = []
        utc = pytz.UTC
        
        current_date = datetime.fromisoformat(start_date.replace('Z', '+00:00')).replace(tzinfo=utc)
        end_datetime = datetime.fromisoformat(end_date.replace('Z', '+00:00')).replace(tzinfo=utc)

        while current_date <= end_datetime:
            # Only consider working hours
            day_start = current_date.replace(hour=working_hours[0], minute=0, tzinfo=utc)
            day_end = current_date.replace(hour=working_hours[1], minute=0, tzinfo=utc)

            # Filter busy slots for current day
            day_busy = [
                (start.replace(tzinfo=utc), end.replace(tzinfo=utc)) 
                for start, end in busy_slots
                if start.replace(tzinfo=utc).date() == current_date.date()
            ]
            
            # Sort busy slots
            day_busy.sort(key=lambda x: x[0])

            # Find free slots
            current_time = day_start
            for busy_start, busy_end in day_busy:
                if current_time < busy_start:
                    free_slots.append((current_time, busy_start))
                current_time = max(current_time, busy_end)

            if current_time < day_end:
                free_slots.append((current_time, day_end))

            current_date += timedelta(days=1)

        return free_slots

    def schedule_meeting(self, meeting_request: MeetingRequest, 
                        date_range: Tuple[str, str]) -> Dict:
        """Schedule a meeting using priority-based scheduling and generate Meet link."""
        try:
            utc = pytz.UTC
            
            # Find optimal slot
            optimal_slot = self.find_optimal_slot(meeting_request, date_range)
            
            if not optimal_slot:
                return {
                    'status': 'error',
                    'message': 'No suitable time slots found for the meeting.'
                }
            
            # Ensure optimal_slot is timezone-aware
            if optimal_slot.tzinfo is None:
                optimal_slot = optimal_slot.replace(tzinfo=utc)
            
            # Create event with Google Meet link
            event = {
                'summary': meeting_request.subject,
                'start': {
                    'dateTime': optimal_slot.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': (optimal_slot + timedelta(minutes=meeting_request.duration_minutes)).isoformat(),
                    'timeZone': 'UTC',
                },
                'attendees': [{'email': p} for p in meeting_request.participants],
                'conferenceData': {
                    'createRequest': {
                        'requestId': f"meet_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                        'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                    }
                }
            }
            
            # Add priority marker
            if meeting_request.priority in (MeetingPriority.HIGH, MeetingPriority.URGENT):
                event['summary'] = f"[{meeting_request.priority.name}] {event['summary']}"
            
            # Create the event
            event = self.service.events().insert(
                calendarId='primary',
                body=event,
                conferenceDataVersion=1
            ).execute()
            
            # Extract Meet link
            meet_link = event.get('conferenceData', {}).get('entryPoints', [{}])[0].get('uri', 'No meet link generated')
            
            return {
                'status': 'success',
                'event_id': event.get('id'),
                'meet_link': meet_link,
                'scheduled_time': optimal_slot.isoformat(),
                'priority': meeting_request.priority.name
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Failed to schedule meeting: {str(e)}'
            }

# Example usage
if __name__ == "__main__":
    try:
        # Initialize the agent
        agent = MeetingSchedulerAgent('D:\--force-LOC_7.0\ml\client_secret_47256749702-4lcb4k3n78o35un3vm16e8ibah48dcmb.apps.googleusercontent.com (3).json')
        
        # Create a meeting request
        meeting_request = MeetingRequest(
            subject="Urgent Project Review",
            duration_minutes=60,
            participants=["taran.shah23@gmail.com"],
            priority=MeetingPriority.HIGH,
            required_participants=["taran.shah23@gmail.com"],
            preferred_time_ranges=[
                (datetime(2025, 2, 8, 9, 0), datetime(2025, 2, 8, 12, 0))
            ]
        )
        
        # Schedule the meeting
        result = agent.schedule_meeting(
            meeting_request,
            ("2025-02-08T00:00:00Z", "2025-02-15T23:59:59Z")
        )
        
        # Print results
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"Error: {str(e)}")