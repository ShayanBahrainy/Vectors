import { Renderer } from "./renderer.js"
import { Vector } from "./vector.js"
import { Point } from "./point.js"

export const Operation = class {

    /**
     * Subclasses will override this to the necessary quantity of parameters
     */

    static parameterCount = 0;

    /**
     *
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        if (new.target == Operation) {
            throw new Error("Operation cannot be instantiated directly.")
        }
        this.renderer = renderer

        /**@var Vector[] */
        this.parameters = []
    }

    /**
     * Returns true if necessary parameters have been given
     * @returns Boolean
     */

    checkIfComplete() {
        return this.parameters.length == this.parameterCount
    }

    /**
     * 
     * @param {Point} point
     */
    attemptPlace(point) {
        if (!this.checkIfComplete() || !this.vector) {
            throw new Error(`Attempt to place a incomplete operation: ${this.parameters}`)
        }
        this.vector.originAt(point)
    }

    /**
     * Place the Vector, and reset for a new operation
     * @param {Point} point
     */
    placeVector(point) {
        if (!this.checkIfComplete() || !this.vector) {
            throw new Error(`Attempt to place a incomplete operation: ${this.parameters}`)
        }
        this.vector.originAt(point)
        this.vector = null
        this.parameters = []
    }

    /**
     * Override this to do the operation
     * @returns Vector
     */
    compute() {
        throw new Error("You must redefine the compute function!")
    }

    /**
     * Add a corresponding parameter
     * @param {Vector} vector
     */
    addParameter(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error(`Invalid parameter: ${vector}`)
        }

        if (this.parameters.length == this.parameterCount) {
            throw new Error(`Too many parameters: ${this.parameters}`)
        }

        this.parameters.push(vector)

        if (this.checkIfComplete())  {
            /**
             * @var Vector
             */
            this.vector = this.compute()
        }
    }

    reset() {
        this.vector = null
        this.parameters = []
    }

}