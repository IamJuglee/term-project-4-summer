// 로컬스토리지 키
const STORAGE_KEY = "tasks";

// DOM 요소
const searchInput = document.getElementById("search");
const addTaskBtn = document.getElementById("add-task");
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDateInput = document.getElementById("task-date");
const taskDescInput = document.getElementById("task-desc");
const taskList = document.getElementById("task-list");

// 상태
let tasks = [];

// 초기화
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    renderTasks();
});

// 할 일 추가 폼 토글
addTaskBtn.addEventListener("click", () => {
    taskForm.style.display = taskForm.style.display === "flex" ? "none" : "flex";
});

// 할 일 추가
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    const date = taskDateInput.value;
    const desc = taskDescInput.value.trim();

    if (!title || !date || !desc) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title,
        date,
        desc
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // 폼 초기화
    taskForm.reset();
    taskForm.style.display = "none";
});

// 할 일 삭제
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// 검색 기능
searchInput.addEventListener("input", () => {
    renderTasks(searchInput.value.trim().toLowerCase());
});

// 로컬스토리지 저장
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// 로컬스토리지 불러오기
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        tasks = JSON.parse(stored);
    }
}

// 할 일 목록 렌더링
function renderTasks(searchTerm = "") {
    taskList.innerHTML = "";

    const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.desc.toLowerCase().includes(searchTerm) ||
        task.date.includes(searchTerm)
    );

    if (filtered.length === 0) {
        taskList.innerHTML = `<p style="color: var(--muted); text-align: center;">등록된 업무가 없습니다.</p>`;
        return;
    }

    filtered.forEach(task => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <span class="card-badge">${task.date}</span>
            <div class="card-title">${task.title}</div>
            <div class="card-desc">${task.desc}</div>
            <button class="btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
        `;

        taskList.appendChild(card);
    });
}
