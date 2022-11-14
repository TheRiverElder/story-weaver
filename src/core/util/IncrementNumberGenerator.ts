import { Generator } from '../common';

export class IncrementNumberGenerator implements Generator<number> {
    private counter: number;

    constructor(counter: number = 0) {
        this.counter = counter;
    }

    generate() {
        return this.counter++;
    }
}

