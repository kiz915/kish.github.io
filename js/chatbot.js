/**
 * AI Chatbot Module - Intelligent Assistant for KISHORE Portfolio
 * Version: 2.0 - Theme aware with light/dark mode support
 */

const Chatbot = (function() {
    // Configuration
    const config = {
        botName: "KISHORE's Assistant",
        welcomeMessage: "Hi! I'm here to help you learn more about KISHORE (25IT161). Ask me about his skills, projects, certifications, education, or contact information!",
        typingDelay: 500,
        errorMessage: "Sorry, I encountered an error. Please try again."
    };

    // Knowledge base about KISHORE
    const knowledgeBase = [
        {
            patterns: ["who is kishore", "about kishore", "tell me about kishore", "about you", "introduce yourself", "who are you"],
            response: "I'm KISHORE, an Information Technology student at Sri Krishna College of Engineering and Technology (SKCET). My roll number is 25IT161 and I'm from the batch 2025-2028. I'm passionate about cloud computing, web development, and creating AMVs (Anime Music Videos)."
        },
        {
            patterns: ["skills", "technologies", "what can you do", "expertise", "programming languages", "what do you know"],
            response: "I'm currently learning various technologies including: Python (65%), JavaScript (50%), HTML/CSS (70%), AWS (40%), and Firebase (35%). I'm also skilled in AMV creation (60%) and video editing (55%)."
        },
        {
            patterns: ["projects", "portfolio", "work", "what have you built"],
            response: "I've built a Personal Portfolio Website using HTML, CSS, and JavaScript, and a Weather App using JavaScript and API integration. You can check them out on my GitHub: https://github.com/kiz915"
        },
        {
            patterns: ["certifications", "certificates", "courses", "qualified", "certified"],
            response: "I have completed 2 certifications: AWS Cloud Practitioner Essentials (100%) and Introduction to Python (100%). I'm currently working on Google Cloud Digital Leader (60% complete)."
        },
        {
            patterns: ["education", "college", "studies", "university", "degree", "school"],
            response: "I'm currently pursuing B.Tech in Information Technology at Sri Krishna College of Engineering and Technology (SKCET) with roll number 25IT161 (2025-2028 batch). I completed my higher secondary education at Kendriya Vidyalaya (2023-2025)."
        },
        {
            patterns: ["contact", "email", "phone", "reach", "message", "get in touch", "how to contact"],
            response: "You can reach me at:\n📧 Email: kishorevk40@gmail.com\n📱 Phone: +91 63743 72312\n💬 WhatsApp: +91 63743 72312\n🔗 LinkedIn: linkedin.com/in/kishore-v-a363433a9\n📸 Instagram: @kishore_amv\n💻 GitHub: kiz915"
        },
        {
            patterns: ["location", "where are you", "city", "place", "address", "from"],
            response: "I'm based in Coimbatore, Tamil Nadu, India. I study at SKCET which is located in Coimbatore."
        },
        {
            patterns: ["roll number", "roll no", "25IT161", "registration number"],
            response: "My roll number is 25IT161. I'm a first-year student in the Information Technology department at SKCET."
        },
        {
            patterns: ["amv", "anime", "video editing", "creative"],
            response: "Yes! I create Anime Music Videos (AMVs) as a hobby. I have about 60% proficiency in AMV creation and 55% in video editing. It's a creative outlet I really enjoy!"
        },
        {
            patterns: ["github", "kiz915", "code", "repository"],
            response: "My GitHub username is kiz915. You can find all my projects at: https://github.com/kiz915"
        },
        {
            patterns: ["instagram", "kishore_amv", "social media"],
            response: "My Instagram handle is @kishore_amv. Feel free to follow me there!"
        },
        {
            patterns: ["linkedin", "professional"],
            response: "Connect with me on LinkedIn: https://www.linkedin.com/in/kishore-v-a363433a9/"
        },
        {
            patterns: ["whatsapp", "phone"],
            response: "You can reach me on WhatsApp at +91 63743 72312"
        },
        {
            patterns: ["hi", "hello", "hey", "greetings"],
            response: "Hello! How can I help you learn more about KISHORE today?"
        },
        {
            patterns: ["thanks", "thank you", "appreciate", "helpful"],
            response: "You're welcome! Feel free to ask if you have more questions about KISHORE."
        },
        {
            patterns: ["bye", "goodbye", "see you", "exit"],
            response: "Goodbye! Feel free to come back if you have more questions about KISHORE (25IT161)."
        },
        {
            patterns: ["what can you do", "help", "capabilities"],
            response: "I can answer questions about KISHORE's skills, projects, certifications, education, contact information, and more. Just ask me anything about him!"
        }
    ];

    // DOM elements
    let container, toggleBtn, windowEl, closeBtn, messagesEl, inputEl, sendBtn;

    // State
    let isOpen = false;
    let isTyping = false;
    let conversationHistory = [];

    // Initialize chatbot
    function init() {
        cacheElements();
        attachEvents();
        loadConversation();
        updateChatbotTheme();
        
        // Show welcome message if no history
        if (conversationHistory.length === 0) {
            addBotMessage(config.welcomeMessage);
        } else {
            restoreMessages();
        }
        
        // Listen for theme changes
        observeThemeChanges();
    }

    // Cache DOM elements
    function cacheElements() {
        container = document.getElementById('chatbotContainer');
        toggleBtn = document.getElementById('chatbotToggleBtn');
        windowEl = document.getElementById('chatbotWindow');
        closeBtn = document.getElementById('chatbotCloseBtn');
        messagesEl = document.getElementById('chatbotMessages');
        inputEl = document.getElementById('chatbotInput');
        sendBtn = document.getElementById('chatbotSendBtn');
    }

    // Attach event listeners
    function attachEvents() {
        if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
        if (closeBtn) closeBtn.addEventListener('click', closeChat);
        if (sendBtn) sendBtn.addEventListener('click', sendMessage);
        
        if (inputEl) {
            inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && windowEl && !windowEl.contains(e.target) && toggleBtn && !toggleBtn.contains(e.target)) {
                closeChat();
            }
        });
    }

    // Toggle chat window
    function toggleChat() {
        if (isOpen) closeChat();
        else openChat();
    }

    // Open chat window
    function openChat() {
        if (windowEl) {
            windowEl.classList.add('open');
            isOpen = true;
            setTimeout(() => {
                if (inputEl) inputEl.focus();
            }, 300);
        }
    }

    // Close chat window
    function closeChat() {
        if (windowEl) {
            windowEl.classList.remove('open');
            isOpen = false;
        }
    }

    // Send message
    function sendMessage() {
        if (!inputEl) return;
        
        const text = inputEl.value.trim();
        if (!text || isTyping) return;

        addUserMessage(text);
        inputEl.value = '';
        setTyping(true);

        // Process message
        setTimeout(() => {
            const reply = processMessage(text);
            setTyping(false);
            addBotMessage(reply);
        }, config.typingDelay);
    }

    // Process message and return reply
    function processMessage(userText) {
        const lowerText = userText.toLowerCase();
        
        // Check knowledge base for matches
        for (let item of knowledgeBase) {
            for (let pattern of item.patterns) {
                if (lowerText.includes(pattern.toLowerCase())) {
                    return item.response;
                }
            }
        }
        
        // Check for questions about skills
        if (lowerText.includes('skill') || lowerText.includes('know')) {
            return "I have skills in Python (65%), JavaScript (50%), HTML/CSS (70%), AWS (40%), and AMV creation (60%). Ask me about specific skills for more details!";
        }
        
        // Check for project-related questions
        if (lowerText.includes('project') || lowerText.includes('built') || lowerText.includes('made')) {
            return "I've built a Portfolio Website and a Weather App. Check them out in the Projects section or on my GitHub (kiz915)!";
        }
        
        // Default response
        return "I'm not sure about that. You can ask me about KISHORE's skills, projects, certifications, education, contact details, or social media. How can I help you?";
    }

    // Add user message to chat
    function addUserMessage(text) {
        if (!messagesEl) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.textContent = text;
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveMessage('user', text);
    }

    // Add bot message to chat
    function addBotMessage(text) {
        if (!messagesEl) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';
        
        // Format text with line breaks
        const formattedText = text.replace(/\n/g, '<br>');
        msgDiv.innerHTML = formattedText;
        
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveMessage('bot', text);
    }

    // Show/hide typing indicator
    function setTyping(typing) {
        isTyping = typing;
        const typingIndicator = document.querySelector('.typing-indicator');
        
        if (typing) {
            if (!typingIndicator && messagesEl) {
                const indicator = document.createElement('div');
                indicator.className = 'typing-indicator';
                indicator.innerHTML = '<span></span><span></span><span></span>';
                messagesEl.appendChild(indicator);
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }
            if (sendBtn) sendBtn.disabled = true;
        } else {
            if (typingIndicator) typingIndicator.remove();
            if (sendBtn) sendBtn.disabled = false;
        }
    }

    // Save message to history
    function saveMessage(sender, text) {
        conversationHistory.push({ 
            sender, 
            text, 
            timestamp: new Date().toISOString() 
        });
        
        // Keep only last 30 messages
        if (conversationHistory.length > 30) {
            conversationHistory = conversationHistory.slice(-30);
        }
        
        localStorage.setItem('chatbot_history', JSON.stringify(conversationHistory));
    }

    // Load conversation from localStorage
    function loadConversation() {
        const saved = localStorage.getItem('chatbot_history');
        if (saved) {
            try {
                conversationHistory = JSON.parse(saved);
            } catch (e) {
                conversationHistory = [];
            }
        }
    }

    // Restore messages from history
    function restoreMessages() {
        if (!messagesEl) return;
        
        messagesEl.innerHTML = '';
        conversationHistory.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.sender}`;
            
            if (msg.sender === 'bot') {
                div.innerHTML = msg.text.replace(/\n/g, '<br>');
            } else {
                div.textContent = msg.text;
            }
            
            messagesEl.appendChild(div);
        });
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Update chatbot theme based on current theme
    function updateChatbotTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const chatWindow = document.querySelector('.chatbot-window');
        
        if (chatWindow) {
            if (currentTheme === 'dark') {
                chatWindow.style.setProperty('--chatbot-bg', '#1e293b');
                chatWindow.style.setProperty('--chatbot-text', '#f8fafc');
                chatWindow.style.setProperty('--chatbot-border', '#334155');
            } else {
                chatWindow.style.setProperty('--chatbot-bg', '#ffffff');
                chatWindow.style.setProperty('--chatbot-text', '#0f172a');
                chatWindow.style.setProperty('--chatbot-border', '#e2e8f0');
            }
        }
    }

    // Observe theme changes
    function observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    updateChatbotTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }

    // Clear conversation history
    function clearHistory() {
        conversationHistory = [];
        localStorage.removeItem('chatbot_history');
        if (messagesEl) {
            messagesEl.innerHTML = '';
            addBotMessage(config.welcomeMessage);
        }
    }

    // Public API
    return {
        init: init,
        open: openChat,
        close: closeChat,
        clearHistory: clearHistory,
        sendMessage: (text) => {
            if (inputEl) {
                inputEl.value = text;
                sendMessage();
            }
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chatbotContainer')) {
        Chatbot.init();
    }
});

// Expose globally for debugging
window.Chatbot = Chatbot;
