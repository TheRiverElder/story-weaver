export default class NumberGenerator {
    
    private nextValue: number;

    constructor(value?: number) {
        this.nextValue = value ?? 1;
    }

    public generate(): number {
        return this.nextValue++;
    }
}