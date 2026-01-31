// --- CONFIGURATION ---
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// --- HELPER FUNCTIONS ---
const scrollToBottom = () => {
  const chatDisplay = document.getElementById('chat-display');
  // requestAnimationFrame ensures the scroll happens after the browser renders the new message
  requestAnimationFrame(() => {
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  });
};

const sendMessage = async () => {
  const chatInput = document.getElementById('chat-input');
  const chatDisplay = document.getElementById('chat-display');
  const messageText = chatInput.value.trim();
  
  if (messageText === "") return;

  // 1. Add User Bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'message user';
  userDiv.textContent = messageText;
  chatDisplay.appendChild(userDiv);
  
  chatInput.value = "";
  scrollToBottom(); // Scroll after user message
  
  // 2. Add AI "Thinking" Bubble
  const aiDiv = document.createElement('div');
  aiDiv.className = 'message ai';
  aiDiv.textContent = "...";
  chatDisplay.appendChild(aiDiv);
  scrollToBottom(); // Scroll for the thinking bubble

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href, // Good practice for OpenRouter
        "X-Title": "City Hope IntelliSense"
      },
      body: JSON.stringify({
        // Using a stable ID to avoid "No endpoints found" errors
        "model": "tngtech/deepseek-r1t2-chimera:free", 
        "messages": [
          { 
            "role": "system", 
            "content": "You are City Hope IntelliSense, a warm and supportive friend for church members in Legazpi. Be encouraging and helpful." 
          },
          { "role": "user", "content": messageText }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      aiDiv.textContent = `Error: ${data.error?.message || "Unauthorized"}`;
      return;
    }

    // This removes everything inside {{ }} including the brackets
    const cleanMessage = data.choices[0].message.content.replace(/\{\{.*?\}\}/gs, "").trim();
    aiDiv.textContent = cleanMessage;

    // 3. Replace "..." with real content and scroll again
    aiDiv.textContent = data.choices[0].message.content;
    scrollToBottom();

  } catch (error) {
    console.error("Fetch Error:", error);
    aiDiv.textContent = "I'm having trouble connecting. Check your internet or API key.";
    scrollToBottom();
  }
};

// --- EVENT LISTENERS ---
document.getElementById('send-button').addEventListener('click', sendMessage);

document.getElementById('chat-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});