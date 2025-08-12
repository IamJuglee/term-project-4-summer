import { Storage } from './storage.js';
import { fetchJSON } from './api.js';

// 데이터 접근 레이어: sample-data.json ←→ localStorage
export class TasksRepo {
    constructor(storageKey, sampleUrl) {
        this.store = new Storage(storageKey);
        this.sampleUrl = sampleUrl;
    }

    // 옵션: { overwriteFromSample: true } → 항상 샘플로 덮어쓰기
    async init(opts = {}) {
        const { overwriteFromSample = false } = opts;
        if (overwriteFromSample) {
            const sample = await fetchJSON(this.sampleUrl);
            const normalized = (sample || []).map(it => ({
                id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
                memo: String(it.memo ?? it.desc ?? ''),
                hours: Number(it.hours ?? 0),
                createdAt: it.createdAt ?? new Date().toISOString()
            }));
            await this.store.set(normalized);
        } else {
            // 저장된 게 없을 때만 시드
            const cur = await this.store.get();
            if (!cur.length) {
                const sample = await fetchJSON(this.sampleUrl);
                const normalized = (sample || []).map(it => ({
                    id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
                    memo: String(it.memo ?? it.desc ?? ''),
                    hours: Number(it.hours ?? 0),
                    createdAt: it.createdAt ?? new Date().toISOString()
                }));
                await this.store.set(normalized);
            }
        }
    }

    async loadAll() {
        return await this.store.get();
    }

    async saveAll(list) {
        await this.store.set(list);
    }
}
