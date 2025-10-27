import {Point} from "./point.js"
import { Renderer } from "./renderer.js"

export const Vector = class Vector {
    /** @type Point */
    static point1 = null

    /**@type boolean */
    static shouldAlignOrigin = false

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
        this.originalPoints = {origin:new Point(origin.x, origin.y), head:new Point(head.x, head.y)}
        this.priority = 0
        this.renderer = renderer
        this.shape = null //Vector graphic has components but not top-level shape
        this.fillStyle = `rgb(${Math.round((Math.random() * 256))}, ${Math.round((Math.random() * 256))}, ${Math.round((Math.random() * 256))})`
    }

    calculateAngle() {
        let a = this.origin.x - this.head.x
        let b = this.origin.y - this.head.y
        return Math.atan2(b, a) * 180/Math.PI
    }

    alignOrigin() {
        let canvas = this.renderer.getCanvas()
        if (this.origin.x > canvas.width/2) {
            this.origin.x -= 1
            this.head.x -= 1
        }

        if (this.origin.x < canvas.width/2) {
            this.origin.x += 1
            this.head.x += 1
        }

        if (this.origin.y < canvas.height/2) {
            this.origin.y += 1
            this.head.y += 1
        }

        if (this.origin.y > canvas.height/2) {
            this.origin.y -= 1
            this.head.y -= 1
        }
    }

    update() {
        if (Vector.shouldAlignOrigin) {
            this.alignOrigin()
        }
        else {
            this.origin = structuredClone(this.originalPoints.origin)
            this.head = structuredClone(this.originalPoints.head)
        }

        this.renderparts = [
            {
                shape: "line",
                x: this.origin.x,
                y: this.origin.y,
                end: this.head,
                width: 3,
                fillStyle: this.fillStyle,
                priority: 0
            },
            {
                shape: "polygon",
                apothem: 10,
                vertexes: 3,
                x: this.head.x,
                y: this.head.y,
                fillStyle: this.fillStyle,
                priority: 0,
                rotation: this.calculateAngle()
            }
        ]
    }

    collision () {

    }

    static toggleAlign() {
        Vector.shouldAlignOrigin = !Vector.shouldAlignOrigin
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