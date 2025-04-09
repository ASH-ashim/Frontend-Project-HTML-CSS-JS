document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const transactionForm = document.getElementById('transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const transactionList = document.querySelector('.transaction-list');
    const balanceAmount = document.querySelector('.balance-amount');
    const incomeAmount = document.querySelector('.income .amount');
    const expenseAmount = document.querySelector('.expense .amount');
    
    // Initialize transactions from localStorage or empty array
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Initialize the app
    init();
    
    // Form submission
    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = document.querySelector('input[name="type"]:checked').value;
        
        if (description === '') {
            showAlert('Please enter a description', 'error');
            return;
        }
        
        if (isNaN(amount) || amount === 0) {
            showAlert('Please enter a valid amount', 'error');
            return;
        }
        
        // Create transaction object
        const transaction = {
            id: generateID(),
            description,
            amount: type === 'income' ? Math.abs(amount) : -Math.abs(amount),
            type
        };
        
        // Add transaction to array
        transactions.push(transaction);
        
        // Update UI
        addTransactionToDOM(transaction);
        updateValues();
        updateLocalStorage();
        
        // Reset form
        transactionForm.reset();
        descriptionInput.focus();
        
        showAlert('Transaction added successfully', 'success');
    });
    
    // Initialize the app
    function init() {
        transactionList.innerHTML = '';
        
        if (transactions.length === 0) {
            transactionList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exchange-alt"></i>
                    <p>No transactions yet</p>
                </div>
            `;
        } else {
            transactions.forEach(transaction => addTransactionToDOM(transaction));
        }
        
        updateValues();
    }
    
    // Add transaction to DOM
    function addTransactionToDOM(transaction) {
        // Remove empty state if it exists
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Determine sign based on transaction type
        const sign = transaction.type === 'income' ? '+' : '-';
        const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
        
        // Create transaction element
        const transactionElement = document.createElement('div');
        transactionElement.classList.add('transaction', transaction.type);
        transactionElement.dataset.id = transaction.id;
        
        transactionElement.innerHTML = `
            <div class="description">${transaction.description}</div>
            <div class="amount ${amountClass}">${sign}$${Math.abs(transaction.amount).toFixed(2)}</div>
            <button class="delete-btn" onclick="removeTransaction('${transaction.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        transactionList.appendChild(transactionElement);
    }
    
    // Update balance, income and expense
    function updateValues() {
        const amounts = transactions.map(transaction => transaction.amount);
        
        const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => acc + item, 0)
            .toFixed(2);
        const expense = amounts
            .filter(item => item < 0)
            .reduce((acc, item) => acc + item, 0)
            .toFixed(2);
        
        balanceAmount.textContent = `$${total}`;
        incomeAmount.textContent = `+$${income}`;
        expenseAmount.textContent = `-$${Math.abs(expense)}`;
    }
    
    // Remove transaction by ID
    function removeTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        init();
        showAlert('Transaction removed', 'success');
    }
    
    // Update local storage
    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    
    // Generate random ID
    function generateID() {
        return Math.floor(Math.random() * 1000000000);
    }
    
    // Show alert message
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `alert ${type}`;
        alertElement.textContent = message;
        
        // Add alert to the DOM
        document.body.insertBefore(alertElement, document.querySelector('.container'));
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 3000);
    }
});

// Global function to remove transaction (needed for inline onclick)
function removeTransaction(id) {
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
    document.querySelector(`.transaction[data-id="${id}"]`).remove();
    
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    document.dispatchEvent(event);
}

// Add alert styles to the DOM
const style = document.createElement('style');
style.textContent = `
    .alert {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .alert.success {
        background-color: #4BB543;
    }
    
    .alert.error {
        background-color: #FF3333;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);