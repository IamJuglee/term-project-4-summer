export default class UIManager {
    constructor(taskListElement, onDelete) {
        this.taskListElement = taskListElement;
        this.onDelete = onDelete;
    }

    renderTasks(tasks) {
        this.taskListElement.innerHTML = '';
        tasks.forEach((task, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
        <span class="card-badge">${task.date}</span>
        <div class="card-title">${task.title}</div>
        <div class="card-desc">${task.desc}</div>
        <button data-index="${index}" class="btn">삭제</button>
      `;
            this.taskListElement.appendChild(card);
        });

        // 삭제 버튼 이벤트
        this.taskListElement.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                this.onDelete(index);
            });
        });
    }
}
