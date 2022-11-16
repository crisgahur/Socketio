const path = require("path"); // To can create the path where will be the information ticket
const fs = require("fs"); // To have a file system at save.

class Ticket {
  constructor(number, desktop) {
    this.number = number;
    this.desktop = desktop;
  }
}

class TicketControl {
  constructor() {
    this.last = 0;
    this.today = new Date().getDate(); // Property to get de current date
    this.tickets = [];
    this.last4 = [];

    this.init();
  }

  get toJson() {
    return {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      last4: this.last4,
    };
  }

  init() {
    // Init: to inicialize the class
    const { today, last, last4, tickets } = require("../db/data.json"); //Transform a JSON in an object
    if (today === this.today) {
      this.last = last;
      this.last4 = last4;
      this.tickets = tickets;
    } else {
      //It's other day:
      this.saveDB();
    }
  }

  saveDB() {
    const dbPath = path.join(__dirname, "../db/data.json"); // If we just write __dirname the fs will save in models folder
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson)); //Transform an object in JSON
  }

  next() {
    this.last += 1;
    const ticket = new Ticket(this.last, null); // Parameter desktop is null
    this.tickets.push(ticket);

    this.saveDB();
    return "Ticket " + this.last;
  }

  attendTicket(desktop) {
    //If there isn't tickets:
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift(); // this.tickets[0];
    ticket.desktop = desktop;

    this.last4.unshift(ticket);

    if (this.last4.length > 4) {
      this.last4.splice(-1, 1);
    }
    this.saveDB();
    return ticket;
  }
}

module.exports = TicketControl;
