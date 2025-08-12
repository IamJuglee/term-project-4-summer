// localStorage 래퍼 (Promise 인터페이스)
export class Storage {
    constructor(key) {
        this.key = key;
    }
    async get() {
        try {
            const raw = localStorage.getItem(this.key);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('[Storage.get] parse error', e);
            return [];
        }
    }
    async set(value) {
        try {
            localStorage.setItem(this.key, JSON.stringify(value));
        } catch (e) {
            console.error('[Storage.set] save error', e);
        }
    }
    async clear() {
        localStorage.removeItem(this.key);
    }
}
