import { Renderer } from "./engine/renderer.js"
import { Vector } from "./engine/vector.js"

let renderer


window.addEventListener("load", function () {
    renderer = new Renderer()
    Vector.renderer = renderer
    document.addEventListener("pointerdown", Vector.handleEvent)
})