// --- CONFIGURATION ---
// I removed the leading space. Ensure there are no quotes or extra spaces when you paste your key.
const OPENROUTER_API_KEY = "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";

// --- DOM ELEMENTS ---
const chatDisplay = document.getElementById('chat-display');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// --- THE LOGIC ---
const sendMessage = async () => {
  const messageText = chatInput.value.trim();
  if (messageText === "") return;

  // 1. Create and display User message
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user');
  userMessage.textContent = messageText;
  chatDisplay.appendChild(userMessage);

  // Clear input immediately for better UX
  chatInput.value = "";
  chatDisplay.scrollTop = chatDisplay.scrollHeight;

  // 2. Create "Thinking" bubble for AI
  const aiMessage = document.createElement('div');
  aiMessage.classList.add('message', 'ai');
  aiMessage.textContent = "...";
  chatDisplay.appendChild(aiMessage);

  try {
    // 3. The API Fetch Request
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": [
          { 
            "role": "system", 
            "content": "You are City Hope IntelliSense, a supportive friend for church members in Legazpi. Be warm, insightful, and grounded." 
          },
          { "role": "user", "content": messageText }
        ]
      })
    });

    // Handle potential server errors (like the 404 you saw)
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Detailed:", errorData);
      aiMessage.textContent = "I'm having trouble thinking right now. Please check my connection.";
      return;
    }

    const data = await response.json();
    
    // 4. Show the AI's actual response
    if (data.choices && data.choices[0]) {
      aiMessage.textContent = data.choices[0].message.content;
    } else {
      aiMessage.textContent = "I heard you, but I don't have an answer right now.";
    }

  } catch (error) {
    console.error("Connection Error:", error);
    aiMessage.textContent = "Connection lost. Please try again.";
  }

  // Final scroll to show the AI response
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
};

// --- EVENT LISTENERS ---
sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});