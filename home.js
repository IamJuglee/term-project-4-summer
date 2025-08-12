// 홈 그리드: 1~14주차 + 15주차(텀프로젝트)
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

const grid = document.getElementById("weekGrid");

function pad2(n) {
    return n.toString().padStart(2, "0");
}

function makeCard({ no, title }) {
    const a = document.createElement("a");
    a.className = "card";
    const href =
        no === 15
            ? "./project/index.html"
            : `./practice/week${pad2(no)}/index.html`;
    a.href = href;
    a.setAttribute("data-title", `${no}주차 ${title}`);
    a.innerHTML = `
    <div class="card-badge">${no}주차</div>
    <div class="card-title">${title}</div>
    <div class="card-desc">${no === 15 ? "프로젝트 페이지 열기" : "예제/과제 코드 보기"}</div>
  `;
    a.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            a.click();
        }
    });
    a.tabIndex = 0;
    return a;
}

function render(list) {
    grid.innerHTML = "";
    list.forEach((w) => grid.appendChild(makeCard(w)));
}

// 초기 렌더
render(weeks);
