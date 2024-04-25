import React, { useState } from "react";
import "./App.css";

// Sample data
let eventData = [
  {
    id: 1,
    event_name: "Butterfly 100M",
    event_category: "Swimming",
    start_time: "2022-12-17 13:00:00",
    end_time: "2022-12-17 14:00:00",
  },
  {
    id: 2,
    event_name: "Backstroke 100M",
    event_category: "Swimming",
    start_time: "2022-12-17 13:30:00",
    end_time: "2022-12-17 14:30:00",
  },
  {
    id: 3,
    event_name: "Freestyle 400M",
    event_category: "Swimming",
    start_time: "2022-12-17 15:00:00",
    end_time: "2022-12-17 16:00:00",
  },
  {
    id: 4,
    event_name: "High Jump",
    event_category: "Athletics",
    start_time: "2022-12-17 13:00:00",
    end_time: "2022-12-17 14:00:00",
  },
  {
    id: 5,
    event_name: "Triple Jump",
    event_category: "Athletics",
    start_time: "2022-12-17 16:00:00",
    end_time: "2022-12-17 17:00:00",
  },
  {
    id: 6,
    event_name: "Long Jump",
    event_category: "Athletics",
    start_time: "2022-12-17 17:00:00",
    end_time: "2022-12-17 18:00:00",
  },
  {
    id: 7,
    event_name: "100M Sprint",
    event_category: "Athletics",
    start_time: "2022-12-17 17:00:00",
    end_time: "2022-12-17 18:00:00",
  },
  {
    id: 8,
    event_name: "Lightweight 60kg",
    event_category: "Boxing",
    start_time: "2022-12-17 18:00:00",
    end_time: "2022-12-17 19:00:00",
  },

  {
    id: 9,
    event_name: "Middleweight 75 kg",
    event_category: "Boxing",
    start_time: "2022-12-17 19:00:00",
    end_time: "2022-12-17 20:00:00",
  },
  {
    id: 10,
    event_name: "Heavyweight 91kg",
    event_category: "Boxing",
    start_time: "2022-12-17 20:00:00",
    end_time: "2022-12-17 22:00:00",
  },
];

const App = () => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState(eventData);
  const [searchTerm, setSearchTerm] = useState("");
  const [overlapExists, setOverlapExists] = useState(false);

  const groupByCategory = (events) => {
    const grouped = {};
    events.forEach((event) => {
      if (!grouped[event.event_category]) {
        grouped[event.event_category] = [];
      }
      grouped[event.event_category].push(event);
    });
    return grouped;
  };

  const isOverlap = (startTime, endTime) => {
    return selectedEvents.some(
      (event) =>
        (new Date(startTime) >= new Date(event.start_time) &&
          new Date(startTime) < new Date(event.end_time)) ||
        (new Date(endTime) > new Date(event.start_time) &&
          new Date(endTime) <= new Date(event.end_time)) ||
        (new Date(startTime) <= new Date(event.start_time) &&
          new Date(endTime) >= new Date(event.end_time))
    );
  };

  const handleEventSelect = (eventId, startTime, endTime) => {
    const conflicts = isOverlap(startTime, endTime);

    if (conflicts) {
      alert("Event timing conflicts with already selected event(s).");
    } else if (selectedEvents.length < 3) {
      const newEvent = eventData.find((event) => event.id === eventId);
      const newAvailableEvents = availableEvents.filter(
        (event) => event.id !== eventId
      );
      const newSelectedEvents = [...selectedEvents, newEvent].sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
      setAvailableEvents(newAvailableEvents);
      setSelectedEvents(newSelectedEvents);
      setOverlapExists(true);
    } else {
      alert("You can only select a maximum of 3 events.");
    }
  };

  const handleEventDeselect = (eventId) => {
    const updatedEvents = selectedEvents.filter(
      (event) => event.id !== eventId
    );
    setSelectedEvents(updatedEvents);
    const noOverlapExists = !updatedEvents.some((event) =>
      isOverlap(event.start_time, event.end_time)
    );
    setOverlapExists(noOverlapExists);
    setAvailableEvents([
      ...availableEvents,
      eventData.find((event) => event.id === eventId),
    ]);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter events based on search term
  const filteredEvents = availableEvents.filter((event) =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const convertTimeToAMPMFormat=(startTime,endTime)=> {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12;
      return `${adjustedHours}${meridiem}`;
    };
  
    const formattedStartTime = formatTime(startTime.substr(11, 5));
    const formattedEndTime = formatTime(endTime.substr(11, 5));
    console.log(formattedStartTime,formattedEndTime)
    return `${formattedStartTime}-${formattedEndTime}`;
  }
  

  return (
    <div className="app">
      <div className="column">
        <div>
          <h1 style={{ display: "inline-block", width: "60%" }}>All Events</h1>
          <div
            className="search-box"
            style={{ display: "inline-block", width: "40%" }}
          >
            <input
              type="text"
              placeholder="Search by event names..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ width:'calc(100% - 30px)',height:'30px',paddingRight: '30px', boxSizing: 'border-box'}}
            />
          </div>
        </div>
        {Object.entries(groupByCategory(filteredEvents)).map(
          ([category, events]) => (
            <div className="big-card">
              <h2>{category}</h2>
              <div className="category-card" key={category}>
                {events.map((event) => (
                  <div className={`eachcard ${
                    isOverlap(event.start_time, event.end_time)
                      ? "overlap"
                      : ""
                  }`} key={event.id}>
                    <div className="category">
                      {category.charAt(0).toUpperCase()}
                    </div>
                    <div className="vertical-line"></div>
                    <div className="details">
                        <span className="event-name">{event.event_name}</span>
                        <span>({category})</span>
                        <span>{convertTimeToAMPMFormat(event.start_time,event.end_time)}</span>
                        <button
                          onClick={() =>
                            handleEventSelect(
                              event.id,
                              event.start_time,
                              event.end_time
                            )
                          }
                          disabled={isOverlap(event.start_time, event.end_time)}
                        >
                          Select
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      <div className="column">
      <div>
          <h1 style={{ display: "inline-block", width: "60%" }}>Selected Events</h1>
        </div>
        {Object.entries(groupByCategory(selectedEvents)).map(
          ([category, events]) => (
            <div className="big-card">
              <h2>{category}</h2>
              <div className="category-card" key={category}>
                {events.map((event) => (
                  <div className="eachcard" key={event.id}>
                    <div className="category">
                      {category.charAt(0).toUpperCase()}
                    </div>
                    <div className="vertical-line"></div>
                    <div className="details">
                        <span className="event-name">{event.event_name}</span>
                        <span>({category})</span>
                        <span>{convertTimeToAMPMFormat(event.start_time,event.end_time)}</span>
                    
                         <button className="red-button" onClick={() => handleEventDeselect(event.id)}>
                        Remove
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;
