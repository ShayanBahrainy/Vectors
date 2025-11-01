import { Grid } from "./engine/grid.js"
import { Renderer } from "./engine/renderer.js"
import { Vector } from "./engine/vector.js"
import { Point } from "./engine/point.js"
import { Addition } from "./engine/addition.js"

let renderer
let mode = "create"
let operation = "none"
let status = 0
let addition


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

        if (operation == "addition" && status < 2) {
            addition.addParameter(newSelect)
            status += 1
        }
        else if (operation == "addition" && status == 2) {
            addition.placeVector(new Point(x, y))
            status = 0
        }
        if (status == 2) {
            Vector.forceAlign(false)
            document.getElementById("align-origin").setAttribute("disabled", true)

        }

        if (status != 2) {
            document.getElementById("align-origin").removeAttribute("disabled")
        }
    }

        const canvas = Vector.renderer.getCanvas()
        const boundingBox = canvas.getBoundingClientRect()
        const x = e.clientX - boundingBox.left
        const y = e.clientY - boundingBox.top

        if (status == 2) {
            addition.attemptPlace(new Point(x, y))
        }
    }

    if (e.type == "change" && e.target.id == "align-origin") {
        Vector.toggleAlign()
    }

    if (e.type == "change" && e.target.id == "mode-select") {
        mode = e.target.value
    }

    if (e.type == "change" && e.target.id == "operation-select") {
        operation = e.target.value
    }

    if (e.type == "keypress" && (e.key == 'd' || e.key == 'D')) {
        Vector.selected?.destruct()
    }
}

window.addEventListener("load", function () {
    renderer = new Renderer()
    Vector.renderer = renderer
    new Grid(renderer)

    addition = new Addition(renderer)

    document.addEventListener("pointerdown", handleEvent)
    this.document.addEventListener("pointermove", handleEvent)
    this.document.addEventListener("keypress", handleEvent)
    this.document.getElementById("align-origin").addEventListener("change", handleEvent)
    this.document.getElementById("mode-select").addEventListener("change", handleEvent)
    this.document.getElementById("operation-select").addEventListener("change", handleEvent)

    let toolbox = this.document.querySelector(".toolbox")
    let toolMenu = this.document.querySelector(".toolmenu")
    toolbox.addEventListener("click", function () {
        toolMenu.classList.toggle("opened")
        toolMenu.classList.toggle("closed")
    })
})