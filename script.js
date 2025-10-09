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
                    - SHADOW: Access quantum physics portal`;
                    break;
                case 'status':
                    response = `SYSTEM STATUS:<br>
                    - CPU: 75% LOAD<br>
                    - RAM: 60% USED<br>
                    - STORAGE: 45% FULL<br>
                    - NETWORK: SECURE`;
                    break;
                case 'scan':
                    response = `INITIATING SECURITY SCAN...<br>
                    SCANNING PORTS...<br>
                    CHECKING VULNERABILITIES...<br>
                    SCAN COMPLETE: NO THREATS DETECTED`;
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
                    WARNING: ALL REQUESTS NOW ROUTED THROUGH TOR NETWORK`;
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
                    fetch('https://api.quotable.io/random?tags=technology')
                        .then(response => response.json())
                        .then(data => {
                            const responseElement = document.createElement('p');
                            responseElement.className = 'text-green-300';
                            responseElement.innerHTML = `QUOTE: "${data.content}"<br>- ${data.author}`;
                            terminalOutput.appendChild(responseElement);
                            terminalOutput.scrollTop = terminalOutput.scrollHeight;
                        });
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
                    WARNING: TRAFFIC IS NOW VISIBLE TO NETWORK MONITORS`;
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