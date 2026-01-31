// --- CONFIGURATION ---
// Replace the string below with your NEW key from step 2
const OPENROUTER_API_KEY = "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";

const sendMessage = async () => {
  const chatInput = document.getElementById('chat-input');
  const chatDisplay = document.getElementById('chat-display');
  const messageText = chatInput.value.trim();
  
  if (messageText === "") return;

  // Add User Bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'message user';
  userDiv.textContent = messageText;
  chatDisplay.appendChild(userDiv);
  
  chatInput.value = "";
  
  // Add AI "Thinking" Bubble
  const aiDiv = document.createElement('div');
  aiDiv.className = 'message ai';
  aiDiv.textContent = "...";
  chatDisplay.appendChild(aiDiv);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-3n-e2b-it:free", // Updated Model ID
        "messages": [
          { "role": "system", "content": "You are City Hope IntelliSense, a supportive friend for church members." },
          { "role": "user", "content": messageText }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      aiDiv.textContent = `Error: ${data.error.message || "Unauthorized"}`;
      return;
    }

    aiDiv.textContent = data.choices[0].message.content;

  } catch (error) {
    console.error("Fetch Error:", error);
    aiDiv.textContent = "I'm having trouble connecting. Check your internet or API key.";
  }
  
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
};

// Event Listeners
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});