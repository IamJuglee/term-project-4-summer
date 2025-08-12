// JSON/텍스트 fetch 유틸 (async/await)
export async function fetchJSON(url, init) {
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(`[fetchJSON] ${res.status} ${res.statusText} (${url})`);
    return await res.json();
}
