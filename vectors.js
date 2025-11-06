import { Grid } from "./engine/grid.js"
import { Renderer } from "./engine/renderer.js"
import { Vector, VectorInert } from "./engine/vector.js"
import { Point } from "./engine/point.js"
import { Addition } from "./engine/addition.js"
import { Subtraction } from "./engine/subtraction.js"
import { Basis } from "./engine/basis.js"

let renderer
let mode = "create"
let operation = "addition"
let status = 0
let addition
let subtraction
let basis = [
    [0, 1],
    [1, 0]
]

let targetbasis = [
    [0, 1],
    [1, 0]
]

let animate_transform = false


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

        if (operation == "subtraction" && status < 2) {
            subtraction.addParameter(newSelect)
            status += 1
        }
        else if (operation == "subtraction" && status == 2) {
            subtraction.placeVector(new Point(x, y))
            status = 0
        }

        if (status == 2) {
            Vector.forceAlign(false)
            document.getElementById("align-origin").setAttribute("disabled", true)
            document.getElementById("align-origin").checked = false

        }

        if (status != 2) {
            document.getElementById("align-origin").removeAttribute("disabled")
        }

        if (operation == "deletion") {
            newSelect.destruct()
        }
    }

    if (e.type == "pointermove") {
        const canvas = Vector.renderer.getCanvas()
        const boundingBox = canvas.getBoundingClientRect()
        const x = e.clientX - boundingBox.left
        const y = e.clientY - boundingBox.top

        if (status == 2 && operation == "addition") {
            addition.attemptPlace(new Point(x, y))
        }

        if (status == 2 && operation == "subtraction") {
            subtraction.attemptPlace(new Point(x, y))
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
        status = 0
        addition.reset()
        subtraction.reset()
    }

    if (e.type == "change" && e.target.classList.contains("transform-digit")) {
        let x = e.target.getAttribute("data-coordinate").split(",")[0]
        let y = e.target.getAttribute("data-coordinate").split(",")[1]

        //We always update targetbasis, but basis is only updated directly when we are not animating
        if (!animate_transform) {
            basis[x][y] = parseInt(e.target.value)
        }

        targetbasis[x][y] = parseInt(e.target.value)

        const basisObject = new Basis(new VectorInert(new Point(0, 0), new Point(basis[0][0], basis[1][0])), new VectorInert(new Point(0, 0), new Point(basis[0][1], basis[1][1])))
        Vector.updateBasis(basisObject)
    }

    if (e.type == "click" && e.target.id == "reset-identity-button") {
        document.querySelectorAll(".identity-zero-start").forEach(function (element, _, _2)  {
            element.value = "0"
            element.dispatchEvent(new Event('change', { bubbles: true }));
        })

        document.querySelectorAll(".identity-one-start").forEach(function (element, _, _2)  {
            element.value = "1"
            element.dispatchEvent(new Event('change', { bubbles: true }));
        })
    }

    if (e.type == "click" && e.target.id == "animate-transform-input") {
        animate_transform = !animate_transform
    }

}

function animateBasis() {
    if (!animate_transform) return

    for (let i = 0; i < targetbasis.length; i++) {
        for (let j = 0; j < targetbasis[0].length; j++) {
            if (Math.abs(targetbasis[i][j] - basis[i][j]) > 0.1) {

                const delta = targetbasis[i][j] - basis[i][j];
                basis[i][j] += delta / 60.0;
                if (Math.abs(delta) <= 0.11) {
                    basis[i][j] = targetbasis[i][j]
                }
            }
        }
    }

    const basisObject = new Basis(new VectorInert(new Point(0, 0), new Point(basis[0][0], basis[1][0])), new VectorInert(new Point(0, 0), new Point(basis[0][1], basis[1][1])))
    Vector.updateBasis(basisObject)
}

window.addEventListener("load", function () {
    renderer = new Renderer()
    Vector.renderer = renderer
    new Grid(renderer)

    addition = new Addition(renderer)
    subtraction = new Subtraction(renderer)

    document.addEventListener("pointerdown", handleEvent)
    this.document.addEventListener("pointermove", handleEvent)
    this.document.getElementById("align-origin").addEventListener("change", handleEvent)
    this.document.getElementById("mode-select").addEventListener("change", handleEvent)
    this.document.getElementById("operation-select").addEventListener("change", handleEvent)
    this.document.getElementById("reset-identity-button").addEventListener("click", handleEvent)
    this.document.getElementById("animate-transform-input").addEventListener("click", handleEvent)
    this.setInterval(animateBasis, 1000/60)

    this.document.querySelectorAll(".transform-digit").forEach(function (element, key, parent) {
        element.addEventListener("change", handleEvent)
    })

    let toolbox = this.document.querySelector(".toolbox")
    let toolMenu = this.document.querySelector(".toolmenu")
    toolbox.addEventListener("click", function () {
        toolMenu.classList.toggle("opened")
        toolMenu.classList.toggle("closed")
    })
})