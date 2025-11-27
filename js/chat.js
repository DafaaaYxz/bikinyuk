const socket = io();
const urlParams = new URLSearchParams(window.location.pathname.split('/').pop());
const botId = window.location.pathname.split('/').pop();

let botInfo = null;

// Initialize chat
document.addEventListener('DOMContentLoaded', async () => {
    await loadBotInfo();
    await loadChatHistory();
    setupSocket();
    setupEventListeners();
});

async function loadBotInfo() {
    try {
        const response = await fetch(`/api/bots/${botId}`);
        botInfo = await response.json();
        
        document.getElementById('botName').textContent = botInfo.name;
        document.getElementById('botDescription').textContent = botInfo.description;
        document.getElementById('botAvatar').src = botInfo.profileImage;
    } catch (error) {
        console.error('Error loading bot info:', error);
    }
}

async function loadChatHistory() {
    try {
        const response = await fetch(`/api/chat/${botId}`);
        const chats = await response.json();
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        chats.forEach(chat => {
            addMessageToChat(chat.message, chat.sender);
        });
        
        scrollToBottom();
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function setupSocket() {
    socket.emit('join-chat', botId);
    
    socket.on('new-message', (message) => {
        if (message.botId === botId) {
            addMessageToChat(message.message, message.sender);
            scrollToBottom();
        }
    });
}

function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            sendUserMessage(message);
            messageInput.value = '';
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

async function sendUserMessage(message) {
    // Add user message immediately
    addMessageToChat(message, 'user');
    scrollToBottom();
    
    // Emit via socket for real-time
    socket.emit('send-message', {
        botId: botId,
        message: message,
        sender: 'user'
    });
    
    try {
        // Send to server for AI processing
        const response = await fetch(`/api/chat/${botId}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                botPersona: botInfo.persona
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChat('Maaf, terjadi error. Silakan coba lagi.', 'bot');
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
