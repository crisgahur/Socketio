const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl(); // Creating a new instance the class is inicialize.

const socketController = (socket) => {


    //These events start when a new client is connected.
    socket.emit('last-ticket',ticketControl.last); 
    socket.emit('actual-status', ticketControl.last4);
    socket.emit('pending-ticket', ticketControl.tickets.length);

    socket.on('next-ticket', ( payload, callback ) => {

       const next = ticketControl.next();
       callback(next);
       socket.broadcast.emit('pending-ticket', ticketControl.tickets.length);

    });

    socket.on('attend-ticket', ({desktop}, callback) => {
        if(!desktop){
            return callback({
                ok: false,
                msg: "The desktop is obligatory"
            });
        }

        const ticket = ticketControl.attendTicket(desktop);

        //T0D0: notify change in the last4:
        socket.broadcast.emit('actual-status', ticketControl.last4); // We declare it with broadcast to upload in all the pages the last 4 tickets.
        socket.emit('pending-ticket', ticketControl.tickets.length);
        socket.broadcast.emit('pending-ticket', ticketControl.tickets.length);
        
        if(!ticket){
            callback({
                ok:false,
                msg: `Ya no hay tickets pendientes`
            });
        } else {
            callback({
                ok:true,
                ticket
            })
        }
    })

   

}



module.exports = {
    socketController
}

