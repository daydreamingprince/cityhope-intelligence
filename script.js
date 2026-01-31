// Here we find the elements on the page and we give them nicknames
const sendButton = document.querySelector('#input-area button');
const chatInput = document.querySelector('#input-area textarea');
const chatDisplay = document.querySelector('#chat-display');

// now we tell the button to listen for a click
sendButton.addEventListener('click', () => {
  console.log("Send button was clicked!")
});