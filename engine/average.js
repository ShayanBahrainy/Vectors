import { Operation } from "./operation.js"
import { Renderer } from "./renderer.js"
import { Vector } from "./vector.js"
import { Point } from "./point.js"

export const Average = class extends Operation {

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

        let origin = new Point((this.parameters[0].origin.x + this.parameters[1].origin.x) / 2, (this.parameters[0].origin.y + this.parameters[1].origin.y) / 2)
        let head = new Point((this.parameters[0].head.x + this.parameters[1].head.x) / 2, (this.parameters[0].head.y + this.parameters[1].head.y) / 2)

        return new Vector(this.renderer, origin.copy(), head.copy())
    }
}