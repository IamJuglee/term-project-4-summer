export default class StorageService {
    constructor(storageKey = 'tasks') {
        this.storageKey = storageKey;
    }

    async loadTasks() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    saveTasks(tasks) {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }
}
