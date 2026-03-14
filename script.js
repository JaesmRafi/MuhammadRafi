// --- DOM Elements ---
const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const nameInput = document.getElementById('user-name');
const timerDisplay = document.getElementById('timer-display');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const themeBtn = document.getElementById('theme-toggle');

// --- 1. Clock & Greeting ---
function updateClock() {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
    
    const hours = now.getHours();
    let greet = "Selamat Malam";
    if (hours < 12) greet = "Selamat Pagi";
    else if (hours < 18) greet = "Selamat Siang";
    
    const savedName = localStorage.getItem('kiro-name') || "";
    greetingEl.innerText = `${greet}${savedName ? ', ' + savedName : ''}!`;
}
setInterval(updateClock, 1000);

nameInput.addEventListener('change', (e) => {
    localStorage.setItem('kiro-name', e.target.value);
    updateClock();
});

// --- 2. Focus Timer (25 Min) ---
let timer;
let timeLeft = 25 * 60;

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

document.getElementById('start-btn').onclick = () => {
    if (!timer) timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) clearInterval(timer);
    }, 1000);
};

document.getElementById('stop-btn').onclick = () => {
    clearInterval(timer);
    timer = null;
};

document.getElementById('reset-btn').onclick = () => {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
};

// --- 3. To-Do List (with Duplicate Check) ---
let todos = JSON.parse(localStorage.getItem('kiro-todos')) || [];

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${todo.done ? 'done' : ''}" onclick="toggleTodo(${index})">${todo.text}</span>
            <button onclick="deleteTodo(${index})">Delete</button>
        `;
        todoList.appendChild(li);
    });
    localStorage.setItem('kiro-todos', JSON.stringify(todos));
}

todoForm.onsubmit = (e) => {
    e.preventDefault();
    const text = document.getElementById('todo-input').value.trim();
    
    // Optional Challenge: Prevent Duplicates
    if (todos.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        alert("Tugas sudah ada!");
        return;
    }

    todos.push({ text, done: false });
    document.getElementById('todo-input').value = '';
    renderTodos();
};

window.toggleTodo = (index) => {
    todos[index].done = !todos[index].done;
    renderTodos();
};

window.deleteTodo = (index) => {
    todos.splice(index, 1);
    renderTodos();
};

// --- 4. Dark Mode ---
themeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('kiro-theme', isDark ? 'dark' : 'light');
};

// Init
if (localStorage.getItem('kiro-theme') === 'dark') document.body.classList.add('dark-mode');
nameInput.value = localStorage.getItem('kiro-name') || "";
updateClock();
renderTodos();
