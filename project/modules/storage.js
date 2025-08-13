// storage.js
// localStorage에 데이터 저장/조회/삭제하는 래퍼 클래스 (Promise 형태 반환)
// 데이터는 JSON 문자열로 저장됨
export class Storage {
    constructor(key) {
        this.key = key; // localStorage에 사용할 key 이름
    }
    async get() {
        try {
            const raw = localStorage.getItem(this.key); // 저장된 문자열 가져오기
            return raw ? JSON.parse(raw) : []; // JSON 파싱 후 반환 (없으면 빈 배열)
        } catch (e) {
            console.error('[Storage.get] parse error', e);
            return [];
        }
    }
    async set(value) {
        try {
            localStorage.setItem(this.key, JSON.stringify(value)); // 객체 → JSON 문자열 변환 후 저장
        } catch (e) {
            console.error('[Storage.set] save error', e);
        }
    }
    async clear() {
        localStorage.removeItem(this.key); // 해당 key 데이터 삭제
    }
}
