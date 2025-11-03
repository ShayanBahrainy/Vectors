import { VectorInert } from "./vector.js"

export const Basis = class {
    constructor(i, j) {
        if (!(i instanceof VectorInert)) {
            throw new Error(`Vector i (${i}) is not a valid VectorInert.`)
        }
        if (!(j instanceof VectorInert)) {
            throw new Error(`Vector j (${j}) is not a valid VectorInert.`)
        }
        /**@var Vector */
        this.i = i
        /**@var Vector */
        this.j = j
    }

    getIHat() {
        return this.i
    }

    getJHat() {
        return this.j
    }

    copy() {
        return new Basis(this.i, this.j)
    }
}