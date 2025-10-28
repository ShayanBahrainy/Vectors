import { LineInert } from "./line.js"
import { Renderer } from "./renderer.js"
import { Point } from './point.js'
export const Grid = class {
    /**@param {Renderer} renderer*/
    constructor(renderer) {
        renderer.addObject(this)
        this.renderer = renderer
        this.shape = null
        this.priority = 0

        this.gridLines()
    }
    gridLines() {
        this.renderparts = []
        let canvas = this.renderer.getCanvas()
        for (let i = 0; i < canvas.width; i += canvas.width/25) {
            this.renderparts.push(new LineInert(new Point(i, 0), new Point(i, canvas.height), 1))
        }
        for (let i = 0; i < canvas.height; i += canvas.height/25) {
            this.renderparts.push(new LineInert(new Point(0, i), new Point(canvas.width, i), 1))
        }

        this.renderparts.push(new LineInert(new Point(0, canvas.height/2), new Point(canvas.width, canvas.height/2), 5))
        this.renderparts.push(new LineInert(new Point(canvas.width/2, 0), new Point(canvas.width/2, canvas.height), 5))
    }
    update() {
        this.gridLines()
    }

    collision() {

    }
}