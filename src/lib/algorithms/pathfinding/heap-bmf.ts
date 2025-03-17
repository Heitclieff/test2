import MinHeap from 'fastpriorityqueue';
import { GridType, TileType } from '../../../utils/types';
import { isValidTile, reconstructPath } from '../../../utils/backtracking';

export const heapBmf = (
    grid: GridType,
    startTile: TileType,
    endTile: TileType
) => {
    console.time('heap-bellmanFord');  // เริ่มจับเวลา

    const base = grid[startTile.row][startTile.col];
    base.distance = 0;
    base.isTraversed = true;

    const pq = new MinHeap<TileType>((a, b) => a.distance < b.distance); // MinHeap สำหรับเลือก tile ที่มีระยะทางน้อยที่สุด
    pq.add(base);

    const traversedTiles: TileType[] = [];
    const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const traversedSet = new Set<string>(); // ใช้ Set เพื่อลดความซับซ้อนในการตรวจสอบ

    while (!pq.isEmpty()) {
        const currentTile = pq.poll();
        if (!currentTile || currentTile.isWall) continue;

        // หยุดทันทีเมื่อเจอ endTile
        if (currentTile === endTile) {
            traversedTiles.push(currentTile);
            break;
        }

        traversedTiles.push(currentTile); // เก็บ Tile ที่เดินผ่าน
        const currentKey = `${currentTile.row}-${currentTile.col}`;
        traversedSet.add(currentKey); // ทำเครื่องหมายว่าเยี่ยมชมแล้ว

        for (const [dr, dc] of directions) {
            const newRow = currentTile.row + dr;
            const newCol = currentTile.col + dc;
            const key = `${newRow}-${newCol}`;

            if (!isValidTile(grid, newRow, newCol) || traversedSet.has(key)) continue;

            const neighbor = grid[newRow][newCol];
            const newDistance = currentTile.distance + 1;

            // ตรวจสอบว่า distance ถูกปรับให้น้อยกว่าเดิมหรือไม่
            if (neighbor.distance > newDistance) {
                neighbor.distance = newDistance;
                neighbor.parent = currentTile;
                pq.add(neighbor); // เพิ่มใน MinHeap
            }
        }
    }

    const path = reconstructPath(grid, endTile);
    console.timeEnd('heap-bellmanFord');  // หยุดจับเวลาและแสดงผล
    return { traversedTiles, path };
};
