import React, { useState } from "react";
import "./App.css";
import Event from "./Event";
import Category from "./Category";

// Sample data
let eventData = [
  new Event(1, "Butterfly 100M", new Category(1,"Swimming"), "2022-12-17 13:00:00", "2022-12-17 14:00:00"),
  new Event(2, "Backstroke 100M", new Category(1,"Swimming"), "2022-12-17 13:30:00", "2022-12-17 14:30:00"),
  new Event(3, "Freestyle 400M", new Category(1,"Swimming"), "2022-12-17 15:00:00", "2022-12-17 16:00:00"),
  new Event(4, "High Jump", new Category(2,"Athletics"), "2022-12-17 13:00:00", "2022-12-17 14:00:00"),
  new Event(5, "Triple Jump", new Category(2,"Athletics"), "2022-12-17 16:00:00", "2022-12-17 17:00:00"),
  new Event(6, "Long Jump", new Category(2,"Athletics"), "2022-12-17 17:00:00", "2022-12-17 18:00:00"),
  new Event(7, "100M Sprint", new Category(2,"Athletics"), "2022-12-17 17:00:00", "2022-12-17 18:00:00"),
  new Event(8, "Lightweight 60kg", new Category(3,"Boxing"), "2022-12-17 18:00:00", "2022-12-17 19:00:00"),
  new Event(9, "Middleweight 75 kg", new Category(3,"Boxing"), "2022-12-17 19:00:00", "2022-12-17 20:00:00"),
  new Event(10, "Heavyweight 91kg", new Category(3,"Boxing"), "2022-12-17 20:00:00", "2022-12-17 22:00:00"),
];

const App = () => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState(eventData);
  const [searchTerm, setSearchTerm] = useState("");
  const [overlapExists, setOverlapExists] = useState(false);

  const groupByCategory = (events) => {
    const grouped = {};
    events.forEach((event) => {
      if (!grouped[event.eventCategory.name]) {
        grouped[event.eventCategory.name] = [];
      }
      grouped[event.eventCategory.name].push(event);
    });
    return grouped;
  };

  const isOverlap = (startTime, endTime) => {
    return selectedEvents.some(
      (event) =>
        (new Date(startTime) >= new Date(event.startTime) &&
          new Date(startTime) < new Date(event.endTime)) ||
        (new Date(endTime) > new Date(event.startTime) &&
          new Date(endTime) <= new Date(event.endTime)) ||
        (new Date(startTime) <= new Date(event.startTime) &&
          new Date(endTime) >= new Date(event.endTime))
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
        return new Date(a.startTime) - new Date(b.startTime);
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
      isOverlap(event.startTime, event.endTime)
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
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const convertTimeToAMPMFormat = (startTime, endTime) => {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12;
      return `${adjustedHours}${meridiem}`;
    };
  
    const formattedStartTime = formatTime(startTime.substr(11, 5));
    const formattedEndTime = formatTime(endTime.substr(11, 5));
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
            <div className="big-card" key={category}>
              <h2>{category}</h2>
              <div className="category-card">
                {events.map((event) => (
                  <div className={`eachcard ${
                    isOverlap(event.startTime, event.endTime)
                      ? "overlap"
                      : ""
                  }`} key={event.id}>
                    <div className="category">
                      {category.charAt(0).toUpperCase()}
                    </div>
                    <div className="vertical-line"></div>
                    <div className="details">
                      <span className="event-name">{event.eventName}</span>
                      <span>({category})</span>
                      <span>{convertTimeToAMPMFormat(event.startTime, event.endTime)}</span>
                      <button
                        onClick={() =>
                          handleEventSelect(
                            event.id,
                            event.startTime,
                            event.endTime
                          )
                        }
                        disabled={isOverlap(event.startTime, event.endTime)}
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
            <div className="big-card" key={category}>
              <h2>{category}</h2>
              <div className="category-card">
                {events.map((event) => (
                  <div className="eachcard" key={event.id}>
                    <div className="category">
                      {category.charAt(0).toUpperCase()}
                    </div>
                    <div className="vertical-line"></div>
                    <div className="details">
                      <span className="event-name">{event.eventName}</span>
                      <span>({category})</span>
                      <span>{convertTimeToAMPMFormat(event.startTime, event.endTime)}</span>
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
