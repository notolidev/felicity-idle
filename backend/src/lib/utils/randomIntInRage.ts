import type { Range } from "../../../../frontend/src/lib/types.ts";

export function randomIntInRange(range: Range<number>): number {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}
