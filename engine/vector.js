import { Line } from "./line.js"
import {Point} from "./point.js"
import { Renderer } from "./renderer.js"

export const Vector = class Vector {
    /** @type Point */
    static point1 = null

    /**@type boolean */
    static shouldAlignOrigin = false

    /** @type Renderer */
    static renderer = null //Set renderer property of Vector before using mouseClick feature

    /** @type Array */
    static vectors = []

    /**@type Vector */
    static selected = null;

    /** @constructor
     *  @param {Renderer} renderer
     *  @param {Point} origin
     *  @param {Point} head
    */
    constructor(renderer, origin, head) {
        renderer.addObject(this)
        Vector.addVector(this)
        this.origin = origin
        this.head = head
        this.originalPoints = {origin:new Point(origin.x, origin.y), head:new Point(head.x, head.y)}
        this.priority = 0
        this.renderer = renderer
        this.shape = null //Vector graphic has components but not top-level shape
        this.fillStyle = `rgb(${Math.round((Math.random() * 256))}, ${Math.round((Math.random() * 256))}, ${Math.round((Math.random() * 256))})`
        this.selected = false
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

    toggleSelect() {
        this.selected = !this.selected
        if (this.selected) {
            Vector.selected = this
        }
        else {
            Vector.selected = null
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
                width: this.selected ? 5 : 3,
                fillStyle: this.fillStyle,
                priority: 0
            },
            {
                shape: "polygon",
                apothem: this.selected ? 15 : 10,
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

    /** @param {Point} otherPoint */
    distanceFromPoint(otherPoint) {

        let m = (this.head.y - this.origin.y) / (this.head.x - this.origin.x)
        let b = this.origin.y - (m * this.origin.x)


        let m_ = -(1/m)
        let b_ = otherPoint.y - (m_ * otherPoint.x)

        let intersection_x = (b_ - b)/(m-m_)
        let intersection_y = (m * intersection_x) + b

        let intersection = new Point(intersection_x, intersection_y)

        //If the intersection (closest point on line) is outside of the segment that is the Vector, we return the minimum distance to an endpoint
        if (intersection.x < Math.min(this.origin.x, this.head.x) || intersection.x > Math.max(this.origin.x, this.head.x)) {
            return Math.min(otherPoint.distance(this.origin), otherPoint.distance(this.head))
        }

        return otherPoint.distance(intersection)
    }

    destruct() {
        this.renderer.removeObject(this)
        Vector.remove(this)
    }

    /**
     *
     * @param {Vector} vector
     */
    static addVector(vector){
        /* Add Vector */

        this.vectors.push(vector)

    }
    /**
     *
     * @param {Vector} vector
     */
    static remove(vector) {
        let index = this.vectors.indexOf(vector)
        if (index > -1) {
            this.vectors.splice(index, 1)
        }
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


    /**
     * @param {Point} point
     * @returns {Vector}
    */
    static getFromPoint(point) {
        let closest = null
        let closestDistance = Number.POSITIVE_INFINITY

        for (let i = 0; i < Vector.vectors.length; ++i) {
            const distance = Vector.vectors[i].distanceFromPoint(point)
            if (distance < closestDistance) {
                closest = Vector.vectors[i]
                closestDistance = distance
            }
        }

        return closest
    }
}