import { Grid } from "./engine/grid.js"
import { Renderer } from "./engine/renderer.js"
import { Vector } from "./engine/vector.js"

let renderer


function handleEvent(e) {
    if (e.type == "pointerdown" && document.elementFromPoint(e.clientX, e.clientY).tagName == "CANVAS") {
        const canvas = Vector.renderer.getCanvas()
        const boundingBox = canvas.getBoundingClientRect()
        const x = e.clientX - boundingBox.left
        const y = e.clientY - boundingBox.top
        Vector.mouseClick(x, y)
    }

    if (e.type == "change" && e.target.id == "align-origin") {
        Vector.toggleAlign()
    }
}

window.addEventListener("load", function () {
    renderer = new Renderer()
    Vector.renderer = renderer
    new Grid(renderer, 10, 10)
    document.addEventListener("pointerdown", handleEvent)
    this.document.getElementById("align-origin").addEventListener("change", handleEvent)

    let toolbox = this.document.querySelector(".toolbox")
    let toolMenu = this.document.querySelector(".toolmenu")
    toolbox.addEventListener("click", function () {
        toolMenu.classList.toggle("opened")
        toolMenu.classList.toggle("closed")
    })
})