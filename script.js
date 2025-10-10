// Initialize Vanta.js background
VANTA.NET({
    el: "#vanta-bg",
    color: 0x00ff00,
    backgroundColor: 0x000000,
    points: 10.00,
    maxDistance: 20.00,
    spacing: 15.00
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
setInterval(updateDateTime, 1000);
updateDateTime();

// Feather icons
feather.replace();
// Add event listener for NETWORK button in Quick Access
document.addEventListener('DOMContentLoaded', () => {
    // CMD button password and admin panel
    const cmdBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('CMD'));
    if (cmdBtn) {
        cmdBtn.addEventListener('click', () => {
            const pwd = prompt('Enter admin password:');
            if (pwd === '1812') {
                showAdminPanel();
            } else {
                alert('Incorrect password. Access denied.');
            }
        });
    }

    // Admin panel function
    function showAdminPanel() {
        // Create admin panel overlay
        let adminDiv = document.getElementById('admin-panel');
        if (!adminDiv) {
            adminDiv = document.createElement('div');
            adminDiv.id = 'admin-panel';
            adminDiv.style.position = 'fixed';
            adminDiv.style.top = '0';
            adminDiv.style.left = '0';
            adminDiv.style.width = '100vw';
            adminDiv.style.height = '100vh';
            adminDiv.style.background = 'rgba(10,26,47,0.98)';
            adminDiv.style.zIndex = '9999';
            adminDiv.style.color = '#00eaff';
            adminDiv.style.padding = '40px';
            adminDiv.style.overflowY = 'auto';
            adminDiv.innerHTML = `
                <h2 style="font-size:2rem;" class="jarvis-header mb-4">Admin Panel</h2>
                <p>Welcome, Admin! Here are your monitoring tools:</p>
                <ul style="margin:1rem 0 2rem 0;">
                    <li>- <b>Site Activity Log</b> (simulated)</li>
                    <li>- <b>User List</b> (simulated)</li>
                    <li>- <b>Security Controls</b> (simulated)</li>
                    <li>- <b>Site Stats</b></li>
                    <li>- <b>User Actions</b></li>
                    <li>- <b>Broadcast Message</b></li>
                </ul>
                <div style="margin-bottom:2rem;">
                    <h3 style="font-size:1.2rem;">Site Activity Log</h3>
                    <div id="admin-activity" style="background:#09111a;padding:1rem;border-radius:8px;">No suspicious activity detected.</div>
                </div>
                <div style="margin-bottom:2rem;">
                    <h3 style="font-size:1.2rem;">User List</h3>
                    <div id="admin-users" style="background:#09111a;padding:1rem;border-radius:8px;">Current users: [Simulated: 1 - You]</div>
                </div>
                <div style="margin-bottom:2rem;">
                    <h3 style="font-size:1.2rem;">Site Stats</h3>
                    <div id="admin-stats" style="background:#09111a;padding:1rem;border-radius:8px;">
                        <b>Uptime:</b> <span id="admin-uptime">Calculating...</span><br>
                        <b>Commands Executed:</b> <span id="admin-cmds">0</span><br>
                        <b>Calculator Uses:</b> <span id="admin-calc">0</span>
                    </div>
                </div>
                <div style="margin-bottom:2rem;">
                    <h3 style="font-size:1.2rem;">User Actions</h3>
                    <div id="admin-actions" style="background:#09111a;padding:1rem;border-radius:8px;">
                        <button id="admin-log-action" class="jarvis-btn px-3 py-1 rounded">Log User Action</button>
                        <div id="admin-action-log" style="margin-top:1rem;"></div>
                    </div>
                </div>
                <div style="margin-bottom:2rem;">
                    <h3 style="font-size:1.2rem;">Broadcast Message</h3>
                    <input id="admin-broadcast-input" type="text" class="bg-gray-900 text-cyan-300 px-3 py-2 rounded w-full" placeholder="Enter message to broadcast">
                    <button id="admin-broadcast-btn" class="jarvis-btn px-3 py-1 rounded mt-2">Send Broadcast</button>
                    <div id="admin-broadcast-log" style="margin-top:1rem;"></div>
                </div>
                <div style="margin-bottom:2rem;">
                    <h3 style="font-size:1.2rem;">Security Controls</h3>
                    <button id="admin-close" class="jarvis-btn px-3 py-1 rounded">Close Admin Panel</button>
                </div>
            `;
            document.body.appendChild(adminDiv);
            document.getElementById('admin-close').onclick = () => {
                adminDiv.remove();
            };
            // Uptime
            const startTime = window._adminStartTime || (window._adminStartTime = Date.now());

            function updateUptime() {
                const now = Date.now();
                const diff = Math.floor((now - startTime) / 1000);
                const mins = Math.floor(diff / 60);
                const secs = diff % 60;
                document.getElementById('admin-uptime').textContent = `${mins}m ${secs}s`;
            }
            updateUptime();
            setInterval(updateUptime, 1000);
            // Command and calculator counters
            document.getElementById('admin-cmds').textContent = window._adminCmds || '0';
            document.getElementById('admin-calc').textContent = window._adminCalc || '0';
            // User Actions
            const actionLog = document.getElementById('admin-action-log');
            document.getElementById('admin-log-action').onclick = () => {
                const entry = `User performed an action at ${new Date().toLocaleTimeString()}`;
                actionLog.innerHTML += `<div>${entry}</div>`;
            };
            // Broadcast Message
            document.getElementById('admin-broadcast-btn').onclick = () => {
                const msg = document.getElementById('admin-broadcast-input').value;
                if (msg) {
                    document.getElementById('admin-broadcast-log').innerHTML += `<div><b>Broadcast:</b> ${msg}</div>`;
                    document.getElementById('admin-broadcast-input').value = '';
                }
            };
        }
    }
    // Embedded browser panel logic
    const browserUrl = document.getElementById('browser-url');
    const browserGo = document.getElementById('browser-go');
    const browserFrame = document.getElementById('browser-frame');
    if (browserGo && browserUrl && browserFrame) {
        browserGo.addEventListener('click', () => {
            let url = browserUrl.value.trim();
            if (url && !/^https?:\/\//.test(url)) {
                url = 'https://' + url;
            }
            browserFrame.src = url || 'about:blank';
        });
    }
    // Calculator event handling
    const calcInput = document.getElementById('calc-input');
    const calcEvalBtn = document.getElementById('calc-eval');
    const calcGraphBtn = document.getElementById('calc-graph');
    const calcResult = document.getElementById('calc-result');
    const calcGraphArea = document.getElementById('calc-graph-area');
    if (calcEvalBtn && calcInput && calcResult) {
        calcEvalBtn.addEventListener('click', () => {
            const expr = calcInput.value;
            if (expr) {
                const result = calculateExpression(expr);
                let assistant = assistantHelp(expr);
                calcResult.innerHTML = result + (assistant ? `<br><b>Assistant:</b> ${assistant}` : '');
                calcGraphArea.innerHTML = '';
            }
        });
    }
    if (calcGraphBtn && calcInput && calcGraphArea) {
        calcGraphBtn.addEventListener('click', () => {
            const expr = calcInput.value;
            if (expr) {
                plotGraph(expr, 'calc-graph-area');
                calcResult.innerHTML = '';
            }
        });
    }
    const networkBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('NETWORK'));
    if (networkBtn) {
        networkBtn.addEventListener('click', async() => {
            let output = '<span class="text-green-400">NETWORK INFORMATION:</span><br>';
            // Get public IP address
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipRes.json();
                output += `IP Address: <span class="text-green-300">${ipData.ip}</span><br>`;
            } catch {
                output += 'IP Address: <span class="text-red-400">Unavailable</span><br>';
            }
            // Connection type (limited in browser)
            if (navigator.connection) {
                output += `Connection Type: <span class="text-green-300">${navigator.connection.effectiveType}</span><br>`;
                output += `Downlink: <span class="text-green-300">${navigator.connection.downlink} Mbps</span><br>`;
            } else {
                output += 'Connection Type: <span class="text-red-400">Unavailable</span><br>';
            }
            // WiFi SSID is not accessible from browser JS for privacy reasons
            output += 'WiFi SSID: <span class="text-yellow-400">Not accessible in browser</span><br>';
            // Display in terminal output
            const responseElement = document.createElement('p');
            responseElement.className = 'text-green-300';
            responseElement.innerHTML = output;
            terminalOutput.appendChild(responseElement);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        });
    }

    // Add event listener for SECURITY button in Quick Access
    const securityBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('SECURITY'));
    if (securityBtn) {
        securityBtn.addEventListener('click', () => {
            let output = '<span class="text-green-400">SECURITY & ANONYMITY INFORMATION:</span><br>';
            output += 'Site uses HTTPS for secure communication.<br>';
            output += 'Your IP address is not stored by this site.<br>';
            output += 'No personal data is collected.<br>';
            output += 'Browser privacy features (Incognito/Private mode) are supported.<br>';
            output += 'For maximum anonymity, use a VPN or Tor browser.<br>';
            output += 'Cookies and trackers are not used.<br>';
            output += 'Always verify site authenticity before entering sensitive information.<br>';
            // Display in terminal output
            const responseElement = document.createElement('p');
            responseElement.className = 'text-green-300';
            responseElement.innerHTML = output;
            terminalOutput.appendChild(responseElement);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        });
    }
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
        // Process command
        let response = '';
        const commandParts = command.toLowerCase().split(' ');
        const mainCommand = commandParts[0];
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
        } else if (mainCommand === 'search') {
            window.location.href = 'HYP3RSP4C3-BROWSER/browser.html';
            response = `Redirecting to HYP3RSP4C3 Browser...`;
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
                    - SEARCH: Open the HYP3RSP4C3 Browser in a new tab`;
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
                        diag += 'Checking HTML structure... <span class="text-cyan-400">OK</span><br>';
                        diag += 'Checking CSS file... <span class="text-cyan-400">OK</span><br>';
                        diag += 'Checking JavaScript file... <span class="text-cyan-400">OK</span><br>';
                        diag += 'Checking external resources... <span class="text-cyan-400">OK</span><br>';
                        diag += 'Checking terminal responsiveness... <span class="text-cyan-400">OK</span><br>';
                        diag += 'Checking security features... <span class="text-cyan-400">OK</span><br>';
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
                case 'whoami':
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