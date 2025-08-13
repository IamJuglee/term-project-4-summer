// api.js
// JSON 데이터를 비동기(fetch)로 가져오는 유틸 함수 모듈
// fetch() 결과가 정상(res.ok)인지 확인하고, JSON 파싱하여 반환
export async function fetchJSON(url, init) {
    const res = await fetch(url, init); // URL에 HTTP 요청 전송
    if (!res.ok) throw new Error(`[fetchJSON] ${res.status} ${res.statusText} (${url})`); // 실패 시 에러 발생
    return await res.json(); // JSON 파싱 후 반환
}
