const socket = io();

document.addEventListener('DOMContentLoaded', loadBots);

async function loadBots() {
    try {
        const response = await fetch('/api/bots');
        const bots = await response.json();
        displayBots(bots);
    } catch (error) {
        console.error('Error loading bots:', error);
    }
}

function displayBots(bots) {
    const botsList = document.getElementById('botsList');
    botsList.innerHTML = '';

    bots.forEach(bot => {
        const botCard = document.createElement('div');
        botCard.className = 'bot-card';
        botCard.onclick = () => openChat(bot._id);
        
        botCard.innerHTML = `
            <img src="${bot.profileImage}" alt="${bot.name}" class="bot-avatar" 
                 onerror="this.src='https://via.placeholder.com/60?text=🤖'">
            <h3>${bot.name}</h3>
            <p>${bot.description}</p>
            <small>Dibuat oleh: ${bot.creator}</small>
        `;
        
        botsList.appendChild(botCard);
    });
}

function createBot() {
    window.location.href = '/create-bot';
}

function openChat(botId) {
    window.location.href = `/chat/${botId}`;
}
