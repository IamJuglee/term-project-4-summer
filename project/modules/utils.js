// 공수 입력 파싱: "1", "1.5", "0,75", "1h", " 2 h " 등 허용
export function parseHoursInput(val) {
    if (val == null) return NaN;
    let s = String(val).trim().toLowerCase();
    s = s.replace(/[^0-9.,+-]/g, ''); // h 등 단위 제거
    s = s.replace(',', '.');          // 쉼표를 소수점으로
    const num = parseFloat(s);
    return Number.isFinite(num) ? num : NaN;
}

const pad2 = n => String(n).padStart(2, '0');

export function formatDateTime(d) {
    const yyyy = d.getFullYear();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mi = pad2(d.getMinutes());
    const ss = pad2(d.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export function formatDateKey(iso) {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
}
