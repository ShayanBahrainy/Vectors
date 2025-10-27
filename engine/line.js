export const Line = class {
    /**@param {Point} start */
    /**@param {Point}  end*/
    /**@param {Number} width*/
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