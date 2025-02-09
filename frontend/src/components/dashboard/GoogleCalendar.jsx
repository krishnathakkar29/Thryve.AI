import React from "react";

const GoogleCalendar = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&showPrint=0&src=dW5uYXRpLmhhc3NhbmFuZGFuaUBnbWFpbC5jb20&color=%23039BE5"
        style={{ border: "solid 1px #777", width: "800px", height: "600px" , borderRadius:"20px"}}
        frameBorder="0"
        scrolling="no"
        title="Google Calendar"
      ></iframe>
    </div>
  );
};

export default GoogleCalendar;
