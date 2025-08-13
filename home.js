// 주차별 데이터 정의: 1~14주차 + 15주차(텀프로젝트)
const weeks = [
    { no: 1,  title: "값과 변수" },
    { no: 2,  title: "제어 구조" },
    { no: 3,  title: "함수와 함수형 프로그래밍" },
    { no: 4,  title: "객체지향 프로그래밍" },
    { no: 5,  title: "숫자와 날짜" },
    { no: 6,  title: "문자열과 정규 표현식" },
    { no: 7,  title: "배열과 컬렉션" },
    { no: 8,  title: "국제화 (Intl)" },
    { no: 9,  title: "비동기 프로그래밍 I (Promise)" },
    { no: 10, title: "비동기 프로그래밍 II (async/await)" },
    { no: 11, title: "모듈 (import/export)" },
    { no: 12, title: "메타프로그래밍 (Proxy/Reflect/Symbol)" },
    { no: 13, title: "반복자와 제너레이터" },
    { no: 14, title: "타입스크립트 소개" },
    { no: 15, title: "텀프로젝트" },
];

// 주차 카드를 추가할 HTML 영역 가져오기
const grid = document.getElementById("weekGrid");

// 한 자리 숫자를 두 자리로 변환하는 유틸 함수 (예: 1 → "01")
function pad2(n) {
    return n.toString().padStart(2, "0");
}

// 주차별 카드 DOM 요소 생성 함수
function makeCard({ no, title }) {
    const a = document.createElement("a"); // a 태그 생성
    a.className = "card"; // 카드 스타일 적용

    // 주차 번호에 따라 이동할 페이지 경로 설정
    const href =
        no === 15
            ? "./project/index.html" // 15주차 → 텀프로젝트
            : `./practice/week${pad2(no)}/index.html`; // 1~14주차 → 실습 페이지
    a.href = href;

    // 카드의 데이터 속성 설정 (접근성 & 추후 활용)
    a.setAttribute("data-title", `${no}주차 ${title}`);

    // 카드 내부 HTML 구조
    a.innerHTML = `
        <div class="card-badge">${no}주차</div>
        <div class="card-title">${title}</div>
        <div class="card-desc">${no === 15 ? "프로젝트 페이지 열기" : "예제/과제 코드 보기"}</div>
    `;

    // 키보드 접근성 지원 (스페이스/엔터 키로 클릭 동작)
    a.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            a.click();
        }
    });

    // 탭으로 접근 가능하도록 설정
    a.tabIndex = 0;

    return a;
}

// 주차별 카드를 화면에 렌더링
function render(list) {
    grid.innerHTML = ""; // 기존 카드 초기화
    list.forEach((w) => grid.appendChild(makeCard(w))); // 새 카드 추가
}

// 초기 실행: 모든 주차 렌더링
render(weeks);
