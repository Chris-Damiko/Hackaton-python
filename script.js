document.addEventListener('DOMContentLoaded', () => {
    
    const problems = {
        1: { title: "Saludo Personalizado", difficulty: "facil", score: 50, statement: "Crea un programa que pida al usuario su nombre y luego lo salude con '¡Hola, [nombre]!'.", inputExample: "Ana", outputExample: "¡Hola, Ana!" },
        2: { title: "Tipos de Datos", difficulty: "facil", score: 60, statement: "Declara una variable con el valor 25. Imprime su edad y el tipo de dato en el formato 'Edad: [edad], Tipo: [tipo]'.", inputExample: "N/A", outputExample: "Edad: 25, Tipo: <class 'int'>" },
        3: { title: "Calculadora de Año", difficulty: "facil", score: 70, statement: "Pide al usuario su año de nacimiento y calcula el año siguiente. Imprime 'El próximo año sería: [año]'.", inputExample: "1990", outputExample: "El próximo año sería: 1991" },
        4: { title: "Repetir un Mensaje", difficulty: "facil", score: 80, statement: "Crea un programa que imprima 3 veces el mensaje 'Python es genial!' usando un bucle.", inputExample: "N/A", outputExample: "Python es genial!\nPython es genial!\nPython es genial!" },
        5: { title: "Operaciones con Listas", difficulty: "facil", score: 100, statement: "Dada la lista ['manzana', 'pera', 'naranja', 'uva'], imprime la primera, la última y luego reemplaza 'pera' por 'kiwi' e imprime la lista modificada.", inputExample: "N/A", outputExample: "Primera: manzana, Última: uva, Modificada: ['manzana', 'kiwi', 'naranja', 'uva']" },
        6: { title: "Añadir a la Lista de Compras", difficulty: "facil", score: 110, statement: "Añade 'pan' y 'leche' a la lista de compras ['manzanas', 'agua'] y luego imprímela ordenada alfabéticamente.", inputExample: "N/A", outputExample: "['agua', 'leche', 'manzanas', 'pan']" },
        7: { title: "Diccionario de Colores", difficulty: "medio", score: 120, statement: "Dado un diccionario de colores, imprime cuántos colores hay y cuál es el primer color.", inputExample: "{'primario': 'rojo', 'secundario': 'verde'}", outputExample: "Cantidad de colores: 2, Primer color: rojo" },
        8: { title: "Calcular Descuento", difficulty: "medio", score: 150, statement: "Calcula el precio final de un producto de 100€ con un 9.55% de descuento. Imprime 'Precio final: [precio]'.", inputExample: "N/A", outputExample: "Precio final: 90.45" },
        9: { title: "Encontrar un Elemento", difficulty: "medio", score: 160, statement: "Busca e imprime el elemento en el índice 2 de la tupla (2, 4, 6, 8).", inputExample: "N/A", outputExample: "6" },
        10: { title: "Filtrar una Lista", difficulty: "medio", score: 170, statement: "Dada la lista [10, 20, 30, 40, 50], crea e imprime una nueva lista solo con los números mayores a 25.", inputExample: "N/A", outputExample: "[30, 40, 50]" },
        11: { title: "Mayúsculas y Minúsculas", difficulty: "dificil", score: 180, statement: "Convierte la cadena 'programacion python' a 'Programacion Python' (capitalizando cada palabra) e imprímela.", inputExample: "N/A", outputExample: "Programacion Python" },
        12: { title: "Formateo de Cadenas", difficulty: "dificil", score: 200, statement: "Usando f-strings, imprime 'Nombre: Maria, Edad: 30 años, Altura: 1.75m' a partir de las variables correspondientes.", inputExample: "N/A", outputExample: "Nombre: Maria, Edad: 30 años, Altura: 1.75m" },
        13: { title: "Modificar Matriz", difficulty: "dificil", score: 220, statement: "En una matriz 3x3, reemplaza el elemento en la fila 0, columna 1 por 'X' y el de la fila 2, columna 0 por 'O'. Imprime la matriz final.", inputExample: "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]", outputExample: "[[1, 'X', 3], [4, 5, 6], ['O', 8, 9]]" }
    };
    const TIMER_INITIAL_SECONDS = 7200;

    

    const elements = {
        registrationModal: document.getElementById('registrationModal'),
        usernameInput: document.getElementById('userNameInput'), 
        registerBtn: document.getElementById('registerUserBtn'), 
        registrationError: document.getElementById('registrationError'),
        timer: document.getElementById('timer'),
        leaderboard: document.getElementById('leaderboard'),
        problemListView: document.getElementById('problem-list-view'),
        problemListContainer: document.getElementById('problem-list-container'),
        singleProblemView: document.getElementById('single-problem-view'),
        problemTitle: document.getElementById('problem-title'),
        problemStatement: document.getElementById('problem-statement'),
        problemInputExample: document.getElementById('problem-input-example'),
        problemOutputExample: document.getElementById('problem-output-example'),
        codeEditorArea: document.getElementById('code-editor-area'),
        resultsArea: document.getElementById('results-area'),
        submitCodeBtn: document.getElementById('submit-code-btn'),
        backToListBtn: document.getElementById('back-to-list-btn'),
        userInputArea: document.getElementById('user-input-area'),
        userInputField: document.getElementById('user-input-field'),
        submitInputBtn: document.getElementById('submit-input-btn'),
    };

    
    let state = {
        currentUser: null,
        currentProblemId: null,
        users: {},
        timeLeft: TIMER_INITIAL_SECONDS,
        timerInterval: null,
        inputPromiseResolver: null,
    };

    
    function showProblemListView() {
        elements.singleProblemView.style.display = 'none';
        elements.problemListView.style.display = 'block';
        state.currentProblemId = null;
        renderProblemList();
        updateLeaderboard();
    }

    function showSingleProblemView(problemId) {
        state.currentProblemId = problemId;
        const problem = problems[problemId];
        
        elements.problemTitle.textContent = `#${problemId}: ${problem.title}`;
        elements.problemStatement.textContent = problem.statement;
        elements.problemInputExample.textContent = problem.inputExample;
        elements.problemOutputExample.textContent = problem.outputExample;
        elements.resultsArea.style.display = 'none';
        
        const savedCode = state.users[state.currentUser]?.savedCode?.[problemId] || '';
        elements.codeEditorArea.value = savedCode;

        const isSolved = state.users[state.currentUser]?.solvedProblems.includes(problemId);
        elements.submitCodeBtn.disabled = isSolved;
        elements.submitCodeBtn.textContent = isSolved ? '✅ Resuelto' : 'Enviar Solución';
        elements.submitCodeBtn.style.cursor = isSolved ? 'not-allowed' : 'pointer';
        elements.codeEditorArea.readOnly = isSolved;

        elements.problemListView.style.display = 'none';
        elements.singleProblemView.style.display = 'block';
    }

    
    function renderProblemList() {
        elements.problemListContainer.innerHTML = '';
        const solvedProblems = state.users[state.currentUser]?.solvedProblems || [];

        Object.entries(problems).forEach(([id, problem]) => {
            const isSolved = solvedProblems.includes(parseInt(id));
            const item = document.createElement('div');
            item.className = `problem-list-item ${isSolved ? 'solved' : ''}`;
            item.dataset.problemId = id;
            item.innerHTML = `
                <span class="title">#${id} - ${problem.title}</span>
                <span class="difficulty ${problem.difficulty}">${problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}</span>
            `;
            item.addEventListener('click', () => showSingleProblemView(parseInt(id)));
            elements.problemListContainer.appendChild(item);
        });
    }

    function updateLeaderboard() {
        elements.leaderboard.innerHTML = '';
        const sortedUsers = Object.entries(state.users)
            .sort(([, a], [, b]) => b.score - a.score);

        sortedUsers.forEach(([username, data], index) => {
            const studentDiv = document.createElement('div');
            studentDiv.className = 'student';
            if (index === 0) studentDiv.classList.add('first');
            else if (index === 1) studentDiv.classList.add('second');
            else if (index === 2) studentDiv.classList.add('third');
            
            studentDiv.innerHTML = `
                <span class="name">${index + 1}. ${username}</span>
                <span class="score">${data.score} pts</span>
            `;
            elements.leaderboard.appendChild(studentDiv);
        });
    }
    
    
    function runCodeWithSkulpt(code) {
        return new Promise((resolve, reject) => {
            let output = '';
            elements.resultsArea.innerHTML = 'Ejecutando...';
            elements.resultsArea.className = 'results';
            elements.resultsArea.style.display = 'block';
            
            Sk.configure({
                output: (text) => { output += text; },
                inputfun: (prompt) => {
                    elements.userInputArea.style.display = 'block';
                    elements.userInputField.focus();
                    return new Promise((resume) => { state.inputPromiseResolver = resume; });
                },
                inputfunTakesPrompt: true,
                __future__: Sk.python3
            });
            
            const executionPromise = Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
            
            
            const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error("Tiempo de ejecución excedido (más de 5 segundos).")), 5000));
            
            Promise.race([executionPromise, timeoutPromise])
                .then(() => resolve(output.trim()))
                .catch((err) => reject(err))
                .finally(() => {
                    elements.userInputArea.style.display = 'none';
                    state.inputPromiseResolver = null;
                });
        });
    }








async function validateProblemSolution(problemId, code) {
    
    const validations = {
        1: () => { 
            if (!code.includes('input(') && !code.includes('input (')) {
                throw new Error("⚠️ Debes usar la función input() para solicitar el nombre del usuario.");
            }
            if (!code.toLowerCase().includes("hola")) {
                throw new Error("⚠️ El saludo debe contener la palabra 'Hola'.");
            }
            
            if (code.includes('"¡Hola, Ana!"') || code.includes("'¡Hola, Ana!'")) {
                throw new Error("⚠️ No puedes hardcodear la respuesta. Debes usar el nombre ingresado por el usuario.");
            }
        },
        
        2: () => { 
            if (!code.includes('type(') && !code.toLowerCase().includes('type ')) {
                throw new Error("⚠️ Debes usar la función type() para obtener el tipo de dato.");
            }
            if (code.includes('"Edad: 25, Tipo: <class \'int\'>"') || code.includes("'Edad: 25, Tipo: <class 'int'>'")) {
                throw new Error("⚠️ No puedes hardcodear la respuesta. Debes calcular el tipo dinámicamente.");
            }
        },
        
        3: () => { 
            const hasInput = code.includes('input(') || code.includes('input (');
            const hasConversion = /int\s*\(\s*input\s*\(/.test(code) || /float\s*\(\s*input\s*\(/.test(code);
            const hasSum = /\+\s*1/.test(code) || /1\s*\+/.test(code);
            
            if (!hasInput) {
                throw new Error("⚠️ Debes usar input() para solicitar el año de nacimiento.");
            }
            if (!hasConversion) {
                throw new Error("⚠️ Debes convertir el input a número usando int() o float().");
            }
            if (!hasSum) {
                throw new Error("⚠️ Debes sumar 1 al año ingresado.");
            }
            
            if (code.includes('1991') && !code.includes('1990')) {
                throw new Error("⚠️ No puedes hardcodear el resultado. Debes calcularlo a partir del input.");
            }
        },
        
        4: () => { 
            const hasLoop = /for\s+\w+\s+in\s+range\s*\(/.test(code) || /while\s+/.test(code) || /for\s+\w+\s+in\s+\[/.test(code);
            if (!hasLoop) {
                throw new Error("⚠️ Debes usar un bucle (for o while) para repetir el mensaje.");
            }
            if (code.includes('print("Python es genial!\\nPython es genial!\\nPython es genial!")')) {
                throw new Error("⚠️ No puedes hardcodear las 3 líneas. Debes usar un bucle.");
            }
        },
        
        5: () => { 
            if (!code.includes('[0]') && !code.includes('lista[0]')) {
                throw new Error("⚠️ Debes acceder al primer elemento usando índice [0].");
            }
            if (!code.includes('[-1]') && !code.includes('[3]')) {
                throw new Error("⚠️ Debes acceder al último elemento usando índice [-1] o [3].");
            }
            if (code.includes('"Primera: manzana, Última: uva"')) {
                throw new Error("⚠️ No puedes hardcodear la respuesta. Debes acceder a los elementos dinámicamente.");
            }
        },
        
        6: () => { 
            const hasAppend = code.includes('.append(') || code.includes('.extend(') || code.includes('+');
            const hasSort = code.includes('.sort()') || code.includes('sorted(');
            
            if (!hasAppend) {
                throw new Error("⚠️ Debes usar .append(), .extend() o + para añadir elementos a la lista.");
            }
            if (!hasSort) {
                throw new Error("⚠️ Debes usar .sort() o sorted() para ordenar la lista alfabéticamente.");
            }
        },
        
        7: () => { 
            if (!code.includes('len(') && !code.includes('len ')) {
                throw new Error("⚠️ Debes usar len() para contar los elementos del diccionario.");
            }
            if (code.includes('2') && code.includes('rojo') && !code.includes('len(')) {
                throw new Error("⚠️ No puedes hardcodear los valores. Debes calcularlos dinámicamente.");
            }
        },
        
        8: () => { 
            const hasCalculation = /100\s*\*\s*0\.9055/.test(code) || /100\s*\*\s*\(1\s*-\s*0\.0955\)/.test(code) || 
                                 /100\s*-\s*100\s*\*\s*0\.0955/.test(code) || /100\s*-\s*9\.55/.test(code);
            
            if (!hasCalculation) {
                throw new Error("⚠️ Debes calcular el descuento matemáticamente (100 * 0.9055 o 100 - 9.55).");
            }
            if (code.includes('90.45') && !code.includes('100')) {
                throw new Error("⚠️ No puedes hardcodear el resultado. Debes calcularlo.");
            }
        },
        
        9: () => { 
            if (!code.includes('[2]')) {
                throw new Error("⚠️ Debes acceder al elemento usando el índice [2].");
            }
            if (code.includes('6') && !code.includes('[2]')) {
                throw new Error("⚠️ No puedes hardcodear el resultado. Debes acceder al índice 2.");
            }
        },
        
        10: () => { 
            const hasFilter = code.includes('> 25') || code.includes('>25') || 
                             code.includes('filter(') || code.includes('comprehension');
            
            if (!hasFilter) {
                throw new Error("⚠️ Debes filtrar los números mayores a 25 usando una condición o filter().");
            }
        },
        
        11: () => { 
            if (!code.includes('.title()') && !code.includes('.capitalize()')) {
                throw new Error("⚠️ Debes usar .title() para capitalizar cada palabra.");
            }
            if (code.includes('"Programacion Python"') && !code.includes('.title()')) {
                throw new Error("⚠️ No puedes hardcodear el resultado. Debes usar métodos de string.");
            }
        },
        
        12: () => { 
            if (!code.includes('f"') && !code.includes("f'")) {
                throw new Error("⚠️ Debes usar f-strings (f\"...\") para el formateo.");
            }
            if (code.includes('"Nombre: Maria, Edad: 30 años, Altura: 1.75m"') && !code.includes('f"')) {
                throw new Error("⚠️ No puedes hardcodear el resultado. Debes usar f-strings con variables.");
            }
        },
        
        13: () => { 
            const hasIndexAccess = /\[\s*0\s*\]\s*\[\s*1\s*\]/.test(code) && /\[\s*2\s*\]\s*\[\s*0\s*\]/.test(code);
            
            if (!hasIndexAccess) {
                throw new Error("⚠️ Debes acceder a los elementos usando índices [0][1] y [2][0].");
            }
            if (code.includes("'X'") && code.includes("'O'") && !hasIndexAccess) {
                throw new Error("⚠️ No puedes hardcodear la matriz final. Debes modificar los elementos específicos.");
            }
        }
    };
    
    
    if (validations[problemId]) {
        validations[problemId]();
    }
}

async function runMultipleTestCases(problemId, code) {
    
    const testCases = {
        1: [
            { input: "Carlos", expected: "¡Hola, Carlos!" },
            { input: "Maria", expected: "¡Hola, Maria!" },
            { input: "José", expected: "¡Hola, José!" }
        ],
        3: [
            { input: "1985", expected: "El próximo año sería: 1986" },
            { input: "2000", expected: "El próximo año sería: 2001" },
            { input: "1990", expected: "El próximo año sería: 1991" }
        ]
    };
    
    if (!testCases[problemId]) return null;
    
    for (const testCase of testCases[problemId]) {
        
        const modifiedCode = code.replace(/input\([^)]*\)/g, `"${testCase.input}"`);
        
        try {
            const output = await runCodeWithSkulpt(modifiedCode);
            const normalize = (str) => str.replace(/"/g, "'").trim();
            
            if (normalize(output) !== normalize(testCase.expected)) {
                throw new Error(`Falló con input "${testCase.input}". Se esperaba: "${testCase.expected}", pero se obtuvo: "${output}"`);
            }
        } catch (error) {
            throw new Error(`Error en caso de prueba con input "${testCase.input}": ${error.message}`);
        }
    }
    
    return true;
}

async function handleSubmit() {
    if (!state.currentUser) return;
    
    const code = elements.codeEditorArea.value.trim();
    const problemId = state.currentProblemId;

    
    if (!code) {
        showResults('❌ Error', 'Debes escribir código antes de enviar la solución.', 'error');
        return;
    }

    
    const originalButtonText = elements.submitCodeBtn.textContent;
    elements.submitCodeBtn.disabled = true;
    elements.submitCodeBtn.textContent = '⏳ Procesando...';
    
    showResults('⏳ Procesando', 'Validando y ejecutando tu código...', 'processing');

    try {
        
        await validateProblemSolution(problemId, code);
        
        
        showResults('⏳ Ejecutando', 'Ejecutando tu código...', 'processing');
        const output = await runCodeWithSkulpt(code);
        const expected = problems[problemId].outputExample.replace(/\n/g, '\n');
        const normalize = (str) => str.replace(/"/g, "'").trim();

        
        if (normalize(output) !== normalize(expected)) {
            showResults('❌ Incorrecto', 
                `<strong>Tu salida:</strong> <pre>${output}</pre><br><strong>Salida esperada:</strong> <pre>${expected}</pre>`, 
                'error');
            return;
        }
        
        
        showResults('⏳ Validando', 'Ejecutando casos de prueba adicionales...', 'processing');
        try {
            await runMultipleTestCases(problemId, code);
        } catch (testError) {
            showResults('❌ Falló casos de prueba', 
                `Tu solución falló en casos de prueba adicionales:<br><pre>${testError.message}</pre>`, 
                'error');
            return;
        }
        
        
        showResults('✅ ¡Correcto!', 
            'Tu código pasó todas las validaciones y casos de prueba.', 
            'success');
        markProblemAsSolved(problemId);
        
    } catch (error) {
        console.error('Error en handleSubmit:', error);
        showResults('❌ Error en el código', 
            error.toString(), 
            'error');
    } finally {
        
        if (!state.users[state.currentUser]?.solvedProblems.includes(problemId)) {
            elements.submitCodeBtn.disabled = false;
            elements.submitCodeBtn.textContent = originalButtonText;
        }
    }
}

function showResults(title, message, type) {
    elements.resultsArea.innerHTML = `<strong>${title}</strong><br>${message}`;
    elements.resultsArea.className = `results ${type}`;
    elements.resultsArea.style.display = 'block';
    
    
    elements.resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}







    
    function saveStateToLocalStorage() {
        localStorage.setItem('pycontestUsers', JSON.stringify(state.users));
        if (state.currentUser) {
            localStorage.setItem('lastPycontestUser', state.currentUser);
        }
    }

    function loadStateFromLocalStorage() {
        state.users = JSON.parse(localStorage.getItem('pycontestUsers')) || {};
        const lastUser = localStorage.getItem('lastPycontestUser');
        if (lastUser && state.users[lastUser]) {
            state.currentUser = lastUser;
            state.timeLeft = state.users[lastUser].timeLeft;
        }
    }

    function registerUser() {
        const username = elements.usernameInput.value.trim();
        if (username.length < 3) {
            elements.registrationError.textContent = "El nombre debe tener al menos 3 caracteres.";
            return;
        }

        if (!state.users[username]) {
            state.users[username] = { score: 0, solvedProblems: [], timeLeft: TIMER_INITIAL_SECONDS, savedCode: {} };
        }

        state.currentUser = username;
        state.timeLeft = state.users[username].timeLeft;
        elements.registrationModal.style.display = 'none';
        
        showProblemListView();
        startTimer();
        saveStateToLocalStorage();
    }

    function markProblemAsSolved(problemId) {
        const user = state.users[state.currentUser];
        if (user && !user.solvedProblems.includes(problemId)) {
            user.solvedProblems.push(problemId);
            user.score += problems[problemId].score;
            
            saveStateToLocalStorage();
            updateLeaderboard();
            showCelebration();
            showSingleProblemView(problemId); 
        }
    }

    function startTimer() {
        if (state.timerInterval) clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            if (state.timeLeft > 0) {
                state.timeLeft--;
                const hours = Math.floor(state.timeLeft / 3600);
                const minutes = Math.floor((state.timeLeft % 3600) / 60);
                const seconds = state.timeLeft % 60;
                elements.timer.textContent = `⏰ Tiempo: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (state.currentUser) {
                    state.users[state.currentUser].timeLeft = state.timeLeft;
                    if(state.timeLeft % 10 === 0) saveStateToLocalStorage(); 
                }
            } else {
                clearInterval(state.timerInterval);
                alert("¡Tiempo agotado!");
            }
        }, 1000);
    }
    
    function showCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-popup';
        celebration.innerHTML = '🎉 ¡Correcto! 🎉';
        document.body.appendChild(celebration);
        setTimeout(() => { celebration.remove(); }, 2500);
    }

    
    elements.registerBtn.addEventListener('click', registerUser);
    elements.usernameInput.addEventListener('keypress', (e) => e.key === 'Enter' && registerUser());
    elements.backToListBtn.addEventListener('click', showProblemListView);
    elements.submitCodeBtn.addEventListener('click', handleSubmit);
    
    elements.submitInputBtn.addEventListener('click', () => {
        if (state.inputPromiseResolver) {
            state.inputPromiseResolver(elements.userInputField.value);
            state.inputPromiseResolver = null;
            elements.userInputField.value = '';
            elements.userInputArea.style.display = 'none';
        }
    });
    elements.userInputField.addEventListener('keypress', (e) => e.key === 'Enter' && elements.submitInputBtn.click());

    elements.codeEditorArea.addEventListener('input', () => {
        if (state.currentUser && state.currentProblemId) {
            if (!state.users[state.currentUser].savedCode) {
                state.users[state.currentUser].savedCode = {};
            }
            state.users[state.currentUser].savedCode[state.currentProblemId] = elements.codeEditorArea.value;
            
            if(state.timeLeft % 5 === 0) saveStateToLocalStorage();
        }
    });
    
    
    function init() {
        loadStateFromLocalStorage();
        if (state.currentUser) {
            elements.registrationModal.style.display = 'none';
            showProblemListView();
            startTimer();
        } else {
            elements.registrationModal.style.display = 'flex';
        }
    }

    init();
});