import { Renderer } from "./renderer.js"

export const LineInert = class {
    /**@param {Point} start
     * @param {Point}  end
     * @param {Number} width
    */
    constructor(start, end, width) {
        this.x = start.x
        this.y = start.y
        this.end = end
        this.width = width
        this.shape = "line"
        this.width = width
        this.priority = 0
        this.fillStyle = "rgb(255, 255, 255)"
    }

    update() {

    }

    collision () {
        
    }
}

export const Line = class {
    /**
     * @param {Point} start
     * @param {Point}  end
     * @param {Number} width
     * @param {Renderer} renderer
    */
    constructor(start, end, width, renderer) {
        renderer.addObject(this)
        this.x = start.x
        this.y = start.y
        this.end = end
        this.width = width
        this.shape = "line"
        this.width = width
        this.priority = 0
        this.fillStyle = "rgb(255, 255, 255)"
    }

    update() {

    }

    collision () {
        
    }
}