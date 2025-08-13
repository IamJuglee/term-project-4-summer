// 통계 화면: 저장소에서 데이터를 읽어 날짜별로 합산하여 표 형태로 렌더링
import { TasksRepo } from './modules/tasksRepo.js';
import { formatDateKey } from './modules/utils.js';

// 로컬스토리지 키와 DOM 타겟
const STORAGE_KEY = 'tasks_v2';
const statsArea = document.getElementById('stats-area');

// Repo 인스턴스: localStorage 우선, sample-data.json은 비어있을 때만 사용
const repo = new TasksRepo(STORAGE_KEY, './data/sample-data.json');

/**
 * 초기화
 * 1) Repo 초기화(최초 진입 시에만 샘플 시드)
 * 2) 전체 작업 로드
 * 3) 일자별 공수를 합산하여 테이블로 렌더
 */
async function init() {
    // 로컬 데이터가 없을 때만 샘플로 시드
    await repo.init({ overwriteFromSample: false });

    // 전체 데이터 로드
    const tasks = await repo.loadAll();

    // 날짜별 합계 계산
    const byDate = new Map();
    for (const t of tasks) {
        const key = formatDateKey(t.createdAt); // YYYY-MM-DD
        byDate.set(key, (byDate.get(key) || 0) + Number(t.hours || 0));
    }

    // 최신 날짜가 위로 오도록 내림차순 정렬
    const rows = [...byDate.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
    const total = rows.reduce((sum, [, h]) => sum + h, 0);

    // 통계 카드(표 포함) 생성
    const card = document.createElement('div');
    card.className = 'row';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'stretch';

    // 간단한 테이블 마크업(스타일은 인라인으로 최소 적용)
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

    // 기존 내용 제거 후 통계 카드 삽입
    statsArea.innerHTML = '';
    statsArea.appendChild(card);
}

// DOM이 준비된 후 초기화 실행
document.addEventListener('DOMContentLoaded', init);
