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

// Enhanced Response Processor for DeepSeek
function processDeepSeekResponse(rawResponse) {
    if (!rawResponse) return '';

    try {
        // Configure marked.js options for better rendering
        marked.setOptions({
            breaks: true,
            gfm: true, // GitHub Flavored Markdown
            tables: true,
            sanitize: false,
            highlight: function(code, lang) {
                // Basic syntax highlighting for code blocks
                return `<pre class="bg-gray-900 text-green-300 p-3 rounded border border-green-500 overflow-x-auto"><code class="language-${lang || 'text'}">${code}</code></pre>`;
            }
        });

        // Process the markdown content
        let processedContent = marked.parse(rawResponse);

        // Enhanced table styling for cyberpunk theme
        processedContent = processedContent.replace(
            /<table>/g,
            '<table class="table-auto border-collapse border border-green-500 w-full my-4 bg-black">'
        );
        processedContent = processedContent.replace(
            /<th>/g,
            '<th class="border border-green-500 px-4 py-2 bg-green-900 text-green-300 font-bold">'
        );
        processedContent = processedContent.replace(
            /<td>/g,
            '<td class="border border-green-500 px-4 py-2 text-green-300">'
        );

        // Enhanced code block styling
        processedContent = processedContent.replace(
            /<code>/g,
            '<code class="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm">'
        );

        // Enhanced blockquote styling
        processedContent = processedContent.replace(
            /<blockquote>/g,
            '<blockquote class="border-l-4 border-green-500 pl-4 italic text-green-300 my-2 bg-gray-900 py-2">'
        );

        // Enhanced list styling
        processedContent = processedContent.replace(
            /<ul>/g,
            '<ul class="list-disc list-inside text-green-300 my-2 space-y-1">'
        );
        processedContent = processedContent.replace(
            /<ol>/g,
            '<ol class="list-decimal list-inside text-green-300 my-2 space-y-1">'
        );

        // Enhanced heading styling
        processedContent = processedContent.replace(
            /<h1>/g,
            '<h1 class="text-2xl font-bold text-green-300 mb-3 hacker-glow">'
        );
        processedContent = processedContent.replace(
            /<h2>/g,
            '<h2 class="text-xl font-bold text-green-300 mb-2 hacker-glow">'
        );
        processedContent = processedContent.replace(
            /<h3>/g,
            '<h3 class="text-lg font-bold text-green-300 mb-2 hacker-glow">'
        );

        // Enhanced paragraph styling
        processedContent = processedContent.replace(
            /<p>/g,
            '<p class="text-green-300 mb-2 leading-relaxed">'
        );

        return processedContent;

    } catch (error) {
        console.error('Error processing DeepSeek response:', error);
        // Fallback to basic HTML escaping if markdown processing fails
        return rawResponse.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    }
}

// Function to render mathematical expressions after DOM update
function renderMathInElement(element) {
    if (window.MathJax && window.MathJax.typesetPromise) {
        // Add loading class temporarily
        const mathElements = element.querySelectorAll('.MathJax, mjx-container');
        mathElements.forEach(el => el.classList.add('math-loading'));

        // MathJax v3 rendering
        window.MathJax.typesetPromise([element]).then(() => {
            // Remove loading class after rendering
            mathElements.forEach(el => el.classList.remove('math-loading'));
        }).catch(function(err) {
            console.error('MathJax rendering error:', err);
            mathElements.forEach(el => el.classList.remove('math-loading'));
        });
    }
}

// Enhanced prompt suggestions for better formatting
function enhanceUserPrompt(userPrompt) {
    // Add formatting hints for common requests
    const formatHints = [];

    if (userPrompt.toLowerCase().includes('table') || userPrompt.toLowerCase().includes('compare')) {
        formatHints.push('Please format any data in a table using markdown table syntax (| Header | Header |)');
    }

    if (userPrompt.toLowerCase().includes('math') || userPrompt.toLowerCase().includes('equation') ||
        userPrompt.toLowerCase().includes('formula') || userPrompt.toLowerCase().includes('calculate')) {
        formatHints.push('Please use LaTeX notation for mathematical expressions ($ for inline math, $$ for display math)');
    }

    if (userPrompt.toLowerCase().includes('code') || userPrompt.toLowerCase().includes('programming') ||
        userPrompt.toLowerCase().includes('script')) {
        formatHints.push('Please format code using markdown code blocks with language specification');
    }

    if (userPrompt.toLowerCase().includes('list') || userPrompt.toLowerCase().includes('steps')) {
        formatHints.push('Please format lists using markdown list syntax (- for bullets, 1. for numbers)');
    }

    // Append hints to the original prompt if any were generated
    if (formatHints.length > 0) {
        return userPrompt + '\n\n[System formatting request: ' + formatHints.join(', ') + ']';
    }

    return userPrompt;
}

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
            // Smart status messages based on user input
            const statusMessages = [
                'Thinking...',
                'Processing...',
                'Analyzing...'
            ];

            if (message.toLowerCase().includes('table') || message.toLowerCase().includes('data')) {
                statusMessages.push('Generating table...');
            }
            if (message.toLowerCase().includes('math') || message.toLowerCase().includes('equation')) {
                statusMessages.push('Computing equations...');
            }
            if (message.toLowerCase().includes('code') || message.toLowerCase().includes('programming')) {
                statusMessages.push('Compiling response...');
            }

            deepseekStatus.textContent = statusMessages[Math.floor(Math.random() * statusMessages.length)];

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
                            content: 'You are a helpful AI assistant integrated into the HYP3RSP4C3 cyberpunk system. Provide clear, detailed responses using proper markdown formatting. Use tables when presenting data, mathematical expressions with LaTeX notation ($ for inline, $$ for display), code blocks with ```language syntax, headers with #, lists with - or 1., and **bold** or *italic* text for emphasis. Format your responses to be visually appealing and well-structured.'
                        },
                        {
                            role: 'user',
                            content: enhanceUserPrompt(message)
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
            const rawAiResponse = data.choices[0].message.content;

            // Add user message to conversation
            const userDiv = document.createElement('div');
            userDiv.className = 'mb-2';
            userDiv.innerHTML = `<span class="text-green-400">&gt; You:</span> <span class="text-green-300">${message}</span>`;
            deepseekConversation.appendChild(userDiv);

            // Process and add AI response to conversation
            const aiDiv = document.createElement('div');
            aiDiv.className = 'mb-3 pl-2 border-l-2 border-green-400 bg-gray-900 bg-opacity-30 rounded-r-lg p-3';

            // Process the response for proper rendering
            const processedResponse = processDeepSeekResponse(rawAiResponse);

            aiDiv.innerHTML = `
                <div class="text-green-400 font-bold mb-2 flex items-center">
                    <span class="animate-pulse mr-2">▶</span> DeepSeek AI:
                </div>
                <div class="deepseek-content pl-4">
                    ${processedResponse}
                </div>
            `;

            deepseekConversation.appendChild(aiDiv);

            // Render mathematical expressions if any
            renderMathInElement(aiDiv);

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

    // Initialize Calculator functionality
    initializeCalculator();
});

// Calculator functionality
function initializeCalculator() {
    const calcInput = document.getElementById('calc-input');
    const calcEval = document.getElementById('calc-eval');
    const calcGraph = document.getElementById('calc-graph');
    const calcResult = document.getElementById('calc-result');
    const calcGraphArea = document.getElementById('calc-graph-area');

    if (calcInput && calcEval && calcGraph && calcResult && calcGraphArea) {
        // Calculate button event listener
        calcEval.addEventListener('click', () => {
            const expression = calcInput.value.trim();
            if (expression) {
                try {
                    const result = calculateExpression(expression);
                    calcResult.innerHTML = result;

                    // Add assistant help if available
                    const help = assistantHelp(expression);
                    if (help) {
                        calcResult.innerHTML += `<br><span class="text-cyan-400"><b>Hint:</b> ${help}</span>`;
                    }
                } catch (error) {
                    calcResult.innerHTML = `<span class="text-red-400">Error: ${error.message}</span>`;
                }
            }
        });

        // Graph button event listener
        calcGraph.addEventListener('click', () => {
            const expression = calcInput.value.trim();
            if (expression) {
                try {
                    // Clear previous graph
                    calcGraphArea.innerHTML = '';

                    // Validate if expression is suitable for graphing
                    if (isGraphableExpression(expression)) {
                        plotGraph(expression, 'calc-graph-area');
                        calcResult.innerHTML = `<span class="text-green-400">✓ Graph generated for: ${expression}</span>`;
                    } else {
                        calcResult.innerHTML = `<span class="text-yellow-400">⚠ Expression must contain 'x' variable for graphing.<br>Examples: sin(x), x^2, log(x), sqrt(x), abs(x-2)</span>`;
                    }
                } catch (error) {
                    calcResult.innerHTML = `<span class="text-red-400">Graph Error: ${error.message}</span>`;
                }
            } else {
                calcResult.innerHTML = `<span class="text-yellow-400">Please enter a mathematical expression first.</span>`;
            }
        }); // Enter key support for calculator input
        calcInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                calcEval.click();
            } else if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                calcGraph.click();
            }
        });

        // Add placeholder cycling for better UX
        const placeholders = [
            '[ENTER MATH/PHYSICS EXPRESSION] > sin(x), E=mc^2, 2+2*3',
            '[GRAPHABLE FUNCTIONS] > x^2, cos(x), log(x), sqrt(x)',
            '[PHYSICS FORMULAS] > E=mc^2, F=ma, v=d/t',
            '[COMPLEX EXPRESSIONS] > sin(x)*cos(x), x^3-2*x+1'
        ];
        let placeholderIndex = 0;

        setInterval(() => {
            if (calcInput && calcInput !== document.activeElement) {
                placeholderIndex = (placeholderIndex + 1) % placeholders.length;
                calcInput.placeholder = placeholders[placeholderIndex];
            }
        }, 4000);
    }
}
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
                    - AI: Access DeepSeek AI Assistant<br>
                    - CMD: Access administrative interface [AUTH REQUIRED]<br>
                    - ADMIN: Alternative admin access [AUTH REQUIRED]`;
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
                case 'cmd':
                    response = `ACCESSING ADMINISTRATIVE INTERFACE...<br>
                    AUTHENTICATION REQUIRED<br>
                    PLEASE STAND BY...`;

                    // Show password prompt after a brief delay
                    setTimeout(() => {
                        showPasswordPrompt();
                    }, 1500);
                    break;
                case 'admin':
                    response = `INITIALIZING ADMIN PROTOCOL...<br>
                    SECURE AUTHENTICATION REQUIRED<br>
                    VERIFYING ADMINISTRATOR CREDENTIALS...`;

                    // Show password prompt after a brief delay
                    setTimeout(() => {
                        showPasswordPrompt();
                    }, 1500);
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

// ========================================
// ADMIN SYSTEM FUNCTIONALITY
// ========================================

// Admin system state
let adminState = {
    isLoggedIn: false,
    sessionStart: null,
    commandHistory: [],
    systemStats: {
        cpuUsage: 72,
        memoryUsage: 58,
        storageUsage: 43,
        activeSessions: 1
    }
};

// Password prompt functionality
function showPasswordPrompt() {
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('admin-password-input');
    const passwordFeedback = document.getElementById('password-feedback');

    // Reset modal state
    passwordInput.value = '';
    passwordInput.classList.remove('password-error');
    passwordFeedback.innerHTML = '';

    // Show modal
    passwordModal.classList.remove('hidden');

    // Focus input after animation
    setTimeout(() => {
        passwordInput.focus();
    }, 100);

    // Add event listeners
    setupPasswordModalEvents();
}

function setupPasswordModalEvents() {
    const passwordInput = document.getElementById('admin-password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordCancel = document.getElementById('password-cancel');
    const passwordFeedback = document.getElementById('password-feedback');

    // Submit button
    passwordSubmit.onclick = () => {
        const password = passwordInput.value;
        validateAdminPassword(password);
    };

    // Cancel button
    passwordCancel.onclick = () => {
        closePasswordModal();
    };

    // Enter key submission
    passwordInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const password = passwordInput.value;
            validateAdminPassword(password);
        } else if (e.key === 'Escape') {
            closePasswordModal();
        }
    };

    // Real-time feedback
    passwordInput.oninput = () => {
        // Clear error state when typing
        passwordInput.classList.remove('password-error');
        passwordFeedback.innerHTML = '';
    };
}

function validateAdminPassword(password) {
    const passwordInput = document.getElementById('admin-password-input');
    const passwordFeedback = document.getElementById('password-feedback');
    const correctPassword = '1812';

    if (password === correctPassword) {
        // Success
        passwordFeedback.innerHTML = '<span class="success-message">✓ Authentication Successful</span>';
        passwordInput.style.borderColor = '#00ff00';

        setTimeout(() => {
            closePasswordModal();
            showAdminPanel();
            logSecurityEvent('Admin authentication successful', 'admin');
        }, 1000);
    } else {
        // Error
        passwordFeedback.innerHTML = '<span class="error-message">✗ Access Denied - Invalid Credentials</span>';
        passwordInput.classList.add('password-error');
        logSecurityEvent('Failed admin authentication attempt', 'unknown');

        // Clear input after error
        setTimeout(() => {
            passwordInput.value = '';
        }, 1000);
    }
}

function closePasswordModal() {
    const passwordModal = document.getElementById('password-modal');
    passwordModal.classList.add('hidden');
}

// Admin panel functionality
function showAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');

    // Set admin state
    adminState.isLoggedIn = true;
    adminState.sessionStart = new Date();

    // Initialize admin panel
    initializeAdminPanel();

    // Show panel
    adminPanel.classList.remove('hidden');

    // Setup admin panel events
    setupAdminPanelEvents();

    // Start real-time updates
    startAdminUpdates();
}

function initializeAdminPanel() {
    // Update system stats
    updateSystemStats();

    // Populate command history
    updateCommandHistory();

    // Update session logs
    updateSessionLogs();

    // Update security logs
    updateSecurityLogs();

    // Initialize icon replacements
    setTimeout(() => {
        feather.replace();
    }, 100);
}

function setupAdminPanelEvents() {
    // Close button
    const adminClose = document.getElementById('admin-close');
    adminClose.onclick = () => {
        closeAdminPanel();
    };

    // Tab navigation
    const tabButtons = document.querySelectorAll('.admin-nav-btn');
    tabButtons.forEach(button => {
        button.onclick = () => {
            switchAdminTab(button.dataset.tab);

            // Update active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        };
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminState.isLoggedIn) {
            closeAdminPanel();
        }
    });
}

function switchAdminTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Refresh feather icons
    setTimeout(() => {
        feather.replace();
    }, 50);
}

function closeAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.classList.add('hidden');

    // Reset admin state
    adminState.isLoggedIn = false;
    adminState.sessionStart = null;

    // Stop updates
    stopAdminUpdates();

    logSecurityEvent('Admin session ended', 'admin');
}

// System monitoring functions
function updateSystemStats() {
    // Simulate dynamic system stats
    adminState.systemStats.cpuUsage = Math.floor(Math.random() * 30) + 60; // 60-90%
    adminState.systemStats.memoryUsage = Math.floor(Math.random() * 25) + 45; // 45-70%
    adminState.systemStats.storageUsage = Math.floor(Math.random() * 15) + 40; // 40-55%

    // Update UI
    const cpuElement = document.getElementById('cpu-usage');
    const memoryElement = document.getElementById('memory-usage');
    const storageElement = document.getElementById('storage-usage');
    const sessionsElement = document.getElementById('active-sessions');

    if (cpuElement) cpuElement.textContent = adminState.systemStats.cpuUsage + '%';
    if (memoryElement) memoryElement.textContent = adminState.systemStats.memoryUsage + '%';
    if (storageElement) storageElement.textContent = adminState.systemStats.storageUsage + '%';
    if (sessionsElement) sessionsElement.textContent = adminState.systemStats.activeSessions;

    // Update progress bars
    updateProgressBars();
}

function updateProgressBars() {
    const bars = [
        { element: '.admin-stat-card:nth-child(1) .stat-fill', value: adminState.systemStats.cpuUsage },
        { element: '.admin-stat-card:nth-child(2) .stat-fill', value: adminState.systemStats.memoryUsage },
        { element: '.admin-stat-card:nth-child(3) .stat-fill', value: adminState.systemStats.storageUsage }
    ];

    bars.forEach(bar => {
        const element = document.querySelector(bar.element);
        if (element) {
            element.style.width = bar.value + '%';
        }
    });
}

function updateCommandHistory() {
    const historyContainer = document.getElementById('admin-command-history');
    if (!historyContainer) return;

    // Get command history from global variable or create sample data
    const history = window._cmdHistory || [
        'help',
        'status',
        'scan',
        'ai',
        'cmd'
    ];

    historyContainer.innerHTML = '';

    // Show last 10 commands
    const recentHistory = history.slice(-10).reverse();

    recentHistory.forEach((command, index) => {
        const entry = document.createElement('div');
        entry.className = 'command-entry';

        const time = new Date(Date.now() - (index * 120000)).toLocaleTimeString();

        entry.innerHTML = `
            <span class="command-time">[${time}]</span>
            <span class="command-text">${command}</span>
        `;

        historyContainer.appendChild(entry);
    });
}

function updateSessionLogs() {
    const sessionLogs = document.getElementById('session-logs');
    if (!sessionLogs) return;

    const logs = [
        { time: '15:42:12', user: 'admin', action: 'Accessed admin panel' },
        { time: '15:40:33', user: 'admin', action: 'Command executed: "cmd"' },
        { time: '15:38:15', user: 'guest_user', action: 'Terminal command: "help"' },
        { time: '15:35:22', user: 'guest_user', action: 'AI query submitted' },
        { time: '15:32:08', user: 'guest_user', action: 'Calculator used' }
    ];

    sessionLogs.innerHTML = '';

    logs.forEach(log => {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="log-time">[${log.time}]</span>
            <span class="log-user">${log.user}</span>
            <span class="log-action">${log.action}</span>
        `;
        sessionLogs.appendChild(entry);
    });
}

function updateSecurityLogs() {
    // Security logs are updated via logSecurityEvent function
}

function logSecurityEvent(event, user) {
    const timestamp = new Date().toLocaleTimeString();
    const securityLogs = document.querySelector('.security-logs');

    if (securityLogs) {
        const entry = document.createElement('div');
        entry.className = 'security-log-entry';

        let icon = 'shield';
        let iconColor = 'text-green-400';

        if (event.includes('authentication')) {
            if (event.includes('Failed')) {
                icon = 'alert-triangle';
                iconColor = 'text-red-400';
            } else {
                icon = 'key';
                iconColor = 'text-blue-400';
            }
        }

        entry.innerHTML = `
            <i data-feather="${icon}" class="${iconColor} mr-2"></i>
            <span>${event}</span>
            <span class="log-time">${timestamp}</span>
        `;

        // Add to top of logs
        securityLogs.insertBefore(entry, securityLogs.firstChild);

        // Keep only last 10 entries
        while (securityLogs.children.length > 10) {
            securityLogs.removeChild(securityLogs.lastChild);
        }

        // Replace feather icons
        setTimeout(() => {
            feather.replace();
        }, 50);
    }
}

// Real-time updates
let adminUpdateInterval;

function startAdminUpdates() {
    adminUpdateInterval = setInterval(() => {
        if (adminState.isLoggedIn) {
            updateSystemStats();
            updateUptime();
        }
    }, 5000); // Update every 5 seconds
}

function stopAdminUpdates() {
    if (adminUpdateInterval) {
        clearInterval(adminUpdateInterval);
        adminUpdateInterval = null;
    }
}

function updateUptime() {
    if (adminState.sessionStart) {
        const now = new Date();
        const diff = now - adminState.sessionStart;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const uptimeElement = document.getElementById('system-uptime');
        if (uptimeElement) {
            uptimeElement.textContent = `${hours}h ${minutes}m ${seconds}s (session)`;
        }
    }
}

// ========================================
// DEVOPS FEATURES FUNCTIONALITY
// ========================================

// DevOps State Management
const devopsState = {
    pipelines: {
        frontend: {
            stage: 'building',
            progress: 75,
            startTime: new Date(Date.now() - 300000),
            status: 'building'
        },
        backend: {
            stage: 'testing',
            progress: 45,
            startTime: new Date(Date.now() - 180000),
            status: 'building'
        },
        database: {
            stage: 'pending',
            progress: 0,
            startTime: null,
            status: 'pending'
        }
    },
    infrastructure: {
        webServers: { active: 3, total: 5, cpu: 45, memory: 62, uptime: '99.9%' },
        databases: { active: 2, total: 2, cpu: 23, memory: 34, uptime: '100%' },
        loadBalancers: { active: 2, total: 2, cpu: 12, memory: 18, uptime: '99.8%' },
        microservices: { active: 12, total: 15, cpu: 67, memory: 71, uptime: '98.5%' }
    },
    environments: {
        production: { status: 'healthy', version: 'v2.1.4', lastDeploy: '2h ago', url: 'https://prod.hyp3rsp4c3.net' },
        staging: { status: 'healthy', version: 'v2.2.0-beta', lastDeploy: '30m ago', url: 'https://staging.hyp3rsp4c3.net' },
        development: { status: 'deploying', version: 'v2.2.1-dev', lastDeploy: 'now', url: 'https://dev.hyp3rsp4c3.net' }
    },
    metrics: {
        cpu: { value: 42, trend: 'up', history: [35, 38, 42, 45, 42] },
        memory: { value: 68, trend: 'down', history: [72, 70, 68, 65, 68] },
        requests: { value: 1247, trend: 'up', history: [1100, 1150, 1200, 1230, 1247] },
        errors: { value: 3, trend: 'neutral', history: [5, 4, 3, 3, 3] },
        latency: { value: 156, trend: 'down', history: [180, 170, 165, 160, 156] },
        throughput: { value: 847, trend: 'up', history: [800, 820, 835, 842, 847] }
    },
    builds: [
        { number: '#142', branch: 'main', commit: 'a7f3b2c', time: '2m ago', status: 'success', duration: '3m 42s' },
        { number: '#141', branch: 'feature/devops', commit: '9d4e1a8', time: '1h ago', status: 'success', duration: '4m 15s' },
        { number: '#140', branch: 'main', commit: 'c2b8f93', time: '3h ago', status: 'failed', duration: '2m 18s' },
        { number: '#139', branch: 'hotfix/security', commit: '5e7a9b1', time: '1d ago', status: 'success', duration: '3m 55s' }
    ],
    alerts: [
        { id: 1, type: 'warning', title: 'High Memory Usage', message: 'Web servers are using 85% memory', time: '5m ago', actions: ['Scale Up', 'Investigate'] },
        { id: 2, type: 'info', title: 'Deployment Complete', message: 'v2.2.0-beta deployed to staging successfully', time: '30m ago', actions: ['View', 'Promote'] },
        { id: 3, type: 'success', title: 'Security Scan Passed', message: 'No vulnerabilities found in latest scan', time: '2h ago', actions: ['View Report'] }
    ],
    healthChecks: [
        { service: 'API Gateway', status: 'healthy', responseTime: '12ms', uptime: '99.9%' },
        { service: 'User Service', status: 'healthy', responseTime: '8ms', uptime: '100%' },
        { service: 'Database', status: 'healthy', responseTime: '5ms', uptime: '99.8%' },
        { service: 'Cache Layer', status: 'healthy', responseTime: '2ms', uptime: '99.9%' },
        { service: 'File Storage', status: 'healthy', responseTime: '15ms', uptime: '98.5%' },
        { service: 'Message Queue', status: 'healthy', responseTime: '3ms', uptime: '99.7%' }
    ]
};

// DevOps Tab Functions
function showDevOpsTab() {
    updatePipelineStatus();
    updateInfrastructureStats();
}

function showCICDTab() {
    updateBuildHistory();
    updateEnvironmentStatus();
}

function showMonitorTab() {
    updateMetrics();
    updateAlerts();
    updateHealthChecks();
}

// Pipeline Management
function updatePipelineStatus() {
    Object.keys(devopsState.pipelines).forEach(pipelineName => {
        const pipeline = devopsState.pipelines[pipelineName];
        const stageElement = document.querySelector(`[data-pipeline="${pipelineName}"]`);

        if (stageElement) {
            const statusElement = stageElement.querySelector('.stage-status');
            const progressElement = stageElement.querySelector('.progress-fill');
            const progressText = stageElement.querySelector('.build-progress span');

            if (statusElement) {
                statusElement.textContent = pipeline.status;
                statusElement.className = `stage-status status-${pipeline.status}`;
            }

            if (progressElement) {
                progressElement.style.width = `${pipeline.progress}%`;
            }

            if (progressText) {
                progressText.textContent = `${pipeline.progress}%`;
            }
        }
    });
}

function triggerBuild(pipelineName) {
    if (devopsState.pipelines[pipelineName]) {
        devopsState.pipelines[pipelineName] = {
            stage: 'building',
            progress: 0,
            startTime: new Date(),
            status: 'building'
        };

        updatePipelineStatus();
        logSecurityEvent(`Build triggered for ${pipelineName}`, 'admin');

        // Simulate build progress
        simulateBuildProgress(pipelineName);
    }
}

function simulateBuildProgress(pipelineName) {
    const pipeline = devopsState.pipelines[pipelineName];
    const interval = setInterval(() => {
        if (pipeline.progress < 100) {
            pipeline.progress += Math.random() * 15;
            if (pipeline.progress > 100) pipeline.progress = 100;

            // Change stages
            if (pipeline.progress > 25 && pipeline.stage === 'building') {
                pipeline.stage = 'testing';
            }
            if (pipeline.progress > 75 && pipeline.stage === 'testing') {
                pipeline.stage = 'deploying';
            }
            if (pipeline.progress === 100) {
                pipeline.stage = 'completed';
                pipeline.status = Math.random() > 0.1 ? 'success' : 'failed';
                clearInterval(interval);
            }

            updatePipelineStatus();
        }
    }, 2000);
}

// Infrastructure Management
function updateInfrastructureStats() {
    Object.keys(devopsState.infrastructure).forEach(serviceType => {
        const service = devopsState.infrastructure[serviceType];
        const cardElement = document.querySelector(`[data-service="${serviceType}"]`);

        if (cardElement) {
            const stats = cardElement.querySelectorAll('.stat-item span:last-child');
            if (stats.length >= 4) {
                stats[0].textContent = `${service.active}/${service.total}`;
                stats[1].textContent = `${service.cpu}%`;
                stats[2].textContent = `${service.memory}%`;
                stats[3].textContent = service.uptime;
            }
        }
    });
}

// Build History Management
function updateBuildHistory() {
    const historyContainer = document.querySelector('.build-history');
    if (historyContainer) {
        historyContainer.innerHTML = '';

        devopsState.builds.forEach(build => {
            const buildElement = document.createElement('div');
            buildElement.className = 'build-item';

            let statusClass = 'status-success';
            let statusIcon = 'check-circle';
            if (build.status === 'failed') {
                statusClass = 'status-failed';
                statusIcon = 'x-circle';
            } else if (build.status === 'building') {
                statusClass = 'status-building';
                statusIcon = 'clock';
            }

            buildElement.innerHTML = `
                <div class="build-info">
                    <div class="build-number">${build.number}</div>
                    <div class="build-details">
                        <div class="build-branch">${build.branch}</div>
                        <div class="build-commit">${build.commit}</div>
                        <div class="build-time">${build.time} • ${build.duration}</div>
                    </div>
                </div>
                <div class="build-status ${statusClass}">
                    <i data-feather="${statusIcon}"></i>
                    ${build.status.toUpperCase()}
                </div>
            `;

            historyContainer.appendChild(buildElement);
        });

        feather.replace();
    }
}

// Environment Management
function updateEnvironmentStatus() {
    Object.keys(devopsState.environments).forEach(envName => {
        const env = devopsState.environments[envName];
        const envElement = document.querySelector(`[data-env="${envName}"]`);

        if (envElement) {
            const statusElement = envElement.querySelector('.env-status');
            const versionElement = envElement.querySelector('.env-info div:first-child');
            const deployElement = envElement.querySelector('.env-info div:nth-child(2)');
            const urlElement = envElement.querySelector('.env-info div:last-child');

            if (statusElement) {
                statusElement.textContent = env.status;
                statusElement.className = `env-status status-${env.status}`;
            }

            if (versionElement) versionElement.textContent = `Version: ${env.version}`;
            if (deployElement) deployElement.textContent = `Last Deploy: ${env.lastDeploy}`;
            if (urlElement) urlElement.textContent = `URL: ${env.url}`;
        }
    });
}

function deployToEnvironment(envName) {
    if (devopsState.environments[envName]) {
        devopsState.environments[envName].status = 'deploying';
        devopsState.environments[envName].lastDeploy = 'now';

        updateEnvironmentStatus();
        logSecurityEvent(`Deployment to ${envName} initiated`, 'admin');

        // Simulate deployment
        setTimeout(() => {
            devopsState.environments[envName].status = 'healthy';
            devopsState.environments[envName].lastDeploy = 'just now';
            updateEnvironmentStatus();
            logSecurityEvent(`Deployment to ${envName} completed`, 'admin');
        }, 5000);
    }
}

// Metrics Management
function updateMetrics() {
    Object.keys(devopsState.metrics).forEach(metricName => {
        const metric = devopsState.metrics[metricName];
        const metricElement = document.querySelector(`[data-metric="${metricName}"]`);

        if (metricElement) {
            const valueElement = metricElement.querySelector('.metric-value');
            const trendElement = metricElement.querySelector('.metric-trend');

            if (valueElement) {
                let suffix = '';
                if (metricName === 'cpu' || metricName === 'memory') suffix = '%';
                if (metricName === 'latency') suffix = 'ms';
                if (metricName === 'requests' || metricName === 'throughput') suffix = '/min';

                valueElement.textContent = `${metric.value}${suffix}`;
            }

            if (trendElement) {
                let trendIcon = '→';
                let trendClass = 'trend-neutral';

                if (metric.trend === 'up') {
                    trendIcon = '↗';
                    trendClass = metricName === 'errors' ? 'trend-down' : 'trend-up';
                } else if (metric.trend === 'down') {
                    trendIcon = '↙';
                    trendClass = metricName === 'errors' ? 'trend-up' : 'trend-down';
                }

                trendElement.innerHTML = `<span class="${trendClass}">${trendIcon} Trending ${metric.trend}</span>`;
            }
        }
    });

    // Simulate metric updates
    setTimeout(() => {
        Object.keys(devopsState.metrics).forEach(metricName => {
            const metric = devopsState.metrics[metricName];
            const change = (Math.random() - 0.5) * 10;
            metric.value = Math.max(0, Math.round(metric.value + change));

            // Update trend
            if (change > 2) metric.trend = 'up';
            else if (change < -2) metric.trend = 'down';
            else metric.trend = 'neutral';
        });
    }, 10000);
}

// Alerts Management
function updateAlerts() {
    const alertsContainer = document.querySelector('.alerts-container');
    if (alertsContainer) {
        alertsContainer.innerHTML = '';

        devopsState.alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert-item alert-${alert.type}`;

            const actionsHtml = alert.actions.map(action =>
                `<button class="alert-btn" onclick="handleAlertAction('${alert.id}', '${action}')">${action}</button>`
            ).join('');

            alertElement.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
                <div class="alert-actions">
                    ${actionsHtml}
                </div>
            `;

            alertsContainer.appendChild(alertElement);
        });
    }
}

function handleAlertAction(alertId, action) {
    logSecurityEvent(`Alert action: ${action} for alert ${alertId}`, 'admin');

    // Remove alert after action
    devopsState.alerts = devopsState.alerts.filter(alert => alert.id != alertId);
    updateAlerts();
}

// Health Checks
function updateHealthChecks() {
    const healthContainer = document.querySelector('.health-grid');
    if (healthContainer) {
        healthContainer.innerHTML = '';

        devopsState.healthChecks.forEach(check => {
            const healthElement = document.createElement('div');
            healthElement.className = 'health-item';

            healthElement.innerHTML = `
                <div class="health-indicator status-${check.status}"></div>
                <div class="health-info">
                    <h5>${check.service}</h5>
                    <span>${check.responseTime} • ${check.uptime} uptime</span>
                </div>
                <div class="health-status">${check.status}</div>
            `;

            healthContainer.appendChild(healthElement);
        });
    }
}

// DevOps Automation Functions
function restartService(serviceName) {
    logSecurityEvent(`Service restart initiated: ${serviceName}`, 'admin');

    // Simulate service restart
    const service = devopsState.healthChecks.find(s => s.service === serviceName);
    if (service) {
        service.status = 'restarting';
        updateHealthChecks();

        setTimeout(() => {
            service.status = 'healthy';
            service.responseTime = Math.floor(Math.random() * 20) + 'ms';
            updateHealthChecks();
            logSecurityEvent(`Service restart completed: ${serviceName}`, 'admin');
        }, 3000);
    }
}

function scaleService(serviceType, direction) {
    const service = devopsState.infrastructure[serviceType];
    if (service) {
        if (direction === 'up' && service.active < service.total) {
            service.active++;
        } else if (direction === 'down' && service.active > 1) {
            service.active--;
        }

        updateInfrastructureStats();
        logSecurityEvent(`Service scaling: ${serviceType} ${direction}`, 'admin');
    }
}

// DevOps Real-time Updates
function startDevOpsUpdates() {
    setInterval(() => {
        if (adminState.isLoggedIn && document.querySelector('#devops-tab').classList.contains('active')) {
            updateMetrics();
            updatePipelineStatus();
        }
    }, 15000);
}

// Initialize admin system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add admin functionality to existing initialization
    logSecurityEvent('System initialized', 'system');

    // Start DevOps updates
    startDevOpsUpdates();

    // Update help command to include admin command
    const helpCommand = document.querySelector('case[value="help"]');
    // This will be handled by the existing help system
});