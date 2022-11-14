export class Matrix<T> {
    private readonly cols: Map<number, Map<number, T>> = new Map();

    public set(x: number, y: number, value: T) {
        let col = this.cols.get(x);
        if (!col) {
            col = new Map();
            this.cols.set(x, col);
        }
        col.set(y, value);
    }

    public get(x: number, y: number): T | null {
        let col = this.cols.get(x);
        if (!col)
            return null;
        return col.get(y) || null;
    }

    public has(x: number, y: number): boolean {
        let col = this.cols.get(x);
        return col ? col.has(y) : false;
    }
}
