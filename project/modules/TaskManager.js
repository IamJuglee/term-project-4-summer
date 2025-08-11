export default class TaskManager {
    constructor(storageService, uiManager) {
        this.storageService = storageService;
        this.uiManager = uiManager;
        this.tasks = [];
    }

    async init() {
        this.tasks = await this.storageService.loadTasks();
        this.uiManager.renderTasks(this.tasks);
    }

    addTask(task) {
        this.tasks.push(task);
        this.storageService.saveTasks(this.tasks);
        this.uiManager.renderTasks(this.tasks);
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.storageService.saveTasks(this.tasks);
        this.uiManager.renderTasks(this.tasks);
    }
}
