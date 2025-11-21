import { Operation } from "./operation.js"
import { Renderer } from "./renderer.js"
import { Vector } from "./vector.js"
import { Point } from "./point.js"

export const ScalarMultiplication = class extends Operation {

    /**
     * @var Number
    */
    k = 2

    parameterCount = 1

    /**
     *
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        super(renderer)
    }

    /**
     * Sets the constant to multiply by, default is 2
     * @param {Number} k
     */
    setK(k) {
        this.k = k
    }


    compute() {
        if (!this.checkIfComplete()) {
            throw new Error("Attempt to perform computation on incomplete operation!")
        }

        let newHead = this.parameters[0].origin.copy().add(new Point(this.parameters[0].dx() * this.k, this.parameters[0].dy() * this.k))

        return new Vector(this.renderer, this.parameters[0].origin.copy(), newHead)
    }
}