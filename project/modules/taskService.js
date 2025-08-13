// taskService.js
// 업무 일정(Task) 비즈니스 로직 관리
// 정렬, 추가, 삭제, 상태 관리 등 수행
import { parseHoursInput } from './utils.js';

export class TaskService {
    constructor(repo) {
        this.repo = repo; // 데이터 저장소(Repository) 인스턴스
        this.state = {
            items: [], // 현재 작업 목록
            sortKey: localStorage.getItem('sortKey') || 'date', // 정렬 기준
            sortDir: localStorage.getItem('sortDir') || 'desc', // 정렬 방향
        };
    }

    // 초기 데이터 로드 (샘플 데이터 덮어쓰기 여부 옵션)
    async init({ overwriteFromSample = true } = {}) {
        await this.repo.init({ overwriteFromSample });
        this.state.items = await this.repo.loadAll();
    }

    // 현재 상태 반환
    getState() {
        return { ...this.state };
    }

    // 정렬 기준/방향 설정
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

    // 정렬된 목록 반환
    getSorted() {
        const { items, sortKey, sortDir } = this.state;
        const list = [...items]; // 복사본 사용
        list.sort((a, b) => {
            switch (sortKey) {
                case 'memo': // 메모 기준 정렬
                    const A = (a.memo || '').toLowerCase();
                    const B = (b.memo || '').toLowerCase();
                    return sortDir === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
                case 'hours': // 공수 기준 정렬
                    const numA = Number(a.hours || 0);
                    const numB = Number(b.hours || 0);
                    return sortDir === 'asc' ? numA - numB : numB - numA;
                case 'date': // 날짜 기준 정렬
                default:
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return sortDir === 'asc' ? dateA - dateB : dateB - dateA;
            }
        });
        return list;
    }

    // 신규 작업 추가
    async add({ memo, hours }) {
        const h = parseHoursInput(hours); // 공수 입력 파싱
        if (!memo?.trim() || !Number.isFinite(h) || h < 0) {
            throw new Error('Invalid input'); // 유효성 검사 실패
        }
        const now = new Date();
        const item = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now(), // 고유 ID
            memo: memo.trim(),
            hours: h,
            createdAt: now.toISOString(), // ISO 날짜 문자열
        };
        this.state.items.push(item); // 상태에 추가
        await this.repo.saveAll(this.state.items); // 저장
        return item;
    }

    // 작업 삭제
    async delete(id) {
        this.state.items = this.state.items.filter(t => t.id !== id);
        await this.repo.saveAll(this.state.items);
    }
}
