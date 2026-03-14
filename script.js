const clockEl = document.getElementById('clock');
const greetingEl = document.getElementById('greeting');
const nameInput = document.getElementById('user-name');
const timerDisplay = document.getElementById('timer-display');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const themeBtn = document.getElementById('theme-toggle');


function updateClock() {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();


    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);
    document.getElementById('calendar').innerText = dateString;
    
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


let todos = JSON.parse(localStorage.getItem('kiro-todos')) || [];

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
    <div class="todo-left">
        <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="toggleTodo(${index})">
        <span class="${todo.done ? 'done' : ''}">${todo.text}</span>
    </div>
    <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
`;
        todoList.appendChild(li);
    });
    localStorage.setItem('kiro-todos', JSON.stringify(todos));
}

todoForm.onsubmit = (e) => {
    e.preventDefault();
    const text = document.getElementById('todo-input').value.trim();
    

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


themeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('kiro-theme', isDark ? 'dark' : 'light');
};

let quickLinks = JSON.parse(localStorage.getItem('kiro-links')) || [
    { name: 'Google', url: 'https://google.com' }
];

const linksContainer = document.getElementById('links-container');
const linkUrlInput = document.getElementById('link-url');
const addLinkBtn = document.getElementById('add-link-btn');

function renderLinks() {
    linksContainer.innerHTML = '';
    quickLinks.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'quick-link-item';
        div.innerHTML = `
            <a href="${link.url}" target="_blank">${link.name}</a>
            <button class="del-link" onclick="deleteLink(${index})">×</button>
        `;
        linksContainer.appendChild(div);
    });
    localStorage.setItem('kiro-links', JSON.stringify(quickLinks));
}

addLinkBtn.onclick = () => {
    let url = linkUrlInput.value.trim();

    if (url) {
        if (!url.startsWith('http')) url = 'https://' + url;

        try {
            const domain = new URL(url).hostname.replace('www.', '');
            // Hapus .toUpperCase() dan ambil nama domain aslinya saja
            const name = domain.split('.')[0]; 

            quickLinks.push({ name, url });
            linkUrlInput.value = '';
            renderLinks();
        } catch (e) {
            alert("URL tidak valid!");
        }
    }
};

window.deleteLink = (index) => {
    quickLinks.splice(index, 1);
    renderLinks();
};

renderLinks();

if (localStorage.getItem('kiro-theme') === 'dark') document.body.classList.add('dark-mode');
nameInput.value = localStorage.getItem('kiro-name') || "";
updateClock();
renderTodos();