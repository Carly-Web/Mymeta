// ------------------ LOGIN ------------------ //
const correctUsername = 'usuario';
const correctPassword = 'contraseña';

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === correctUsername && password === correctPassword) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
  } else {
    document.getElementById('errorMessage').textContent = 'Usuario o contraseña incorrectos.';
  }
});

// ------------------ NAVEGACIÓN ------------------ //
function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
}

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => {
    sec.classList.remove('active');
    sec.classList.add('hidden');
  });
  const activeSection = document.getElementById(sectionId);
  activeSection.classList.remove('hidden');
  activeSection.classList.add('active');
}

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => {
    sec.classList.remove('active');
    sec.classList.add('hidden');
  });
  const activeSection = document.getElementById(sectionId);
  activeSection.classList.remove('hidden');
  activeSection.classList.add('active');
  
  // Cierra el menú hamburguesa al seleccionar una opción
  const menu = document.getElementById('menu');
  menu.classList.remove('active');
}

//----------------- CAMBIO DE SECCIONES ------------------ //
//function showSection(sectionId) {
  //const sections = document.querySelectorAll('.section');
  //sections.forEach(sec => {
    //sec.classList.remove('active');
  //  //sec.classList.add('hidden');
  //});
  ////const activeSection = document.getElementById(sectionId);
  //activeSection.classList.remove('hidden');
  //activeSection.classList.add('active');
//}//

// ------------------ GESTIÓN DE TRANSACCIONES ------------------ //
// Se guardarán todas las transacciones (ingresos, gastos y ahorros)
let transactions = [];

// Actualiza la interfaz
function updateUI() {
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalSavings = 0;
  
  transactions.forEach(tx => {
    if (tx.category === 'income') {
      totalIncome += tx.amount;
    } else if (tx.category === 'expense') {
      totalExpenses += tx.amount;
    } else if (tx.category === 'savings') {
      totalSavings += tx.amount;
    }
  });
  
  // Suponemos que el balance disponible es ingresos - gastos - ahorros
  const totalBalance = totalIncome - totalExpenses - totalSavings;
  
  document.getElementById('totalBalance').textContent = totalBalance.toFixed(2);
  document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
  document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
  document.getElementById('totalSavings').textContent = totalSavings.toFixed(2);
  
  updateTransactionList('ingresos', transactions.filter(tx => tx.category === 'income'));
  updateTransactionList('gastos', transactions.filter(tx => tx.category === 'expense'));
  updateTransactionList('ahorros', transactions.filter(tx => tx.category === 'savings'));
  
  updateChart(totalIncome, totalExpenses, totalSavings);
}

// Actualiza la lista para cada tipo de transacción
function updateTransactionList(section, list) {
  const container = document.getElementById(`${section}-lista`);
  container.innerHTML = '';
  list.forEach((tx, index) => {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.innerHTML = `
      <span>${tx.date} - ${tx.description} - $${Math.abs(tx.amount).toFixed(2)}</span>
      <button onclick="deleteTransaction('${section}', ${index})">Eliminar</button>
    `;
    container.appendChild(item);
  });
}

// Agrega una nueva transacción
function addTransaction(category, date, description, amount) {
  const tx = { category, date, description, amount };
  transactions.push(tx);
  updateUI();
}

// Se elimina una transacción
function deleteTransaction(section, indexInSection) {
  const filtered = transactions.filter(tx =>
    tx.category === (section === 'ingresos' ? 'income' : section === 'gastos' ? 'expense' : 'savings')
  );
  const txToDelete = filtered[indexInSection];
  const globalIndex = transactions.findIndex(tx => tx === txToDelete);
  if (globalIndex > -1) {
    transactions.splice(globalIndex, 1);
    updateUI();
  }
}

// ------------------ EVENTOS DE LOS FORMULARIOS ------------------ //
// Ingresos
document.getElementById('incomeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const date = document.getElementById('incomeDate').value;
  const description = document.getElementById('incomeDescription').value;
  const amount = parseFloat(document.getElementById('incomeAmount').value);
  
  if (!date || !description || isNaN(amount)) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }
  addTransaction('income', date, description, Math.abs(amount));
  e.target.reset();
});

// Gastos
document.getElementById('expenseForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const date = document.getElementById('expenseDate').value;
  const description = document.getElementById('expenseDescription').value;
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  
  if (!date || !description || isNaN(amount)) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }
  addTransaction('expense', date, description, Math.abs(amount));
  e.target.reset();
});

// Ahorros
document.getElementById('savingsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const date = document.getElementById('savingsDate').value;
  const description = document.getElementById('savingsDescription').value;
  const amount = parseFloat(document.getElementById('savingsAmount').value);
  
  if (!date || !description || isNaN(amount)) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }
  addTransaction('savings', date, description, Math.abs(amount));
  e.target.reset();
});

// ------------------ GRÁFICO CON CHART.JS ------------------ //
let balanceChart;
function updateChart(income, expenses, savings) {
  const ctx = document.getElementById('balanceChart').getContext('2d');
  const data = {
    labels: ['Ingresos', 'Gastos', 'Ahorros'],
    datasets: [{
      data: [income, expenses, savings],
      backgroundColor: ['#28a745', '#dc3545', '#ffc107']
    }]
  };

  if (balanceChart) {
    balanceChart.data = data;
    balanceChart.update();
  } else {
    balanceChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

// ------------------ SIMULACIÓN DE PRÉSTAMOS ------------------ //
document.getElementById('calcularPrestamoButton').addEventListener('click', function() {
  const monto = parseFloat(document.getElementById('sim_monto').value);
  const interes = parseFloat(document.getElementById('sim_interes').value);
  const meses = parseFloat(document.getElementById('sim_meses').value);
  const resultadoEl = document.getElementById('resultadoSimulacion');

  if (isNaN(monto) || isNaN(interes) || isNaN(meses) || meses === 0) {
    resultadoEl.textContent = "Por favor ingresa valores válidos en todos los campos.";
    return;
  }
  const tasa = (interes / 100) / 12;
  const cuota = (monto * tasa) / (1 - Math.pow(1 + tasa, -meses));
  resultadoEl.textContent = `La cuota mensual es $${cuota.toFixed(2)}`;
});

// ------------------ AJUSTES ------------------ //
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function cambiarIdioma() {
  const idioma = document.getElementById('idioma').value;
  console.log("Idioma seleccionado: ", idioma);
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function(event) {
  const menu = document.getElementById('menu');
  const hamburger = document.querySelector('.hamburger');
  
  if (!menu.contains(event.target) && event.target !== hamburger) {
    menu.classList.remove('active');
  }
});