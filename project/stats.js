import { TasksRepo } from './modules/tasksRepo.js';
import { formatDateKey } from './modules/utils.js';

const STORAGE_KEY = 'tasks_v2';
const statsArea = document.getElementById('stats-area');
const repo = new TasksRepo(STORAGE_KEY, './data/sample-data.json');

async function init() {
    // ✅ 로컬스토리지 우선: 비어있을 때만 sample-data.json으로 시드
    await repo.init({ overwriteFromSample: false });

    const tasks = await repo.loadAll();

    // 일자별 합계
    const byDate = new Map();
    for (const t of tasks) {
        const key = formatDateKey(t.createdAt);
        byDate.set(key, (byDate.get(key) || 0) + Number(t.hours || 0));
    }
    const rows = [...byDate.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
    const total = rows.reduce((sum, [, h]) => sum + h, 0);

    // 표 렌더
    const card = document.createElement('div');
    card.className = 'row';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'stretch';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
    <thead>
      <tr>
        <th style="text-align:left;padding:12px;border-bottom:1px solid #303853;">일자</th>
        <th style="text-align:right;padding:12px;border-bottom:1px solid #303853;">합계 공수(h)</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(([d,h])=>`
        <tr>
          <td style="padding:10px;border-bottom:1px solid #262c3e;">${d}</td>
          <td style="padding:10px;border-bottom:1px solid #262c3e;text-align:right;">${h.toFixed(2)}</td>
        </tr>
      `).join('')}
      <tr>
        <td style="padding:12px;font-weight:700;border-top:1px solid #303853;">총합</td>
        <td style="padding:12px;font-weight:700;border-top:1px solid #303853;text-align:right;">${total.toFixed(2)} h</td>
      </tr>
    </tbody>
  `;
    card.appendChild(table);

    statsArea.innerHTML = '';
    statsArea.appendChild(card);
}

document.addEventListener('DOMContentLoaded', init);
