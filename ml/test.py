import datetime
import os
import uuid

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar']


def authenticate_google_calendar():
    """
    Handles OAuth2 authentication and returns a Calendar API service object.
    It saves/loads the access token in token.json.
    """
    creds = None
    # token.json stores the user's access and refresh tokens.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Ensure that you have downloaded your credentials.json from Google Cloud Console.
            flow = InstalledAppFlow.from_client_secrets_file('D:\--force-LOC_7.0\ml\client_secret_47256749702-4lcb4k3n78o35un3vm16e8ibah48dcmb.apps.googleusercontent.com (3).json', SCOPES)
            # Use a fixed redirect URI on port 8085.
            creds = flow.run_local_server(port=8085)
        # Save the credentials for the next run.
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    service = build('calendar', 'v3', credentials=creds)
    return service


def get_free_slots(service, meeting_date, duration_minutes, time_zone='UTC'):
    """
    Uses the FreeBusy API to find available time slots during working hours (9am-5pm)
    on the specified meeting_date that are at least duration_minutes long.
    
    Args:
        service: Authorized Google Calendar API service instance.
        meeting_date: Date string in 'YYYY-MM-DD' format.
        duration_minutes: Desired meeting duration in minutes.
        time_zone: Time zone string (e.g., 'UTC' or 'America/New_York').
    
    Returns:
        A list of tuples, each containing (start_datetime, end_datetime) for free slots.
    """
    date_obj = datetime.datetime.strptime(meeting_date, '%Y-%m-%d').date()
    # Define working hours (adjust as necessary)
    start_of_day = datetime.datetime.combine(date_obj, datetime.time(hour=9, minute=0))
    end_of_day = datetime.datetime.combine(date_obj, datetime.time(hour=17, minute=0))

    # Prepare ISO format with 'Z' for UTC; if using a different time zone, adjust accordingly.
    start_of_day_iso = start_of_day.isoformat() + 'Z'
    end_of_day_iso = end_of_day.isoformat() + 'Z'

    body = {
        "timeMin": start_of_day_iso,
        "timeMax": end_of_day_iso,
        "timeZone": time_zone,
        "items": [{"id": "primary"}]
    }

    events_result = service.freebusy().query(body=body).execute()
    busy_times = events_result.get('calendars', {}).get('primary', {}).get('busy', [])
    
    # Process busy intervals (convert ISO strings to datetime objects)
    busy_intervals = []
    for busy in busy_times:
        # Replace 'Z' with '+00:00' for UTC.
        busy_start = datetime.datetime.fromisoformat(busy['start'].replace('Z', '+00:00'))
        busy_end = datetime.datetime.fromisoformat(busy['end'].replace('Z', '+00:00'))
        busy_intervals.append((busy_start, busy_end))
    busy_intervals.sort(key=lambda x: x[0])
    
    # Identify free slots by finding gaps between busy intervals.
    free_slots = []
    current_start = start_of_day
    for interval in busy_intervals:
        if current_start < interval[0]:
            gap = (interval[0] - current_start).total_seconds() / 60  # in minutes
            if gap >= duration_minutes:
                free_slots.append((current_start, interval[0]))
        current_start = max(current_start, interval[1])
    
    # Check for available slot after the last busy interval until end_of_day.
    if current_start < end_of_day:
        gap = (end_of_day - current_start).total_seconds() / 60
        if gap >= duration_minutes:
            free_slots.append((current_start, end_of_day))
    
    return free_slots


def create_event(service, start_time, end_time, summary, description, time_zone='UTC'):
    """
    Creates a calendar event with the specified parameters.
    The event includes a request for a Google Meet conference (Hangouts Meet).
    
    Args:
        service: Authorized Google Calendar API service instance.
        start_time: datetime object for the event start.
        end_time: datetime object for the event end.
        summary: Title of the event.
        description: Description of the event.
        time_zone: Time zone string.
    
    Returns:
        The created event object (as returned by the API).
    """
    event = {
        'summary': summary,
        'description': description,
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': time_zone,
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': time_zone,
        },
        # Request Google Meet (Hangouts Meet) link
        'conferenceData': {
            'createRequest': {
                'requestId': str(uuid.uuid4()),  # Unique identifier for the request
                'conferenceSolutionKey': {
                    'type': 'hangoutsMeet'
                },
            }
        },
    }
    # Insert the event and enable conference data.
    created_event = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1
    ).execute()
    return created_event


def schedule_meeting(service):
    """
    Interactively schedules a meeting by:
      - Asking the user for date, duration, title, description, and time zone.
      - Querying free time slots.
      - Creating the event with a Google Meet link.
    """
    meeting_date = input("Enter meeting date (YYYY-MM-DD): ").strip()
    try:
        duration_minutes = int(input("Enter meeting duration in minutes: ").strip())
    except ValueError:
        print("Invalid duration entered.")
        return
    summary = input("Enter meeting summary/title: ").strip()
    description = input("Enter meeting description: ").strip()
    time_zone = input("Enter your time zone (e.g., 'UTC' or 'America/New_York') [default UTC]: ").strip()
    if not time_zone:
        time_zone = 'UTC'

    # Find free slots on that day that can fit the meeting duration.
    free_slots = get_free_slots(service, meeting_date, duration_minutes, time_zone=time_zone)
    if not free_slots:
        print("No free slots available for the given duration on that day.")
        return

    # Display available free slots to the user.
    print("\nAvailable free slots on {}:".format(meeting_date))
    for idx, slot in enumerate(free_slots):
        start, end = slot
        print("{}. From {} to {}".format(
            idx + 1,
            start.strftime('%H:%M'),
            end.strftime('%H:%M')
        ))

    try:
        chosen_index = int(input("\nChoose a free slot by number: ").strip()) - 1
        chosen_slot = free_slots[chosen_index]
    except (IndexError, ValueError):
        print("Invalid slot chosen.")
        return

    # For simplicity, schedule the meeting at the very start of the chosen free slot.
    meeting_start = chosen_slot[0]
    meeting_end = meeting_start + datetime.timedelta(minutes=duration_minutes)

    # Create the event (with a Google Meet link)
    event = create_event(service, meeting_start, meeting_end, summary, description, time_zone=time_zone)
    print("\nMeeting scheduled successfully!")

    # Extract and display the Google Meet link.
    meet_link = None
    if 'hangoutLink' in event:
        meet_link = event['hangoutLink']
    elif 'conferenceData' in event:
        cd = event['conferenceData']
        if 'entryPoints' in cd:
            for entry in cd['entryPoints']:
                if entry.get('entryPointType') == 'video':
                    meet_link = entry.get('uri')
                    break
    if meet_link:
        print("Google Meet Link:", meet_link)
    else:
        print("No conference link found in the event data.")


def list_upcoming_events(service, max_results=10):
    """
    Lists upcoming events from the primary calendar.
    
    Args:
        service: Authorized Google Calendar API service instance.
        max_results: Maximum number of events to list.
    
    Returns:
        A list of event objects.
    """
    now = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    events_result = service.events().list(
        calendarId='primary',
        timeMin=now,
        maxResults=max_results,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    events = events_result.get('items', [])
    if not events:
        print('No upcoming events found.')
        return []
    print("\nUpcoming events:")
    for idx, event in enumerate(events):
        start = event['start'].get('dateTime', event['start'].get('date'))
        print(f"{idx + 1}. {event.get('summary', 'No Title')} (Start: {start}, ID: {event['id']})")
    return events


def delete_event_interactive(service):
    """
    Interactively lists upcoming events and allows the user to choose one to delete.
    """
    events = list_upcoming_events(service)
    if not events:
        return
    try:
        chosen_index = int(input("\nSelect event to delete by number: ").strip()) - 1
        event = events[chosen_index]
        event_id = event['id']
        confirm = input(
            f"Are you sure you want to delete event '{event.get('summary', 'No Title')}'? (y/n): "
        ).strip().lower()
        if confirm == 'y':
            service.events().delete(calendarId='primary', eventId=event_id).execute()
            print("Event deleted successfully!")
        else:
            print("Deletion cancelled.")
    except (IndexError, ValueError):
        print("Invalid selection.")


def reschedule_event_interactive(service):
    """
    Interactively lists upcoming events and allows the user to choose one to reschedule.
    The user is prompted for a new date, new start time, and duration.
    """
    events = list_upcoming_events(service)
    if not events:
        return
    try:
        chosen_index = int(input("\nSelect event to reschedule by number: ").strip()) - 1
        event = events[chosen_index]
        event_id = event['id']
        print(f"\nRescheduling event: {event.get('summary', 'No Title')}")
        new_date_str = input("Enter new meeting date (YYYY-MM-DD): ").strip()
        new_time_str = input("Enter new start time (HH:MM in 24-hour format): ").strip()
        new_duration = int(input("Enter new meeting duration in minutes: ").strip())
        # Parse new start datetime.
        new_start_dt = datetime.datetime.strptime(new_date_str + " " + new_time_str, "%Y-%m-%d %H:%M")
        new_end_dt = new_start_dt + datetime.timedelta(minutes=new_duration)
        # Use the same time zone as the existing event (or default to UTC).
        time_zone = event['start'].get('timeZone', 'UTC')
        event['start'] = {
            'dateTime': new_start_dt.isoformat(),
            'timeZone': time_zone
        }
        event['end'] = {
            'dateTime': new_end_dt.isoformat(),
            'timeZone': time_zone
        }
        updated_event = service.events().update(calendarId='primary', eventId=event_id, body=event).execute()
        print("Event rescheduled successfully!")
        new_start = updated_event['start'].get('dateTime', updated_event['start'].get('date'))
        print("New start time:", new_start)
        # Display the conference (Google Meet) link if available.
        meet_link = None
        if 'hangoutLink' in updated_event:
            meet_link = updated_event['hangoutLink']
        elif 'conferenceData' in updated_event:
            cd = updated_event['conferenceData']
            if 'entryPoints' in cd:
                for entry in cd['entryPoints']:
                    if entry.get('entryPointType') == 'video':
                        meet_link = entry.get('uri')
                        break
        if meet_link:
            print("Google Meet Link:", meet_link)
        else:
            print("No conference link found in the updated event data.")
    except (IndexError, ValueError) as e:
        print("Invalid input. Error:", e)


def main():
    service = authenticate_google_calendar()

    while True:
        print("\n=== Google Calendar Meeting Manager ===")
        print("1. Schedule a new meeting")
        print("2. Delete an existing meeting")
        print("3. Reschedule an existing meeting")
        print("4. Exit")
        choice = input("Enter option number: ").strip()
        if choice == '1':
            schedule_meeting(service)
        elif choice == '2':
            delete_event_interactive(service)
        elif choice == '3':
            reschedule_event_interactive(service)
        elif choice == '4':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == '__main__':
    main()
