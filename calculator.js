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

    // Science constants and formulas
    if (expr.includes('newton')) return 'Newton\'s Second Law: F = ma.';
    if (expr.includes('velocity')) return 'Velocity = distance / time.';
    if (expr.includes('gravity')) return 'Gravity on Earth ≈ 9.8 m/s².';
    if (expr.includes('ohm')) return 'Ohm\'s Law: V = IR.';
    if (expr.includes('circle')) return 'Area = πr², Circumference = 2πr.';

    // Math function hints
    if (expr.includes('sin') || expr.includes('cos') || expr.includes('tan')) {
        return 'Trigonometric functions work in radians. Try: sin(x), cos(x*pi), tan(x/2)';
    }
    if (expr.includes('log')) {
        return 'Logarithmic functions: log(x) is natural log, log10(x) is base-10 log';
    }
    if (expr.includes('sqrt')) {
        return 'Square root function: sqrt(x). For graphing try: sqrt(x), sqrt(4-x^2)';
    }
    if (expr.includes('abs')) {
        return 'Absolute value function: abs(x). Creates V-shaped graphs.';
    }
    if (expr.includes('exp')) {
        return 'Exponential function: exp(x) is e^x. Very fast growing function.';
    }
    if (expr.includes('x^') || expr.includes('x**')) {
        return 'Polynomial functions: x^2 (parabola), x^3 (cubic), x^4 (quartic)';
    }

    return '';
}

// Function to validate if expression is suitable for graphing
function isGraphableExpression(expr) {
    if (!expr || typeof expr !== 'string') return false;

    // Must contain 'x' variable
    if (!expr.toLowerCase().includes('x')) return false;

    // Check for common mathematical functions
    const mathFunctions = ['sin', 'cos', 'tan', 'log', 'sqrt', 'abs', 'exp', 'floor', 'ceil', 'round'];
    const hasFunction = mathFunctions.some(func => expr.toLowerCase().includes(func));
    const hasPolynomial = /x[\^*]/.test(expr.toLowerCase()) || /\d*x/.test(expr);

    return hasFunction || hasPolynomial || expr.includes('+') || expr.includes('-') || expr.includes('*') || expr.includes('/');
}

// Graphing logic
function plotGraph(expr, containerId) {
    try {
        // Parse function, e.g., 'sin(x)'
        const xValues = [];
        const yValues = [];

        // Generate points for the graph
        for (let x = -10; x <= 10; x += 0.1) {
            xValues.push(x);
            try {
                let scope = { x: x };
                let y = math.evaluate(expr, scope);
                // Handle complex numbers and invalid results
                if (typeof y === 'object' && y.im !== undefined) {
                    y = y.re; // Use real part of complex number
                }
                if (isFinite(y)) {
                    yValues.push(y);
                } else {
                    yValues.push(null); // Handle undefined/infinite values
                }
            } catch (evalError) {
                yValues.push(null); // Handle evaluation errors for individual points
            }
        }

        const trace = {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            line: {
                color: '#00ff00',
                width: 2
            },
            name: expr
        };

        const layout = {
            margin: { t: 30, r: 20, b: 30, l: 40 },
            paper_bgcolor: '#000000',
            plot_bgcolor: '#000000',
            font: { color: '#00ff00' },
            xaxis: {
                gridcolor: '#003300',
                zerolinecolor: '#00ff00',
                color: '#00ff00',
                title: 'x'
            },
            yaxis: {
                gridcolor: '#003300',
                zerolinecolor: '#00ff00',
                color: '#00ff00',
                title: 'f(x)'
            },
            title: {
                text: `Graph: ${expr}`,
                font: { color: '#00ff00', size: 14 }
            }
        };

        const config = {
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
            displaylogo: false
        };

        Plotly.newPlot(containerId, [trace], layout, config);
    } catch (e) {
        const errorDiv = document.getElementById(containerId);
        if (errorDiv) {
            errorDiv.innerHTML = `<div class="text-red-400 p-4 text-center">Graph Error: ${e.message}<br><small>Try expressions like: sin(x), x^2, log(x), etc.</small></div>`;
        }
    }
}