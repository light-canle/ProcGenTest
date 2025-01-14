const gridSize = 100;
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
            grid[y][x].classList.remove('wall');
            grid[y][x].classList.remove('path');
            grid[y][x].classList.remove('start');
            grid[y][x].classList.remove('end');
        }
    }
}

// 모든 칸이 벽으로 이루어진 셀
function clearCells()
{
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(Tile.WALL));
}

// pathProb의 확률로 길이 임의로 놓인 셀을 반환
// boundary의 크기만큼 테두리는 벽으로 채운다.
function randomPathCells(pathProb = 0.5, boundary = 1)
{
    let cells = Array.from({ length: gridSize }, () => Array(gridSize).fill(Tile.WALL));
    for (let y = boundary; y < gridSize - boundary; y++) {
        for (let x = boundary; x < gridSize - boundary; x++) {
            cells[y][x] = Math.random() < pathProb ? Tile.PATH : Tile.WALL;
        }
    }
    return cells;
}

// 2. 랜덤 던전 생성 함수

// 시작 위치에서 임의로 times번 만큼 상하좌우로 움직이며 길을 설치한다.
function randomWalk(cells, times = 5000, startX = Math.floor(gridSize / 2), startY = Math.floor(gridSize / 2)) {
    let x = startX; // 시작 지점
    let y = startY;
    cells[y][x] = Tile.PATH;
    
    for (let i = 0; i < times; i++) { // times번 이동
        const direction = Math.floor(Math.random() * 4);
        if (direction === 0 && x > 1) x--; // 왼쪽
        else if (direction === 1 && x < gridSize - 2) x++; // 오른쪽
        else if (direction === 2 && y > 1) y--; // 위쪽
        else if (direction === 3 && y < gridSize - 2) y++; // 아래쪽
        cells[y][x] = Tile.PATH;
    }
    
    // 시작점 및 종료점 설정
    cells[startY][startX] = Tile.START;
    cells[y][x] = Tile.END;

    return cells;
}

function cellularAutomata(cells, iterations = 15)
{
    for (let i = 0; i < iterations; i++) {
        let newGrid = cells.slice();
        for (let y = 1; y < cells.length - 1; y++) {
            for (let x = 1; x < cells[0].length - 1; x++) {
                const neighbors = countNeighbors(cells, x, y);
                if (neighbors > 4) newGrid[y][x] = Tile.WALL; // 벽
                else if (neighbors < 4) newGrid[y][x] = Tile.PATH; // 길
            }
        }
        cells = newGrid;
    }
    return cells;
}

// 너비 1 크기의 미로를 만들어낸다.
function generateMaze(cells) {
    const stack = [];
    let x = 1, y = 1;
    cells[y][x] = Tile.PATH; // 시작 지점
    stack.push([x, y]);

    while (stack.length > 0) {
        const [cx, cy] = stack[stack.length - 1];
        const directions = shuffle([[0, -2], [0, 2], [-2, 0], [2, 0]]);
        let moved = false;

        for (const [dx, dy] of directions) {
            const nx = cx + dx, ny = cy + dy;
            if (nx > 0 && ny > 0 && nx < gridSize - 1 && ny < gridSize - 1 && cells[ny][nx] === Tile.WALL) {
                cells[cy + dy / 2][cx + dx / 2] = Tile.PATH; // 중간 벽 제거
                cells[ny][nx] = Tile.PATH; // 이동한 셀
                stack.push([nx, ny]);
                moved = true;
                break;
            }
        }
        if (!moved) stack.pop(); // 되돌아감
    }

    return cells;
}

function generateRooms(cells, roomCount = getRandomInt(5, 11) + getRandomInt(5, 11), roomSizeRange = [5, 12]) {
    // 랜덤 방 생성
    const rooms = [];
    let generatedRooms = 0;
    while (generatedRooms < roomCount) {
        const width = getRandomInt(roomSizeRange[0], roomSizeRange[1]);
        const height = getRandomInt(roomSizeRange[0], roomSizeRange[1]);
        const x = getRandomInt(1, gridSize - width - 1);
        const y = getRandomInt(1, gridSize - height - 1);

        if (isOverlap(cells, x, y, width, height))
        {
            continue;
        }
        rooms.push({ x, y, width, height });
        generatedRooms++;
        for (let row = y; row < y + height; row++) {
            for (let col = x; col < x + width; col++) {
                cells[row][col] = Tile.PATH; // 방은 빈 공간
            }
        }
    }

    // 방 연결 (복도)
    for (let i = 1; i < rooms.length; i++) {
        const roomA = rooms[i - 1];
        const roomB = rooms[i];
        connectRooms(cells, roomA, roomB);
    }

    return cells;
}

function BSPDungeon(cells, minRoomSize = 6) {
    const rooms = [];
    // 초기 분할 영역
    const splitArea = [{ x: 0, y: 0, width: gridSize - 1, height: gridSize - 1}];

    while (splitArea.length > 0) {
        const area = splitArea.pop();
        if (area.width > minRoomSize * 2 || area.height > minRoomSize * 2) {
            if (area.width > area.height) {
                const split = getRandomInt(minRoomSize, area.width - minRoomSize);
                splitArea.push({ x: area.x, y: area.y, width: split, height: area.height });
                splitArea.push({ x: area.x + split, y: area.y, width: area.width - split, height: area.height });
            } else {
                const split = getRandomInt(minRoomSize, area.height - minRoomSize);
                splitArea.push({ x: area.x, y: area.y, width: area.width, height: split });
                splitArea.push({ x: area.x, y: area.y + split, width: area.width, height: area.height - split });
            }
        } else {
            const room = {
                x: area.x + getRandomInt(0, area.width - minRoomSize),
                y: area.y + getRandomInt(0, area.height - minRoomSize),
                width: getRandomInt(minRoomSize, area.width),
                height: getRandomInt(minRoomSize, area.height)
            };
            if (room.x + room.width >= gridSize)
            {
                room.width -= (room.x + room.width - gridSize) + 1
            }
            if (room.y + room.height >= gridSize)
            {
                room.height -= (room.y + room.height - gridSize) + 1
            }
            rooms.push(room);
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    cells[y][x] = Tile.PATH; // 방 생성
                }
            }
        }
    }

    return cells;
}

// 두 셀에서 같은 위치의 칸 중 하나라도 길이면 길, 아니면 벽으로 바꾼 것을 반환환다.
function cellsOR(cells1, cells2)
{
    let cells = Array.from({ length: gridSize }, () => Array(gridSize).fill(Tile.WALL));
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            cells[y][x] = (cells1[y][x] === Tile.WALL && cells2[y][x] === Tile.WALL) ? Tile.WALL : Tile.PATH;
        }
    }
    return cells;
}

// 두 셀에서 같은 위치의 칸 중 하나라도 벽이면 벽, 아니면 길로 바꾼 것을 반환환다.
function cellsAND(cells1, cells2)
{
    let cells = Array.from({ length: gridSize }, () => Array(gridSize).fill(Tile.WALL));
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            cells[y][x] = (cells1[y][x] === Tile.WALL || cells2[y][x] === Tile.WALL) ? Tile.WALL : Tile.PATH;
        }
    }
    return cells;
}

// 실제 그리드에 반영
function updateGrid(cells)
{
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            grid[y][x].classList.add(cells[y][x]);
        }
    }
}

// 3. 던전 생성 실행
// generateDungeon();
// cellularAutomata(5, 0.5);
// generateMaze();
// generateRooms(getRandomInt(5, 11) + getRandomInt(5, 11), [5, 10]);

function generateDungeon(initCellFunc, genFunc, initCellFunc2 = null, genFunc2 = null, combineFunc = null)
{
    initGrid();
    let cells = initCellFunc();
    cells = genFunc(cells);
    let ret = cells;
    if (initCellFunc2 !== null && genFunc2 !== null && combineFunc !== null)
    {
        let cells2 = initCellFunc2();
        cells2 = genFunc2(cells2);
        ret = combineFunc(cells, cells2);
    }
    updateGrid(ret);
}
