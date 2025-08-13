// tasksRepo.js
// 데이터 접근 계층 (Repository): 샘플 JSON ↔ localStorage 저장소
import { Storage } from './storage.js';
import { fetchJSON } from './api.js';

export class TasksRepo {
    constructor(storageKey, sampleUrl) {
        this.store = new Storage(storageKey); // localStorage 래퍼
        this.sampleUrl = sampleUrl; // 샘플 데이터 JSON 파일 경로
    }

    // 초기화: overwriteFromSample=true → 샘플로 덮어쓰기
    async init(opts = {}) {
        const { overwriteFromSample = false } = opts;
        if (overwriteFromSample) {
            // 항상 샘플로 덮어쓰기
            const sample = await fetchJSON(this.sampleUrl);
            const normalized = (sample || []).map(it => ({
                id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
                memo: String(it.memo ?? it.desc ?? ''), // memo 필드
                hours: Number(it.hours ?? 0), // hours 필드
                createdAt: it.createdAt ?? new Date().toISOString() // 생성일
            }));
            await this.store.set(normalized);
        } else {
            // 저장된 데이터 없을 때만 샘플 데이터 저장
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

    // 전체 데이터 로드
    async loadAll() {
        return await this.store.get();
    }

    // 전체 데이터 저장
    async saveAll(list) {
        await this.store.set(list);
    }
}
