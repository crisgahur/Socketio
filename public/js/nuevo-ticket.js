const lblNewTicket = document.querySelector('#lblNewTicket');
const btnCreate = document.querySelector('button');

const socket = io();


socket.on('connect', () => {
    // console.log('Conectado');

    btnCreate.disabled = false;


});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    btnCreate.disabled = true;

});

socket.on('last-ticket', (last) => {
    lblNewTicket.innerText = 'Ticket ' + last;
});

btnCreate.addEventListener( 'click', () => {
    
    socket.emit( 'next-ticket', null, ( ticket ) => {
        lblNewTicket.innerText = ticket;
    });

   

});



