// Here we find the elements on the page and we give them nicknames
const sendButton = document.querySelector('#input-area button');
const chatInput = document.querySelector('#input-area textarea');
const chatDisplay = document.querySelector('#chat-display');

const sendMessage = () => {
  const messageText = chatInput.value.trim(); // grab the text and remove the extra spaces

  // validation to make sure user does not send empty messages
  if (message === "") return;

  // now we build the user bubble
  const userMessage = document.createElement('div'); // creates a new <div>
  userMessage.classList.add('message', 'user'); // here we gave it the class we styled in css
  userMessage.textContent = messageText; // we put the text inside the div

  // we display it and add it to the screen
  chatDisplay.appendChild(userMessage);

  // then we do the cleanup (like clearing input and scrolling to the bottom)
  chatInput.value = "";
  chatDisplay.scrollTop = chatDisplay.scrollheight;
};

// here tell the button to listen for a click
sendButton.addEventListener('click', sendMessage);

// we allow user to send messages using 'enter'
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // this will prevent a new line from being added
    sendMessage();
  }
})
