// Datos de inicio de sesión (puedes cambiar estos para un sistema más avanzado)
const correctUsername = 'usuario';
const correctPassword = 'contraseña';

// Mostrar el formulario de inicio de sesión y ocultar la aplicación
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validar usuario y contraseña
    if (username === correctUsername && password === correctPassword) {
        // Si el inicio de sesión es correcto, mostrar la aplicación
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
    } else {
        // Si los datos son incorrectos, mostrar un mensaje de error
        document.getElementById('errorMessage').textContent = 'Usuario o contraseña incorrectos.';
    }
});

// Funciones de la aplicación (igual que antes)

let transactions = [];

function addTransaction() {
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (!date || !description || isNaN(amount)) {
        alert("Por favor, llena todos los campos correctamente.");
        return;
    }

    const newTransaction = { date, description, amount, category };
    transactions.push(newTransaction);
    updateUI();

    document.getElementById('date').value = '';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = 'income';
}

function updateUI() {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        totalBalance += transaction.amount;
        if (transaction.amount > 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });

    document.getElementById('totalBalance').textContent = totalBalance.toFixed(2);
    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);

    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.classList.add('transaction');
        li.classList.add(transaction.category === 'income' ? 'income' : 'expense');
        li.innerHTML = `
            <span>${transaction.date} - ${transaction.description} - $${Math.abs(transaction.amount).toFixed(2)} (${transaction.category})</span>
            <button onclick="deleteTransaction(${index})">Eliminar</button>
        `;
        transactionList.appendChild(li);
    });
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}
