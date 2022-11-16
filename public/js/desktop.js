//HTML references:
const lblDesktop = document.querySelector("h1"); // It's assign to the first h1 tag found.
const btnAttend = document.querySelector("button"); // It's assign to the first button tag found.
const lblTicket = document.querySelector("small");
const divAlert = document.querySelector(".alert");
const lblPending = document.querySelector("#lblPending");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("desktop")) {
  // If in the link isn't the word desktop....
  window.location = "index.html"; // Return the user to index.html
  throw new Error("The desktop is obligatory");
}

const desktop = searchParams.get("desktop");
lblDesktop.innerText = desktop;

divAlert.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAttend.disabled = false;
});

socket.on("disconnect", () => {
  btnAttend.disabled = true;
});

socket.on("pending-ticket", (pending) => {
  if (pending == 0) {
    lblPending.style.display = "none";
  } else {
    lblPending.style.display = "";
    lblPending.innerText = pending;
  }
});

btnAttend.addEventListener("click", () => {
  socket.emit("attend-ticket", { desktop }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = `Nobody`;
      return (divAlert.style.display = "");
    }
    lblTicket.innerText = `Ticket ${ticket.number} `;
  });

  /*  socket.emit("next-ticket", null, (ticket) => {
    lblNewTicket.innerText = ticket;
  }); */
});
