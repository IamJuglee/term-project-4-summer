import { parseHoursInput, formatDateTime } from './modules/utils.js';
import { TasksRepo } from './modules/tasksRepo.js';
import { TaskService } from './modules/taskService.js';

const STORAGE_KEY = 'tasks_v2';

// DOM
const taskDescInput = document.getElementById('task-desc');
const taskHoursInput = document.getElementById('task-hours');
const btnAdd        = document.getElementById('btn-add');
const taskList      = document.getElementById('task-list');
const sortKeySel    = document.getElementById('sort-key');
const sortDirSel    = document.getElementById('sort-dir');

// 서비스/리포
const repo = new TasksRepo(STORAGE_KEY, './data/sample-data.json');
const service = new TaskService(repo);

function render(highlightId = null) {
    const { items } = service.getState();
    taskList.innerHTML = '';

    if (!items.length) {
        taskList.innerHTML = `<div class="row" style="justify-content:center;color:var(--muted);">등록된 메모가 없습니다.</div>`;
        return;
    }

    const data = service.getSorted();

    for (const t of data) {
        const row = document.createElement('div');
        row.className = 'row';
        row.id = `row-${t.id}`;

        const timeBadge = document.createElement('span');
        timeBadge.className = 'badge-time';
        timeBadge.textContent = formatDateTime(new Date(t.createdAt));

        const memo = document.createElement('div');
        memo.className = 'memo';
        memo.title = t.memo;
        memo.textContent = t.memo;

        const meta = document.createElement('div');
        meta.className = 'meta';
        const hBadge = document.createElement('span');
        hBadge.className = 'badge-hours';
        hBadge.textContent = `${Number(t.hours).toFixed(2)}h`;
        meta.appendChild(hBadge);

        const del = document.createElement('button');
        del.className = 'btn-icon';
        del.setAttribute('aria-label', '삭제');
        del.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        del.addEventListener('click', async () => {
            await service.delete(t.id);
            render();
        });

        row.appendChild(timeBadge);
        row.appendChild(memo);
        row.appendChild(meta);
        row.appendChild(del);
        taskList.appendChild(row);
    }

    if (highlightId) {
        const el = document.getElementById(`row-${highlightId}`);
        if (el) {
            el.classList.add('row--new');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => el.classList.remove('row--new'), 1200);
        }
    }
}

async function init() {
    // ✅ 로컬스토리지 우선: 비어있을 때만 sample-data.json으로 시드
    await service.init({ overwriteFromSample: false });

    // 정렬 UI 초기값 반영
    const { sortKey, sortDir } = service.getState();
    sortKeySel.value = sortKey;
    sortDirSel.value = sortDir;

    render();
}

document.addEventListener('DOMContentLoaded', init);

// 등록
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

// 정렬 변경
sortKeySel.addEventListener('change', () => {
    service.setSort({ key: sortKeySel.value });
    render();
});
sortDirSel.addEventListener('change', () => {
    service.setSort({ dir: sortDirSel.value });
    render();
});
