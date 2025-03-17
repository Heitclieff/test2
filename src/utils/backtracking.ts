import { GridType, TileType } from "./types";

const reconstructPath = (grid: GridType, endTile: TileType) => {
    const path: TileType[] = [];
    let current: TileType | null = grid[endTile.row][endTile.col];

    while (current) {
        current.isPath = true; // Mark ว่าเป็นส่วนหนึ่งของเส้นทาง
        path.unshift(current); // เพิ่ม Tile ลง path (ใส่ข้างหน้า)
        current = current.parent || null; // ขยับไป tile ก่อนหน้า
    }

    return path;
};


const isValidTile = (grid: GridType, row: number, col: number) => {
    return (
        row >= 0 &&
        col >= 0 &&
        row < grid.length &&
        col < grid[0].length &&
        !grid[row][col].isWall && // ต้องไม่ใช่กำแพง
        !grid[row][col].isTraversed // ต้องยังไม่ถูกเดินผ่าน
    );
};

export { reconstructPath, isValidTile }