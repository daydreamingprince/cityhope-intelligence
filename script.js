// --- CONFIGURATION ---
// In Vite/Vercel, variables must start with VITE_ to be accessible in the frontend
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// --- HELPER FUNCTIONS ---
const scrollToBottom = () => {
  const chatDisplay = document.getElementById('chat-display');
  // requestAnimationFrame ensures scrolling happens after the browser renders the new HTML
  requestAnimationFrame(() => {
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  });
};

const sendMessage = async () => {
  const chatInput = document.getElementById('chat-input');
  const chatDisplay = document.getElementById('chat-display');
  const messageText = chatInput.value.trim();
  
  if (messageText === "") return;

  // 1. Add User Message
  const userDiv = document.createElement('div');
  userDiv.className = 'message user';
  userDiv.textContent = messageText;
  chatDisplay.appendChild(userDiv);
  
  chatInput.value = "";
  scrollToBottom();
  
  // 2. Add AI "Thinking" Bubble with Animation (No hardcoded dots)
  const aiDiv = document.createElement('div');
  aiDiv.className = 'message ai typing';
  aiDiv.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  chatDisplay.appendChild(aiDiv);
  scrollToBottom();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href, 
        "X-Title": "City Hope IntelliSense"
      },
      body: JSON.stringify({
        "model": "tngtech/deepseek-r1t2-chimera:free", 
        "messages": [
          { 
            "role": "system", 
            "content": "You are City Hope IntelliSense, a warm and supportive friend for church members in Legazpi. Be encouraging, helpful, and use a friendly tone." 
          },
          { "role": "user", "content": messageText }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      aiDiv.classList.remove('typing');
      aiDiv.textContent = "I'm having a bit of trouble connecting. Please try again later!";
      return;
    }

    // 3. Clean and Display Content
    const rawContent = data.choices[0].message.content;

    // Advanced Regex Cleaning:
    // 1. Removes {{ reasoning tags }}
    // 2. Removes meta-comments in (parentheses) at the very end of the message
    const cleanContent = rawContent
      .replace(/\{\{.*?\}\}/gs, "")      // 1. Remove DeepSeek reasoning tags
      .replace(/\*\*/g, "")              // 2. Remove double asterisks (bold)
      .replace(/\*/g, "")                // 3. Remove single asterisks (italics)
      .replace(/\s*\([^)]*\)\s*$/g, "") // 4. Remove trailing meta-comments in parens
      .trim();

    aiDiv.classList.remove('typing');
    aiDiv.textContent = cleanContent;
  scrollToBottom();

  } catch (error) {
    aiDiv.classList.remove('typing');
    aiDiv.textContent = "Connection lost. Is your internet working?";
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