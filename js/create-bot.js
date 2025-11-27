document.getElementById('createBotForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('botName').value,
        description: document.getElementById('botDescription').value,
        persona: document.getElementById('botPersona').value,
        profileImage: document.getElementById('profileImage').value,
        creator: document.getElementById('creatorName').value || 'Anonymous'
    };

    try {
        const response = await fetch('/api/bots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const bot = await response.json();
            showSuccessMessage(bot._id);
        } else {
            alert('Error creating bot');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating bot');
    }
});

function showSuccessMessage(botId) {
    document.getElementById('createBotForm').classList.add('hidden');
    
    const successMessage = document.getElementById('successMessage');
    const botLink = document.getElementById('botLink');
    
    botLink.href = `/chat/${botId}`;
    botLink.textContent = `${window.location.origin}/chat/${botId}`;
    
    successMessage.classList.remove('hidden');
}

function copyLink() {
    const link = document.getElementById('botLink').href;
    navigator.clipboard.writeText(link).then(() => {
        alert('Link berhasil disalin!');
    });
}
