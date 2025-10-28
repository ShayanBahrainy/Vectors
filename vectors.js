import { Grid } from "./engine/grid.js"
import { Renderer } from "./engine/renderer.js"
import { Vector } from "./engine/vector.js"
import { Point } from "./engine/point.js"

let renderer
let mode = "create"

function handleEvent(e) {
    if (e.type == "pointerdown" && document.elementFromPoint(e.clientX, e.clientY).tagName == "CANVAS" && mode == "create") {
        const canvas = Vector.renderer.getCanvas()
        const boundingBox = canvas.getBoundingClientRect()
        const x = e.clientX - boundingBox.left
        const y = e.clientY - boundingBox.top
        Vector.mouseClick(x, y)
    }

    if (e.type == "pointerdown" && document.elementFromPoint(e.clientX, e.clientY).tagName == 'CANVAS' && mode == "select") {
        const canvas = Vector.renderer.getCanvas()
        const boundingBox = canvas.getBoundingClientRect()
        const x = e.clientX - boundingBox.left
        const y = e.clientY - boundingBox.top

        const newSelect = Vector.getFromPoint(new Point(x, y))
        if (newSelect != Vector.selected) {
            Vector.selected?.toggleSelect()
        }
        newSelect?.toggleSelect()
    }

    if (e.type == "change" && e.target.id == "align-origin") {
        Vector.toggleAlign()
    }

    if (e.type == "change" && e.target.id == "mode-select") {
        mode = e.target.value
    }

    if (e.type == "keypress" && (e.key == 'd' || e.key == 'D')) {
        Vector.selected?.destruct()
    }
}

window.addEventListener("load", function () {
    renderer = new Renderer()
    Vector.renderer = renderer
    new Grid(renderer)
    document.addEventListener("pointerdown", handleEvent)
    this.document.addEventListener("keypress", handleEvent)
    this.document.getElementById("align-origin").addEventListener("change", handleEvent)
    this.document.getElementById("mode-select").addEventListener("change", handleEvent)

    let toolbox = this.document.querySelector(".toolbox")
    let toolMenu = this.document.querySelector(".toolmenu")
    toolbox.addEventListener("click", function () {
        toolMenu.classList.toggle("opened")
        toolMenu.classList.toggle("closed")
    })
})