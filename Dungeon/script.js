function countNeighbors(grid, x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && ny < grid.length && nx < grid[0].length) {
                count += grid[ny][nx];
            }
        }
    }
    return count;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
    
    for (let i = 0; i < 30000; i++) { // 30000번 이동
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

function cellularAutomata(iterations, prob)
{
    initGrid();

    let cells = [];
    for (let y = 0; y < gridSize; y++) {
        const row = [];
        for (let x = 0; x < gridSize; x++) {
            row.push(Math.random() < prob ? 1 : 0);
        }
        cells.push(row);
    }

    for (let i = 0; i < iterations; i++) {
        const newGrid = cells.slice();
        for (let y = 0; y < cells.length; y++) {
            for (let x = 0; x < cells[0].length; x++) {
                const neighbors = countNeighbors(cells, x, y);
                if (neighbors > 4) newGrid[y][x] = 1; // 길
                else if (neighbors < 4) newGrid[y][x] = 0; // 벽
            }
        }
        cells = newGrid;
    }

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (cells[y][x] == 1)
            {
                grid[y][x].classList.add('path');
            }
        }
    }
}

function generateMaze() {
    let cells = [];
    for (let y = 0; y < gridSize; y++) {
        const row = [];
        for (let x = 0; x < gridSize; x++) {
            row.push(0);
        }
        cells.push(row);
    }
    const stack = [];
    let x = 1, y = 1;
    cells[y][x] = 1; // 시작 지점
    stack.push([x, y]);
    grid[y][x].classList.add('start');

    while (stack.length > 0) {
        const [cx, cy] = stack[stack.length - 1];
        const directions = shuffle([[0, -2], [0, 2], [-2, 0], [2, 0]]);
        let moved = false;

        for (const [dx, dy] of directions) {
            const nx = cx + dx, ny = cy + dy;
            if (nx > 0 && ny > 0 && nx < gridSize - 1 && ny < gridSize - 1 && cells[ny][nx] === 0) {
                cells[cy + dy / 2][cx + dx / 2] = 1; // 중간 벽 제거
                cells[ny][nx] = 1; // 이동한 셀
                stack.push([nx, ny]);
                moved = true;
                break;
            }
        }
        if (!moved) stack.pop(); // 되돌아감
    }

    grid[gridSize - 3][gridSize - 3].classList.add('end');

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (cells[y][x] == 1)
            {
                grid[y][x].classList.add('path');
            }
        }
    }
}

// 3. 던전 생성 실행
// generateDungeon();
// cellularAutomata(5, 0.5);
generateMaze();

// 버튼 클릭 시 던전 새로 생성
const generateButton = document.getElementById('generateButton');
generateButton.addEventListener('click', generateDungeon);
