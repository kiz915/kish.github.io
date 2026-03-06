/**
 * AI Chatbot Module - Intelligent Assistant
 * KISHORE Portfolio System
 */

const Chatbot = (function() {
    // Configuration
    const config = {
        botName: "KISHORE's Assistant",
        welcomeMessage: "Hi! I'm here to help you learn more about KISHORE. You can ask about skills, projects, certifications, or anything else!",
        typingDelay: 500,
        useExternalAPI: false,
        apiEndpoint: "https://api.openai.com/v1/chat/completions",
        apiKey: "YOUR_OPENAI_API_KEY",
        model: "gpt-3.5-turbo",
        maxTokens: 150,
        temperature: 0.7
    };

    // Knowledge base
    const knowledgeBase = [];

    // Build knowledge base from config
    function buildKnowledgeBase() {
        // Owner info
        knowledgeBase.push({
            patterns: ["who is kishore", "about kishore", "tell me about kishore", "about you", "introduce yourself", "who are you"],
            response: `I'm KISHORE, an Information Technology student at Sri Krishna College of Engineering and Technology (2025-2028 batch). I'm passionate about cloud computing and web development.`
        });

        // Skills
        const allSkills = [];
        for (let category in APP_CONFIG.skills) {
            allSkills.push(...APP_CONFIG.skills[category].map(s => s.name));
        }
        
        knowledgeBase.push({
            patterns: ["skills", "technologies", "what can you do", "expertise", "programming languages"],
            response: `I'm learning various technologies including: ${allSkills.join(', ')}. My strongest areas are Python and web development fundamentals.`
        });

        // Projects
        if (APP_CONFIG.projects.length > 0) {
            const projList = APP_CONFIG.projects.map(p => p.title).join(', ');
            knowledgeBase.push({
                patterns: ["projects", "portfolio", "work", "what have you built"],
                response: `I've worked on projects like: ${projList}. You can check them out in the Projects section!`
            });

            // Individual project details
            APP_CONFIG.projects.forEach(proj => {
                knowledgeBase.push({
                    patterns: [proj.title.toLowerCase(), ...proj.title.toLowerCase().split(' ')],
                    response: `${proj.title}: ${proj.description}. Technologies used: ${proj.technologies.join(', ')}.`
                });
            });
        }

        // Certifications
        const completedCerts = APP_CONFIG.certifications.filter(c => c.progress === 100).map(c => c.name);
        if (completedCerts.length > 0) {
            knowledgeBase.push({
                patterns: ["certifications", "certificates", "courses", "qualified"],
                response: `I have completed certifications in: ${completedCerts.join(', ')}. I'm also working on Google Cloud Digital Leader (60% complete).`
            });
        }

        // Education
        knowledgeBase.push({
            patterns: ["education", "college", "studies", "university", "degree"],
            response: `I'm currently pursuing B.Tech in Information Technology at SKCET (2025-2028 batch). I completed my higher secondary education at Kendriya Vidyalaya.`
        });

        // Contact
        knowledgeBase.push({
            patterns: ["contact", "email", "phone", "reach", "message", "get in touch"],
            response: `You can reach me at:\n📧 Email: kishore.it@skcet.edu.in\n📱 Phone: +91 93632 65552\n💬 WhatsApp: +91 9363265552\nAlso check out my social links in the Contact section!`
        });

        // Location
        knowledgeBase.push({
            patterns: ["location", "where are you", "city", "place", "address"],
            response: `I'm based in Coimbatore, Tamil Nadu, India.`
        });

        // Current focus
        knowledgeBase.push({
            patterns: ["learning", "studying", "currently", "focus", "working on"],
            response: `I'm currently focusing on:\n• AWS Cloud concepts\n• Building more portfolio projects\n• Improving my Python skills\n• Google Cloud certification (60% complete)`
        });

        // Fallback
        knowledgeBase.push({
            patterns: ["*"],
            response: `I'm not sure about that. You can try asking about my skills, projects, certifications, education, or contact information. Or check out the different sections on the website!`
        });
    }

    // DOM elements
    let container, toggleBtn, windowEl, closeBtn, messagesEl, inputEl, sendBtn;

    // State
    let isOpen = false;
    let isTyping = false;
    let conversationHistory = [];

    // Initialize
    function init() {
        buildKnowledgeBase();
        cacheElements();
        attachEvents();
        loadConversation();
        
        if (conversationHistory.length === 0) {
            addBotMessage(config.welcomeMessage);
        } else {
            restoreMessages();
        }
    }

    function cacheElements() {
        container = document.getElementById('chatbotContainer');
        toggleBtn = document.getElementById('chatbotToggleBtn');
        windowEl = document.getElementById('chatbotWindow');
        closeBtn = document.getElementById('chatbotCloseBtn');
        messagesEl = document.getElementById('chatbotMessages');
        inputEl = document.getElementById('chatbotInput');
        sendBtn = document.getElementById('chatbotSendBtn');
    }

    function attachEvents() {
        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', closeChat);
        sendBtn.addEventListener('click', sendMessage);
        
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && !windowEl.contains(e.target) && !toggleBtn.contains(e.target)) {
                closeChat();
            }
        });
    }

    function toggleChat() {
        if (isOpen) closeChat();
        else openChat();
    }

    function openChat() {
        windowEl.classList.add('open');
        isOpen = true;
        setTimeout(() => inputEl.focus(), 300);
    }

    function closeChat() {
        windowEl.classList.remove('open');
        isOpen = false;
    }

    function sendMessage() {
        const text = inputEl.value.trim();
        if (!text || isTyping) return;

        addUserMessage(text);
        inputEl.value = '';
        setTyping(true);

        // Process message
        processMessage(text).then(reply => {
            setTyping(false);
            addBotMessage(reply);
        }).catch(error => {
            setTyping(false);
            addBotMessage("Sorry, I encountered an error. Please try again later.");
            console.error('Chatbot error:', error);
        });
    }

    async function processMessage(userText) {
        const lowerText = userText.toLowerCase();
        
        // Check knowledge base first
        for (let item of knowledgeBase) {
            for (let pattern of item.patterns) {
                if (pattern !== "*" && lowerText.includes(pattern)) {
                    return item.response;
                }
            }
        }

        // Check for greetings
        if (lowerText.match(/\b(hi|hello|hey|greetings)\b/)) {
            return "Hello! How can I help you learn more about KISHORE?";
        }

        // Check for thanks
        if (lowerText.match(/\b(thanks|thank you|appreciate)\b/)) {
            return "You're welcome! Feel free to ask if you have more questions.";
        }

        // Check for goodbye
        if (lowerText.match(/\b(bye|goodbye|see you)\b/)) {
            return "Goodbye! Feel free to come back if you have more questions.";
        }

        // Use external API if enabled
        if (config.useExternalAPI && config.apiKey !== "YOUR_OPENAI_API_KEY") {
            try {
                return await callExternalAPI(userText);
            } catch (error) {
                console.error('API error:', error);
            }
        }

        // Fallback
        const fallback = knowledgeBase.find(item => item.patterns.includes("*"));
        return fallback ? fallback.response : "I'm not sure how to answer that. Please ask about my skills, projects, or contact info.";
    }

    async function callExternalAPI(userText) {
        const messages = [
            { 
                role: "system", 
                content: `You are a helpful assistant for KISHORE's portfolio website. KISHORE is an Information Technology student at SKCET (2025-2028 batch). Answer questions about KISHORE concisely and friendly.` 
            },
            ...conversationHistory.slice(-5).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: "user", content: userText }
        ];

        const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                max_tokens: config.maxTokens,
                temperature: config.temperature
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.textContent = text;
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveMessage('user', text);
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';
        
        // Format text with line breaks
        const formattedText = text.replace(/\n/g, '<br>');
        msgDiv.innerHTML = formattedText;
        
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveMessage('bot', text);
    }

    function setTyping(typing) {
        isTyping = typing;
        const typingIndicator = document.querySelector('.typing-indicator');
        
        if (typing) {
            if (!typingIndicator) {
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

    function saveMessage(sender, text) {
        conversationHistory.push({ 
            sender, 
            text, 
            timestamp: new Date().toISOString() 
        });
        
        // Keep only last 50 messages
        if (conversationHistory.length > 50) {
            conversationHistory = conversationHistory.slice(-50);
        }
        
        localStorage.setItem('chatbot_history', JSON.stringify(conversationHistory));
    }

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

    function restoreMessages() {
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

    // Public API
    return {
        init: init,
        open: openChat,
        close: closeChat,
        sendMessage: (text) => {
            inputEl.value = text;
            sendMessage();
        },
        clearHistory: () => {
            conversationHistory = [];
            localStorage.removeItem('chatbot_history');
            messagesEl.innerHTML = '';
            addBotMessage(config.welcomeMessage);
        }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chatbotContainer')) {
        Chatbot.init();
    }
});

window.Chatbot = Chatbot;
