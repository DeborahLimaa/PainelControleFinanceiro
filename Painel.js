document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const transactionsTable = document.getElementById('transactionsBody');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpenses = document.getElementById('totalExpenses');
    const balance = document.getElementById('balance');
    const filterDate = document.getElementById('filterDate');
    const filterCategory = document.getElementById('filterCategory');
    
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Criando o gráfico de pizza de receitas e despesas
    const ctx = document.getElementById('incomeExpensesChart').getContext('2d');
    const incomeExpensesChart = new Chart(ctx, {
        type: 'pie',  // Alterando para tipo 'pie' (pizza)
        data: {
            labels: ['Renda', 'Despesa'],  // Labels para as categorias
            datasets: [{
                data: [0, 0],  // Inicializando com zero, será atualizado dinamicamente
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',  // Cor para Renda
                    'rgba(255, 99, 132, 0.2)'   // Cor para Despesa
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',    // Cor para a borda da Renda
                    'rgba(255, 99, 132, 1)'     // Cor para a borda da Despesa
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Função para atualizar o gráfico de pizza
    function updateChart() {
        const income = transactions.filter(t => t.category === 'renda').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.category === 'despesa').reduce((acc, t) => acc + t.amount, 0);

        // Atualizando os dados do gráfico com a soma das rendas e despesas
        incomeExpensesChart.data.datasets[0].data = [income, expenses];
        incomeExpensesChart.update();  // Atualiza o gráfico
    }

    // Função para atualizar a tabela
    function updateTable() {
        transactionsTable.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>${transaction.description}</td>
            `;
            transactionsTable.appendChild(row);
        });
    }

    // Função para atualizar o resumo financeiro
    function updateSummary() {
        const income = transactions.filter(t => t.category === 'renda').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.category === 'despesa').reduce((acc, t) => acc + t.amount, 0);
        totalIncome.textContent = income.toFixed(2);
        totalExpenses.textContent = expenses.toFixed(2);
        balance.textContent = (income - expenses).toFixed(2);
    }

    // Função para salvar as transações no localStorage
    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Função para aplicar os filtros
    document.getElementById('applyFilters').addEventListener('click', () => {
        const filteredTransactions = transactions.filter(t => {
            return (!filterDate.value || t.date === filterDate.value) &&
                   (filterCategory.value === 'all' || t.category === filterCategory.value);
        });
        transactionsTable.innerHTML = '';
        filteredTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>${transaction.description}</td>
            `;
            transactionsTable.appendChild(row);
        });
        updateChart();  // Atualiza o gráfico com os dados filtrados
    });

    // Evento para adicionar transações
    transactionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const date = document.getElementById('transactionDate').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const category = document.getElementById('transactionCategory').value;
        const description = document.getElementById('transactionDescription').value;

        const transaction = { date, amount, category, description };
        transactions.push(transaction);
        saveTransactions();
        updateTable();
        updateSummary();
        updateChart();  // Atualiza o gráfico com a nova transação
        transactionForm.reset();
    });

    // Inicialização do painel
    updateTable();
    updateSummary();
    updateChart();
});
