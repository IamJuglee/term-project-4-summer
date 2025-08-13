// 유틸(공수 파싱, 날짜 포맷), 저장소/서비스 모듈 가져오기
import { parseHoursInput, formatDateTime } from './modules/utils.js';
import { TasksRepo } from './modules/tasksRepo.js';
import { TaskService } from './modules/taskService.js';

// 브라우저 localStorage에 저장할 키
const STORAGE_KEY = 'tasks_v2';

// DOM 요소 캐싱
const taskDescInput = document.getElementById('task-desc');
const taskHoursInput = document.getElementById('task-hours');
const btnAdd        = document.getElementById('btn-add');
const taskList      = document.getElementById('task-list');
const sortKeySel    = document.getElementById('sort-key');
const sortDirSel    = document.getElementById('sort-dir');

// 데이터 접근 레이어(Repo)와 비즈니스 로직(Service) 인스턴스 생성
// Repo: localStorage와 sample-data.json 간의 I/O 담당
// Service: 상태(items, sortKey/Dir) + 추가/삭제/정렬 로직 담당
const repo = new TasksRepo(STORAGE_KEY, './data/sample-data.json');
const service = new TaskService(repo);

/**
 * 화면 렌더링 함수
 * - 현재 서비스 상태에서 정렬된 리스트를 받아서 DOM을 그린다.
 * - highlightId가 있으면 방금 추가된 줄을 스크롤/하이라이트
 */
function render(highlightId = null) {
    const { items } = service.getState();
    taskList.innerHTML = '';

    // 데이터 없을 때 플레이스홀더 출력
    if (!items.length) {
        taskList.innerHTML = `<div class="row" style="justify-content:center;color:var(--muted);">등록된 메모가 없습니다.</div>`;
        return;
    }

    // 정렬 옵션에 따라 정렬된 결과 가져오기
    const data = service.getSorted();

    // 각 아이템을 한 줄(row) 형태로 렌더
    for (const t of data) {
        const row = document.createElement('div');
        row.className = 'row';
        row.id = `row-${t.id}`;

        // 생성 시각 배지 (YYYY-MM-DD HH:mm:ss)
        const timeBadge = document.createElement('span');
        timeBadge.className = 'badge-time';
        timeBadge.textContent = formatDateTime(new Date(t.createdAt));

        // 메모 본문 (한 줄 말줄임)
        const memo = document.createElement('div');
        memo.className = 'memo';
        memo.title = t.memo;         // 툴팁으로 전체 내용 표시
        memo.textContent = t.memo;

        // 우측 메타 정보(공수)
        const meta = document.createElement('div');
        meta.className = 'meta';
        const hBadge = document.createElement('span');
        hBadge.className = 'badge-hours';
        hBadge.textContent = `${Number(t.hours).toFixed(2)}h`;
        meta.appendChild(hBadge);

        // 삭제 버튼(아이콘). 클릭 시 비동기 삭제 → 렌더
        const del = document.createElement('button');
        del.className = 'btn-icon';
        del.setAttribute('aria-label', '삭제');
        del.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        del.addEventListener('click', async () => {
            await service.delete(t.id);
            render();
        });

        // 조립
        row.appendChild(timeBadge);
        row.appendChild(memo);
        row.appendChild(meta);
        row.appendChild(del);
        taskList.appendChild(row);
    }

    // 방금 추가된 항목 강조
    if (highlightId) {
        const el = document.getElementById(`row-${highlightId}`);
        if (el) {
            el.classList.add('row--new');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => el.classList.remove('row--new'), 1200);
        }
    }
}

/**
 * 초기 진입점
 * - 로컬스토리지 우선: 비어있을 때만 sample-data.json으로 시드
 * - 정렬 UI 초기값을 서비스 상태와 동기화
 * - 첫 렌더 호출
 */
async function init() {
    await service.init({ overwriteFromSample: false });

    const { sortKey, sortDir } = service.getState();
    sortKeySel.value = sortKey;
    sortDirSel.value = sortDir;

    render();
}

document.addEventListener('DOMContentLoaded', init);

// 등록 버튼 핸들러
// - 입력값 검증 → 서비스에 추가 요청 → 입력 초기화 → 렌더
btnAdd.addEventListener('click', async () => {
    const memo  = (taskDescInput.value || '').trim();
    const hours = parseHoursInput(taskHoursInput.value);

    if (!memo) {
        alert('메모 내용을 입력해주세요.');
        taskDescInput.focus();
        return;
    }
    if (!Number.isFinite(hours) || hours < 0) {
        alert('공수를 올바르게 입력해주세요. (예: 1, 1.5, 0.75, 1h, 0,75)');
        taskHoursInput.focus();
        return;
    }

    const item = await service.add({ memo, hours });
    taskDescInput.value = '';
    taskHoursInput.value = '';
    taskDescInput.focus();

    render(item.id);
});

// 정렬 기준/방향 변경 시 상태 갱신 후 재렌더
sortKeySel.addEventListener('change', () => {
    service.setSort({ key: sortKeySel.value });
    render();
});
sortDirSel.addEventListener('change', () => {
    service.setSort({ dir: sortDirSel.value });
    render();
});
