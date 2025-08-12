import { parseHoursInput } from './utils.js';

// 비즈니스 로직(상태, 추가/삭제, 정렬)
export class TaskService {
    constructor(repo) {
        this.repo = repo;
        this.state = {
            items: [],
            sortKey: localStorage.getItem('sortKey') || 'date',
            sortDir: localStorage.getItem('sortDir') || 'desc',
        };
    }

    async init({ overwriteFromSample = true } = {}) {
        await this.repo.init({ overwriteFromSample });
        this.state.items = await this.repo.loadAll();
    }

    getState() {
        return { ...this.state };
    }

    setSort({ key, dir } = {}) {
        if (key) {
            this.state.sortKey = key;
            localStorage.setItem('sortKey', key);
        }
        if (dir) {
            this.state.sortDir = dir;
            localStorage.setItem('sortDir', dir);
        }
    }

    getSorted() {
        const { items, sortKey, sortDir } = this.state;
        const list = [...items];
        list.sort((a, b) => {
            switch (sortKey) {
                case 'memo': {
                    const A = (a.memo || '').toLowerCase();
                    const B = (b.memo || '').toLowerCase();
                    return sortDir === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
                }
                case 'hours': {
                    const A = Number(a.hours || 0);
                    const B = Number(b.hours || 0);
                    return sortDir === 'asc' ? A - B : B - A;
                }
                case 'date':
                default: {
                    const A = new Date(a.createdAt).getTime();
                    const B = new Date(b.createdAt).getTime();
                    return sortDir === 'asc' ? A - B : B - A;
                }
            }
        });
        return list;
    }

    async add({ memo, hours }) {
        const h = parseHoursInput(hours);
        if (!memo?.trim() || !Number.isFinite(h) || h < 0) {
            throw new Error('Invalid input');
        }
        const now = new Date();
        const item = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
            memo: memo.trim(),
            hours: h,
            createdAt: now.toISOString(),
        };
        this.state.items.push(item);
        await this.repo.saveAll(this.state.items);
        return item;
    }

    async delete(id) {
        this.state.items = this.state.items.filter(t => t.id !== id);
        await this.repo.saveAll(this.state.items);
    }
}
