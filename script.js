// Enhanced Chatbot Script to Improve Conversational Flow

const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "your_openai_api_key_here";

// Sample responses with friendly, conversational tone
const friendlyResponses = {
    "hello": "Hello there! 😊 How’s your day going? What can I help you with?",
    "help": "Of course! Just let me know what you're working on, and I'll do my best to help you.",
    "pricing": "Our pricing varies depending on the services you need. Could you tell me a bit more so I can guide you?",
    "bot name": "I'm your friendly assistant bot! You can call me ChatBot. What's your name?",
};

// Function to match user intent with conversational responses
const matchIntent = (message) => {
    message = message.toLowerCase();
    // Here we use simple matching; you could expand this to NLP processing.
    for (let key in friendlyResponses) {
        if (message.includes(key)) {
            return friendlyResponses[key];
        }
    }
    return null;
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = `<p>${message}</p>`;
    return chatLi;
};

const generateResponse = (incomingChatLi, customResponse = null) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    if (customResponse) {
        // Set custom response if available from friendlyResponses
        messageElement.textContent = customResponse;
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return;
    }

    // Dynamic response from OpenAI
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            const responseContent = data.choices[0].message.content;
            // Additional personalization
            messageElement.textContent = `😊 ${responseContent}`;
        })
        .catch(error => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again!";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user message
    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Look for an intent match in friendly responses
    const friendlyResponse = matchIntent(userMessage);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, friendlyResponse);
    }, 600);
};

sendChatBtn.addEventListener("click", handleChat);

// Optional Cancel function to close chatbot interaction
function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display != 'none') {
        chatbotcomplete.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot! 😊 Have a great day!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg);
    }
}
