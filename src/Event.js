// Event.js
class Event {
    constructor(id, eventName, categoryId, startTime, endTime) {
      this.id = id;
      this.eventName = eventName;
      this.categoryId = categoryId; // Category ID instead of Category object
      this.startTime = startTime;
      this.endTime = endTime;
    }
  }
  
  export default Event;
  