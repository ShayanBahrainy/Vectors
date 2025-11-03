import { Operation } from "./operation.js"
import { Renderer } from "./renderer.js"
import { Vector } from "./vector.js"
import { Point } from "./point.js"

export const Subtraction = class extends Operation {

    parameterCount = 2

    /**
     *
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        super(renderer)
    }


    compute() {
        if (!this.checkIfComplete()) {
            throw new Error("Attempt to perform computation on incomplete operation!")
        }

        let dx = -(this.parameters[1].head.x - this.parameters[1].origin.x)
        let dy = -(this.parameters[1].head.y - this.parameters[1].origin.y)

        return new Vector(this.renderer, this.parameters[0].origin.copy(), this.parameters[0].head.add(new Point(dx, dy)))
    }
}