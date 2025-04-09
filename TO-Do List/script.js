document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskOrder = 0;

    function loadTasks() {
        taskList.innerHTML = '';
        taskOrder = 0;
        
        tasks.forEach((task, index) => {
            addTaskToDOM(task.text, task.completed, index);
            taskOrder++;
        });
        
        updateStats();
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            animateShake(taskInput);
            return;
        }

        const newTask = {
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      
        animateAddButton();
        setTimeout(() => {
            addTaskToDOM(taskText, false, tasks.length - 1);
            taskInput.value = '';
            updateStats();
        }, 300);
    }

    function addTaskToDOM(text, completed, index) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.style.setProperty('--order', taskOrder);
        li.style.animationDelay = `${taskOrder * 0.1}s`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => toggleTask(index));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = text;
        if (completed) span.classList.add('completed');

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg> Delete';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        
        setTimeout(() => {
            li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        const taskElement = document.querySelectorAll('.task-item')[index];
        const textElement = taskElement.querySelector('.task-text');
        
        if (tasks[index].completed) {
            textElement.classList.add('completed');
            animateCheck(taskElement.querySelector('.task-checkbox'));
        } else {
            textElement.classList.remove('completed');
        }
        
        updateStats();
    }

    function deleteTask(index) {
        const taskElement = document.querySelectorAll('.task-item')[index];
        animateRemove(taskElement);
        
        setTimeout(() => {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }, 300);
    }

    function updateStats() {
        totalTasksSpan.textContent = `Total: ${tasks.length}`;
        const completedCount = tasks.filter(task => task.completed).length;
        completedTasksSpan.textContent = `Completed: ${completedCount}`;
      
        animateStats();
    }

    function animateShake(element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    function animateAddButton() {
        addBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addBtn.style.transform = '';
        }, 300);
    }

    function animateCheck(checkbox) {
        checkbox.style.transform = 'scale(1.3)';
        setTimeout(() => {
            checkbox.style.transform = 'scale(1)';
        }, 300);
    }

    function animateRemove(element) {
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';
        element.style.transition = 'all 0.3s ease';
    }

    function animateStats() {
        totalTasksSpan.style.transform = 'scale(1.1)';
        completedTasksSpan.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalTasksSpan.style.transform = '';
            completedTasksSpan.style.transform = '';
        }, 300);
    }

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    loadTasks();
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});