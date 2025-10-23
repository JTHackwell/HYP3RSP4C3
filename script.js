// Initialize Vanta.js background
VANTA.NET({
    el: "#vanta-bg",
    color: 0x00ff00,
    backgroundColor: 0x000000,
    points: 10.00,
    maxDistance: 20.00,
    spacing: 15.00,
});

// Update datetime
function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('datetime').textContent = `${date} ${time}`;
}

// Call updateDateTime once and set interval
setInterval(updateDateTime, 1000);
updateDateTime();

// Feather icons
feather.replace();

// DeepSeek AI Configuration
const DEEPSEEK_API_KEY = 'sk-10b9a5a1b6ec4d06a4f04584330b031f';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// DeepSeek AI functionality
function initializeDeepSeek() {
    const deepseekInput = document.getElementById('deepseek-input');
    const deepseekSend = document.getElementById('deepseek-send');
    const deepseekClear = document.getElementById('deepseek-clear');
    const deepseekConversation = document.getElementById('deepseek-conversation');
    const deepseekStatus = document.getElementById('deepseek-status');
    const deepseekAccess = document.getElementById('deepseek-access');

    // Scroll to DeepSeek section when AI button is clicked
    if (deepseekAccess) {
        deepseekAccess.addEventListener('click', () => {
            document.querySelector('.jarvis-panel:nth-child(2)').scrollIntoView({
                behavior: 'smooth'
            });
            deepseekInput.focus();
        });
    }

    // Send message to DeepSeek
    async function sendToDeepSeek(message) {
        try {
            deepseekStatus.textContent = 'Thinking...';

            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{
                            role: 'system',
                            content: 'You are a helpful AI assistant integrated into the HYP3RSP4C3 system. Provide clear, concise, and helpful responses.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Add user message to conversation
            const userDiv = document.createElement('div');
            userDiv.className = 'mb-2';
            userDiv.innerHTML = `<span class="text-green-400">&gt; You:</span> <span class="text-green-300">${message}</span>`;
            deepseekConversation.appendChild(userDiv);

            // Add AI response to conversation
            const aiDiv = document.createElement('div');
            aiDiv.className = 'mb-3 pl-2 border-l-2 border-green-400';
            aiDiv.innerHTML = `<span class="text-green-400">&gt; DeepSeek:</span> <span class="text-green-300">${aiResponse}</span>`;
            deepseekConversation.appendChild(aiDiv);

            // Scroll to bottom
            deepseekConversation.scrollTop = deepseekConversation.scrollHeight;

            deepseekStatus.textContent = 'Ready';
        } catch (error) {
            console.error('DeepSeek API Error:', error);

            const errorDiv = document.createElement('div');
            errorDiv.className = 'mb-2 text-red-400';
            errorDiv.innerHTML = `<span class="text-red-400">&gt; Error:</span> Failed to connect to DeepSeek AI. Please try again.`;
            deepseekConversation.appendChild(errorDiv);
            deepseekConversation.scrollTop = deepseekConversation.scrollHeight;

            deepseekStatus.textContent = 'Error - Ready';
        }
    }

    // Send button click handler
    if (deepseekSend) {
        deepseekSend.addEventListener('click', () => {
            const message = deepseekInput.value.trim();
            if (message) {
                sendToDeepSeek(message);
                deepseekInput.value = '';
            }
        });
    }

    // Enter key handler
    if (deepseekInput) {
        deepseekInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = deepseekInput.value.trim();
                if (message) {
                    sendToDeepSeek(message);
                    deepseekInput.value = '';
                }
            }
        });
    }

    // Clear conversation
    if (deepseekClear) {
        deepseekClear.addEventListener('click', () => {
            deepseekConversation.innerHTML = `
                <p class="text-green-400">&gt; DeepSeek AI Assistant Initialized</p>
                <p class="text-green-300">&gt; Ask me anything - I'm here to help!</p>
            `;
            deepseekStatus.textContent = 'Ready';
        });
    }
}

// Add event listener for NETWORK button in Quick Access
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DeepSeek AI functionality
    initializeDeepSeek();
});
// Terminal simulation
const terminalInput = document.querySelector('.terminal-input input');
const terminalOutput = document.querySelector('.terminal-output');
terminalInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        terminalInput.value = '';
        // Add command to output
        const commandElement = document.createElement('p');
        commandElement.className = 'text-green-400';
        commandElement.innerHTML = `> ${command}`;
        terminalOutput.appendChild(commandElement);
        // Save command to history for admin panel
        if (!window._cmdHistory) window._cmdHistory = [];
        window._cmdHistory.push(command);
        // Process command
        let response = '';
        const commandParts = command.toLowerCase().split(' ');
        const mainCommand = commandParts[0];
        // ...existing code...
        if (/^run\s+-/.test(command)) {
            const flag = command.split(' ')[1];
            switch (flag) {
                case '-d':
                    response = `[DEBUG MODE ACTIVATED]<br>
                    SYSTEM DIAGNOSTICS RUNNING...<br>
                    DEBUG DATA STREAM ENABLED`;
                    break;
                case '-s':
                    response = `[SECURITY SCAN INITIATED]<br>
                    RUNNING DEEP SYSTEM SCAN...<br>
                    ESTIMATED TIME: 2.7 SECONDS`;
                    break;
                case '-u':
                    response = `[SYSTEM UPDATE STARTED]<br>
                    DOWNLOADING PACKAGES...<br>
                    APPLYING SECURITY PATCHES...`;
                    break;
                case '-r':
                    response = `[RESTART SEQUENCE INITIATED]<br>
                    SAVING ALL PROCESSES...<br>
                    PREPARING FOR REBOOT...`;
                    break;
                case '-gn-math':
                    response = `[MATH RESOURCES LOADED]<br>
                    AVAILABLE LINKS:<br>
                    - <a href="https://algebraicformulas-15007560.codehs.me/" class="text-green-400 hover:text-green-200 underline" target="_blank">Math Resource</a>`;
                    break;
                case 'shadow':
                    window.open('https://quickphysics.a-quo.com/', '_blank');
                    response = `ACTIVATING QUANTUM PHYSICS PORTAL...<br>
                    REDIRECTING TO SHADOW REALM...<br>
                    (You can also click the SHADOW button in Quick Access)`;
                    break;
                default:
                    response = `ERROR: UNKNOWN FLAG '${flag}'<br>
                    AVAILABLE FLAGS:<br>
                    -d: Debug mode<br>
                    -s: Security scan<br>
                    -u: System update<br>
                    -r: Restart sequence`;
            }
        } else if (mainCommand === 'halo') {
            // H.A.L.O assistant interaction
            let haloMsg = `<b>H.A.L.O:</b> Hello, I am your personal assistant! I can help you with math, science, and problem solving.<br>`;
            haloMsg += `Type your question in the calculator panel, or ask for help with formulas, physics, or math concepts.<br>`;
            haloMsg += `Examples: <br>- "E=mc^2" <br>- "What is Newton's second law?" <br>- "Graph sin(x)" <br>- "Area of a circle"`;
            response = haloMsg;
        } else {
            switch (mainCommand) {
                case 'help':
                    response = `AVAILABLE COMMANDS:<br>
                    - HELP: Show this help message<br>
                    - STATUS: Display current system metrics<br>
                    - SCAN: Perform security diagnostics<br>
                    - CLEAR: Reset terminal display<br>
                    - CONNECT: Establish secure tunnel<br>
                    - TIME: Show current system time<br>
                    - CREDITS: View developer information<br>
                    - BONKERS: Easter egg command<br>
                    - GN-MATH: Access math resources<br>
                    - UTOPIA: Access paradise interface<br>
                    - QUOTE: Get random hacker quote<br>
                    - WHOAMI: Show current user profile<br>
                    - NETSTAT: Display connection status<br>
                    - ENCRYPT: Toggle encryption protocol<br>
                    - HISTORY: View command log<br>
                    - EXIT: Terminate session<br>
                    - DISCONNECT: Return to unmasked state<br>
                    - RUN: Execute system operations (use with flags)<br>
                    - REBOOT: Reset terminal interface<br>
                    - SHADOW: Access quantum physics portal<br>
                    - AI: Access DeepSeek AI Assistant`;
                    break;
                case 'status':
                    response = `SYSTEM STATUS:<br>
                    - CPU: 75% LOAD<br>
                    - RAM: 60% USED<br>
                    - STORAGE: 45% FULL<br>
                    - NETWORK: SECURE`;
                    break;
                case 'scan':
                    response = `INITIATING SITE DIAGNOSTIC...<br>`;
                    // Simulate diagnostic checks
                    setTimeout(() => {
                        let diag = '';
                        diag += 'Checking HTML structure... <span class="text-green-400">OK</span><br>';
                        diag += 'Checking CSS file... <span class="text-green-400">OK</span><br>';
                        diag += 'Checking JavaScript file... <span class="text-green-400">OK</span><br>';
                        diag += 'Checking external resources... <span class="text-green-400">OK</span><br>';
                        diag += 'Checking terminal responsiveness... <span class="text-green-400">OK</span><br>';
                        diag += 'Checking security features... <span class="text-green-400">OK</span><br>';
                        diag += '<b>DIAGNOSTIC COMPLETE: NO ISSUES DETECTED</b>';
                        const responseElement = document.createElement('p');
                        responseElement.className = 'text-green-300';
                        responseElement.innerHTML = diag;
                        terminalOutput.appendChild(responseElement);
                        terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    }, 1200);
                    break;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    return;
                case 'connect':
                    response = `ESTABLISHING SECURE CONNECTION...<br>
                    ENCRYPTING DATA...<br>
                    ROUTING THROUGH [REDACTED] PROXY NODES...<br>
                    MASKING IP: [***.***.***.***]<br>
                    OBFUSCATING URL TRAFFIC...<br>
                    CONNECTION ESTABLISHED: SECURE<br>
                    URL MASKED FOR ANONYMITY<br>
                    WARNING: ALL REQUESTS NOW ROUTED THROUGH TOR NETWORK`;
                    // Mask the URL in the address bar
                    window.history.replaceState({}, '', '/connected');
                    break;
                case 'time':
                    updateDateTime();
                    response = `SYSTEM TIME: ${document.getElementById('datetime').textContent}`;
                    break;
                case 'credits':
                    response = `HYP3RSP4C3 TERMINAL v1.3.7<br>
                    DEVELOPED BY UNKNOWN ENTITY<br>
                    [REDACTED] SECURITY PROTOCOLS ACTIVE`;
                    break;
                case 'bonkers':
                    response = `WARNING: ACTIVATING [REDACTED] PROTOCOL<br>
                    SYSTEM OVERLOAD IMMINENT<br>
                    ...just kidding :)`;
                    break;
                case 'gn-math':
                    window.open('https://algebraicformulas-15007560.codehs.me/', '_blank');
                    response = `REDIRECTING TO MATH RESOURCES...`;
                    break;
                case 'utopia':
                    window.open('https://excel.theme.ryansilvester.com/', '_blank');
                    response = `INITIATING UTOPIA PROTOCOL... REDIRECTING TO PARADISE...`;
                    break;
                case 'quote':
                    // 50% chance for Iron Man quote, 50% for computer quote
                    if (Math.random() < 0.5) {
                        // Iron Man quotes
                        const ironManQuotes = [
                            { content: "I am Iron Man.", author: "Tony Stark" },
                            { content: "Genius, billionaire, playboy, philanthropist.", author: "Tony Stark" },
                            { content: "If we can't protect the Earth, you can be damn sure we'll avenge it.", author: "Tony Stark" },
                            { content: "Sometimes you gotta run before you can walk.", author: "Tony Stark" },
                            { content: "It's not about how much we lost, it's about how much we have left.", author: "Tony Stark" },
                            { content: "Doth mother know you weareth her drapes?", author: "Tony Stark" }
                        ];
                        const q = ironManQuotes[Math.floor(Math.random() * ironManQuotes.length)];
                        const responseElement = document.createElement('p');
                        responseElement.className = 'text-green-300';
                        responseElement.innerHTML = `QUOTE: "${q.content}"<br>- ${q.author}`;
                        terminalOutput.appendChild(responseElement);
                        terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    } else {
                        fetch('https://api.quotable.io/random?tags=technology,computers')
                            .then(response => response.json())
                            .then(data => {
                                const responseElement = document.createElement('p');
                                responseElement.className = 'text-green-300';
                                responseElement.innerHTML = `QUOTE: "${data.content}"<br>- ${data.author}`;
                                terminalOutput.appendChild(responseElement);
                                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                            });
                    }
                    return;
                    response = `USER PROFILE:<br>
                    ID: [REDACTED]<br>
                    ACCESS: ADMIN<br>
                    CLEARANCE: LEVEL 5<br>
                    LAST LOGIN: NEVER`;
                    break;
                case 'netstat':
                    response = `NETWORK STATUS:<br>
                    - PROTOCOL: TCP/IP<br>
                    - ENCRYPTION: AES-256<br>
                    - PORTS: 22, 80, 443<br>
                    - THREATS: 0 DETECTED`;
                    break;
                case 'encrypt':
                    response = `TOGGLING ENCRYPTION...<br>
                    NEW PROTOCOL: QUANTUM-RESISTANT<br>
                    KEY ROTATION ACTIVATED`;
                    break;
                case 'history':
                    response = `COMMAND HISTORY:<br>
                    > [REDACTED]<br>
                    > [REDACTED]<br>
                    > [REDACTED]<br>
                    ACCESS RESTRICTED`;
                    break;
                case 'exit':
                    response = `TERMINAL SESSION TERMINATED<br>
                    LOGGING OUT USER [REDACTED]<br>
                    ALL CONNECTIONS SECURED`;
                    break;
                case 'disconnect':
                    response = `TERMINATING SECURE CONNECTION...<br>
                    DISABLING ENCRYPTION...<br>
                    UNMASKING IP...<br>
                    ROUTING DIRECTLY...<br>
                    CONNECTION NOW IN CLEARTEXT<br>
                    URL UNMASKED<br>
                    WARNING: TRAFFIC IS NOW VISIBLE TO NETWORK MONITORS`;
                    // Restore the original URL in the address bar
                    window.history.replaceState({}, '', window.location.pathname.replace('/connected', '/index.html'));
                    break;
                case 'reboot':
                    response = `INITIATING SYSTEM REBOOT...<br>
                    SAVING SESSION DATA...<br>
                    TERMINATING PROCESSES...<br>
                    RELOADING INTERFACE...`;
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                    break;
                case 'ai':
                    response = `ACCESSING DEEPSEEK AI ASSISTANT...<br>
                    NEURAL NETWORKS INITIALIZED<br>
                    AI INTERFACE READY FOR QUERIES<br>
                    SCROLLING TO AI SECTION...`;
                    setTimeout(() => {
                        document.querySelector('.jarvis-panel:nth-child(2)').scrollIntoView({
                            behavior: 'smooth'
                        });
                        document.getElementById('deepseek-input').focus();
                    }, 1000);
                    break;
                default:
                    response = `ERROR: UNKNOWN COMMAND '${command}'<br>
                    TYPE 'HELP' FOR AVAILABLE COMMANDS`;
            }
        }
        const responseElement = document.createElement('p');
        responseElement.className = 'text-green-300';
        responseElement.innerHTML = response;
        terminalOutput.appendChild(responseElement);
        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});
