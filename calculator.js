// Advanced Calculator using math.js and plotly.js
// Make sure to include math.js and plotly.js in your HTML


// Personal Assistant Calculator logic
function calculateExpression(expr) {
    // Recognize some science formulas and give hints
    const hints = [];
    let result = '';
    try {
        // Physics: E=mc^2
        if (/^e\s*=\s*m\s*\*\s*c\s*\^\s*2$/i.test(expr.replace(/\s+/g, ''))) {
            hints.push('This is Einstein\'s mass-energy equivalence formula. E = mc².');
        }
        // Chemistry: PV=nRT
        if (/^pv\s*=\s*n\s*R\s*T$/i.test(expr.replace(/\s+/g, ''))) {
            hints.push('This is the Ideal Gas Law: PV = nRT.');
        }
        // Math: Quadratic formula
        if (/x\s*=\s*-b\s*\+\s*sqrt\(b\^2-4ac\)\/(2a)/i.test(expr.replace(/\s+/g, ''))) {
            hints.push('This is the quadratic formula for solving ax²+bx+c=0.');
        }
        result = math.evaluate(expr);
    } catch (e) {
        result = 'Error: ' + e.message;
    }
    let response = `<b>Result:</b> ${result}`;
    if (hints.length > 0) {
        response += '<br><b>Assistant:</b> ' + hints.join(' ');
    }
    return response;
}

// Assistant for science and math
function assistantHelp(expr) {
    if (!expr) return '';
    expr = expr.toLowerCase();
    if (expr.includes('newton')) return 'Newton\'s Second Law: F = ma.';
    if (expr.includes('velocity')) return 'Velocity = distance / time.';
    if (expr.includes('gravity')) return 'Gravity on Earth ≈ 9.8 m/s².';
    if (expr.includes('ohm')) return 'Ohm\'s Law: V = IR.';
    if (expr.includes('circle')) return 'Area = πr², Circumference = 2πr.';
    return '';
}

// Graphing logic
function plotGraph(expr, containerId) {
    try {
        // Parse function, e.g., 'sin(x)'
        const xValues = [];
        const yValues = [];
        for (let x = -10; x <= 10; x += 0.1) {
            xValues.push(x);
            let scope = { x };
            let y = math.evaluate(expr, scope);
            yValues.push(y);
        }
        const trace = {
            x: xValues,
            y: yValues,
            type: 'scatter',
            line: { color: '#00eaff' }
        };
        Plotly.newPlot(containerId, [trace], { margin: { t: 20 } });
    } catch (e) {
        document.getElementById(containerId).innerHTML = 'Error: ' + e.message;
    }
}