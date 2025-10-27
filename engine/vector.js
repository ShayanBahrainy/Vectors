import {Point} from "./point.js"
import { Renderer } from "./renderer.js"

export const Vector = class Vector {
    /** @type Point */
    static point1 = null


    /** @type Renderer */
    static renderer = null //Set renderer property of Vector before using mouseClick feature

    /** @constructor
     *  @param {Renderer} renderer
     *  @param {Point} origin
     *  @param {Point} head
    */
    constructor(renderer, origin, head) {
        renderer.addObject(this)
        this.origin = origin
        this.head = head
        this.priority = 0
        this.shape = null //Vector graphic has components but not top-level shape
    }

    calculateAngle() {
        let a = this.origin.x - this.head.x
        let b = this.origin.y - this.head.y
        return Math.atan2(b, a) * 180/Math.PI
    }

    getArrowDirection() {
        if (this.origin.x < this.head.x) {
            if (this.origin.y > this.head.y) {
                return 1
            }
            return -1
        }
        if (this.origin.x > this.head.x) {
            if (this.origin.y > this.head.y) {
                return 1
            }
            return -1
        }
    }

    update() {
        this.renderparts = [
            {
                shape: "line",
                x: this.origin.x,
                y: this.origin.y,
                end: this.head,
                width: 3,
                fillStyle: "rgb(255,0,0)",
                priority: 0
            },
            {
                shape: "polygon",
                apothem: 10,
                vertexes: 3,
                x: this.head.x,
                y: this.head.y,
                fillStyle: "rgb(255,0,0)",
                priority: 0,
                rotation: this.calculateAngle()
            }
        ]
    }

    collision () {

    }

    /**@param {PointerEvent} e */
    static handleEvent(e) {
        if (e.type == "pointerdown") {
            const canvas = Vector.renderer.getCanvas()
            const boundingBox = canvas.getBoundingClientRect()
            const x = e.clientX - boundingBox.left
            const y = e.clientY - boundingBox.top
            Vector.mouseClick(x, y)
        }
    }

    static mouseClick(x, y) {
        let point = new Point(x, y)
        if (Vector.point1 == null) {
            Vector.point1 = point
        }
        else {
            new Vector(Vector.renderer, Vector.point1, point)
            Vector.point1 = null
        }
    }
}