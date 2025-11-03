import { Point } from "./point.js"
import { Renderer } from "./renderer.js"
import { Basis } from "./basis.js"


export const VectorInert = class {

    /** @constructor
     *  Stripped down `Vector`, does not draw, or have many features. Good for holding two points.
     *  @param {Point} origin
     *  @param {Point} head
    */
    constructor(origin, head) {
        this.origin = origin
        this.head = head
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

    /**
     * Returns the result of adding the two vectors.
     * @param {this} vector
     * @returns VectorInert
     * */
    add(vector) {
        const dx = vector.dx()
        const dy = vector.dy()
        return new VectorInert(this.origin.copy(), this.head.add(new Point(dx, dy)))
    }

    /**
     * Returns Vector * k
     * @param {Number} k
     */
    multiply(k) {
        const dx = this.dx()
        const dy = this.dy()

        const newHead = new Point(this.origin.x + (dx * k), this.origin.y + (dy * k))
        return new VectorInert(this.origin.copy(), newHead)
    }

    /**
     * Returns change in x
     * @returns Number
     */
    dx() {
        return this.head.x - this.origin.x
    }

    /**
     * Returns change in y
     * @returns Number
     */
    dy() {
        return this.head.y - this.origin.y
    }

    /**
     * Moves the `VectorInert` to have its origin at `point`
     * @param {Point} point
     */
    originAt(point) {
        let dx = this.dx()
        let dy = this.dy()

        this.origin.x = point.x
        this.origin.y = point.y

        this.head.x = this.origin.x + dx
        this.head.y = this.origin.y + dy
    }

    /**
     * Angle between point and positive x-axis (atan2)
     * @returns Number
     */
    calculateAngle() {
        let a = -this.dx()
        let b = -this.dy()
        return Math.atan2(b, a) * 180/Math.PI
    }

}
/**
 *
 * @param {Renderer} renderer
 * @param {Basis}
 * @param {Basis}
 */

export const setupVector = function (renderer, basis) {

    const newVector = class extends Vector {}

    newVector.renderer = renderer
    newVector.basis = basis
    return newVector
}

export const Vector = class extends VectorInert {
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

    /**@type Basis */
    //Standard i-hat and j-hat
    static basis = new Basis(new VectorInert(new Point(0, 0), new Point(0, 1)), new VectorInert(new Point(0, 0), new Point(1,0)))

    /** @constructor
     *  @param {Renderer} renderer
     *  @param {Point} origin
     *  @param {Point} head
    */
    constructor(renderer, origin, head) {
        super(origin, head)
        renderer.addObject(this)
        Vector.addVector(this)
        this.originalPoints = {origin:new Point(origin.x, origin.y), head:new Point(head.x, head.y)}
        this.priority = 0
        this.renderer = renderer
        this.shape = null //Vector graphic has components but not top-level shape
        this.fillStyle = `rgb(${Math.round((Math.random() * 256))}, ${Math.round((Math.random() * 256))}, ${Math.round((Math.random() * 256))})`
        this.selected = false
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

    /**
     * Performs transformation according to `basis`
     * @returns VectorInert
     */
    performTransform() {
        const newVectorInert = Vector.basis.getJHat().multiply(this.dx()).add(Vector.basis.getIHat().multiply(this.dy()))

        newVectorInert.originAt(this.origin.copy())

        return newVectorInert
    }

    /**
     * Creates a new `Vector` from a `VectorInert`
     * @param {VectorInert} vector
     * @returns `Vector`
     */
    static fromInert(vector) {
        return new Vector(this.renderer, vector.origin.copy(), vector.head.copy())
    }

    update() {
        if (Vector.shouldAlignOrigin) {
            this.alignOrigin()
        }
        else {
            this.origin = this.originalPoints.origin.copy()
            this.head = this.originalPoints.head.copy()
        }

        const transformed = this.performTransform()
        this.renderparts = [
            {
                shape: "line",
                x: transformed.origin.x,
                y: transformed.origin.y,
                end: transformed.head,
                width: this.selected ? 5 : 3,
                fillStyle: this.fillStyle,
                priority: 0
            },
            {
                shape: "polygon",
                apothem: this.selected ? 15 : 10,
                vertexes: 3,
                x: transformed.head.x,
                y: transformed.head.y,
                fillStyle: this.fillStyle,
                priority: 0,
                rotation: transformed.calculateAngle()
            }
        ]
    }

    collision () {

    }

    /**
     * Moves the `Vector` to have its origin at `point`
     * @param {Point} point
     */
    originAt(point) {
        let dx = this.dx()
        let dy = this.dy()

        this.origin.x = point.x
        this.origin.y = point.y

        this.head.x = this.origin.x + dx
        this.head.y = this.origin.y + dy

        this.originalPoints.head = this.head.copy()
        this.originalPoints.origin = this.origin.copy()
    }

    destruct() {
        this.renderer.removeObject(this)
        Vector.remove(this)
    }

    /**
     * Updates the original `origin` and `head` of the Vector
     * @param {Point} origin
     * @param {Point} head
     */
    setOriginalPosition(origin, head) {
        this.origin = origin.copy()
        this.head = head.copy()
    }
    /**
     * Updates the basis vectors
     * @param {Basis} basis
     */
    static updateBasis(basis) {
        if (!(basis instanceof Basis)) {
            throw new Error(`${basis} is not a valid basis.`)
        }
        Vector.basis = basis
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

    /**
     * Force align to `value`
     * @param {boolean} value
     */
    static forceAlign(value) {
        Vector.shouldAlignOrigin = value
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
