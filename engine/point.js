export const Point = class Point {
    /**@param {Number} x*/
    /**@param {Number} y*/
    constructor(x, y) {
        /**@var {Number} x*/
        this.x = x
        /**@var {Number} y*/
        this.y = y
    }
    /**@param {Point} point */
    add(point) {
        return new Point(this.x + point.x, this.y + point.y)
    }
    add (x, y) {
        return new Point(this.x + x, this.y + y)
    }
    /**@param {Point} otherPoint */
    lessThan(otherPoint) {
        return this.x < otherPoint.x 
    }
}