const Tile = {
    WALL : 'wall',
    PATH : 'path',
    START : 'start',
    END : 'end',
};
Object.freeze(Tile);

function countNeighbors(grid, x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && ny < grid.length && nx < grid[0].length) {
                count += (grid[ny][nx] === Tile.WALL ? 1 : 0);
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

function isOverlap(cells, x, y, width, height){
    for (let i = 0; i < height; i++)
    {
        for (let j = 0; j < width; j++)
        {
            if (cells[y + i][x + j] == Tile.PATH)
            {
                return true;
            }
        }
    }
    return false;
}

function connectRooms(cells, roomA, roomB) {
    const x1 = Math.floor(roomA.x + roomA.width / 2);
    const y1 = Math.floor(roomA.y + roomA.height / 2);
    const x2 = Math.floor(roomB.x + roomB.width / 2);
    const y2 = Math.floor(roomB.y + roomB.height / 2);

    // 수평 복도
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        cells[y1][x] = Tile.PATH;
    }
    // 수직 복도
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        cells[y][x2] = Tile.PATH;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}