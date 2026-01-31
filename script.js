// CONFIGURATION
const OPENROUTER_API_KEY = "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";

// DOM ELEMENTS
const chatDisplay = document.getElementById('chat-display');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

const sendMessage = () => {
  const messageText = chatInput.value.trim(); // grab the text and remove the extra spaces

  // validation to make sure user does not send empty messages
  if (message === "") return;

  // Create and display User message
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user');
  userMessage.textContent = messageText;
  chatDisplay.appendChild(userMessage);

  // Clear input immediately for better UX
  chatInput.value = "";
  chatDisplay.scrollTop = chatDisplay.scrollheight;
};

// here tell the button to listen for a click
sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});