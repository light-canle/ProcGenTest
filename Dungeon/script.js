const gridSize = 200;
const gridContainer = document.getElementById('grid-container');
let grid = [];

for (let y = 0; y < gridSize; y++) {
    const row = [];
    for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gridContainer.appendChild(cell);
        row.push(cell);
    }
    grid.push(row);
}

// 1. 그리드 초기화
function initGrid()
{
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            grid[y][x].classList.remove('path');
            grid[y][x].classList.remove('start');
            grid[y][x].classList.remove('end');
        }
    }
}


// 2. 랜덤 던전 생성 함수
function generateDungeon() {
    initGrid();
    let x = Math.floor(gridSize / 2); // 시작 지점
    let y = Math.floor(gridSize / 2);
    grid[y][x].classList.add('path');
    
    for (let i = 0; i < 7000; i++) { // 7000번 이동
        const direction = Math.floor(Math.random() * 4);
        if (direction === 0 && x > 0) x--; // 왼쪽
        else if (direction === 1 && x < gridSize - 1) x++; // 오른쪽
        else if (direction === 2 && y > 0) y--; // 위쪽
        else if (direction === 3 && y < gridSize - 1) y++; // 아래쪽
        grid[y][x].classList.add('path');
    }
    
    // 시작점 및 종료점 설정
    grid[Math.floor(gridSize / 2)][Math.floor(gridSize / 2)].classList.add('start');
    grid[y][x].classList.add('end');
}

// 3. 던전 생성 실행
generateDungeon();

// 버튼 클릭 시 던전 새로 생성
const generateButton = document.getElementById('generateButton');
generateButton.addEventListener('click', generateDungeon);
