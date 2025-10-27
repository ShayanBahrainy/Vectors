import { Point } from "./point.js"

export const Renderer = class {
    static width = 1280
    static height = 720
    static FPS = 60
  constructor() {
    this.objects = new Array()
    this.message = null
    this.fps = Renderer.FPS
    Renderer.instance = this
    this.canvas = document.createElement("canvas")
    document.body.appendChild(this.canvas)
    this.tick = this.tick.bind(this)
    this.collisionChecks = this.collisionChecks.bind(this)
    this.calculateSpatialMap = this.calculateSpatialMap.bind(this)
    this.intervalId = setInterval(this.tick,Math.round(1000/this.fps))
  }

  getRenderables() {
    let renderObjects = []
    for (let object of this.objects) {
        if (object.shape != null) {
            renderObjects.push(object)
        }
        if (Object.hasOwn(object, "renderparts")) {
            renderObjects = renderObjects.concat(object.renderparts)
        }
    }
    renderObjects = Renderer.sortObjects(renderObjects)
    let data = []
    let dominant = {dominant: false}
    for (let object of renderObjects) {
        if (Object.hasOwn(object, "text")){
            let text = {type: "text", text: object.text, x: object.x, y: object.y + 20}
            if (object.isdominant) {
                dominant = text
                dominant.dominant = true
            }
            data.push(text)
        }
        let render = {}
        render.fillStyle = object.fillStyle
        render.x = object.x
        render.y = object.y
        if (object.shape == "rectangle"){
            render.type = "rectangle"
            render.width = object.width
            render.height = object.height
        }
        if (object.shape == "circle"){
            render.type = "circle"
            render.radius = object.radius
            render.angle = object.angle ? object.angle : 360
        }
        if (object.shape == "line") {
            render.type = "line"
            render.end = object.end
            render.width = object.width
        }
        if (object.shape == "polygon") {
            render.type = "polygon"
            render.apothem = object.apothem
            render.vertexes = object.vertexes
            if (Object.hasOwn(object, "rotation")) {
                render.rotation = object.rotation
            }
        }
        data.push(render)
        if (dominant.dominant) {
            return [dominant]
        }
    }
    return data
  }

  destruct() {
    clearInterval(this.intervalId)
  }


  tick() {
    this.canvas.width = document.documentElement.clientWidth
    this.canvas.height = document.documentElement.clientHeight
    this.collisionChecks()
    let renderObjects = Renderer.sortObjects(this.objects)
    for (let key in renderObjects) {
        let object = renderObjects[key]
        object.update(object)
    }
    this.draw(this.getRenderables())
  }
  calculateSpatialMap() {
    let SpatialMap = []
    for (let object of this.objects){
        let X = Math.floor(object.x/50)
        if (SpatialMap[X] == null) {
            SpatialMap[X] = []
        }
        let Y = Math.floor(object.y/50)
        if (SpatialMap[X][Y] == null) {
            SpatialMap[X][Y] = []
        }
        SpatialMap[X][Y].push(object)
    }
    return SpatialMap
  }
  narrowPhaseChecks(objects) {
    let cewidth
    let ceheight
    let crwidth
    let crheight
    for (let collidee in objects) {
        collidee = objects[collidee]
        if (collidee.shape == "rectangle"){
        cewidth = collidee.width
        ceheight = collidee.height
        }
        if (collidee.shape == "circle"){
        cewidth = collidee.radius * 2
        ceheight = collidee.radius * 2
        }
        if (collidee.shape == "polygon") {
            cewidth = collidee.apothem * 2
            ceheight = collidee.apothem * 2
        }
        for (let collider in objects) {
            collider = objects[collider]
            if (collidee == collider) {
                continue
            }
            if (collider.shape == "rectangle"){
            crwidth = collider.width
            crheight = collider.height
            }
            if (collider.shape == "circle"){
            crwidth = collider.radius * 2
            crheight = collider.radius * 2 //Radius is already the half "width" so multiply by two
            }
            if (collider.shape == "polygon") {
                crwidth = collider.apothem * 2
                crheight = collider.apothem * 2
            }
            //Implementation of Separating Axis Theorem
            let AverageXCollidee = (collidee.x + collidee.x + cewidth)/2
            let AverageXCollider = (collider.x + collider.x + crwidth)/2
            let AverageYCollidee = (collidee.y + collidee.y + ceheight)/2
            let AverageYCollider = (collider.y + collider.y + crheight)/2

            let HorizontonalLength  = Math.abs(AverageXCollidee - AverageXCollider)
            let VerticalLength = Math.abs(AverageYCollidee - AverageYCollider)

            HorizontonalLength -= (cewidth + crwidth)/2
            VerticalLength -= (ceheight + crheight)/2

            if (HorizontonalLength <= 0 && VerticalLength <= 0) {
                collider.collision(collider,collidee)
            }
        }
    }
  }
  collisionChecks() {
    //Our spatial maps are 2d arrays where first dimension is x, second is y, and the values are arrays of objects at that coordinate
    //Spatial Map = [[[Object1], [Object2]], [[Object3], [Object4,Object5]]
    let SpatialMap = this.calculateSpatialMap()
    for (let Ys of SpatialMap) {
        if (!Ys) {
            continue
        }
        for (let Y of Ys) {
            this.narrowPhaseChecks(Y)
        }
    }
  }

  draw(renderData) {
    let ctx = this.canvas.getContext("2d")
    for (let object of renderData) {
        switch (object.type) {
            case "text":
                context.font = "18px Times New Roman"
                context.textAlign = "center"
                context.textBaseline = "middle"
                context.fillStyle = "#8aea92"
                context.fillText(object.text,object.x,object.y)
                break;
            case "rectangle":
                ctx.fillStyle = object.fillStyle
                ctx.rect(object.x, object.y, object.width, object.height)
                break;
            case "circle":
                ctx.fillStyle = object.fillStyle
                ctx.beginPath()
                ctx.arc(object.x, object.y, object.radius, object.angle)
                ctx.closePath()
                ctx.fill()
                break;
            case "polygon":
                ctx.fillStyle = object.fillStyle
                this.drawConvex(ctx, object.vertexes, object.apothem, object.x, object.y, object.rotation)
                break;
            case "line":
                ctx.beginPath()
                ctx.strokeStyle = object.fillStyle
                ctx.lineWidth = object.width
                ctx.moveTo(object.x, object.y)
                ctx.lineTo(object.end.x, object.end.y)
                ctx.stroke()
                break;
        }
    }
  }

  getCanvas() {
    return this.canvas
  }
  getObjects() {
    return this.objects
  }
  removeObject(self, object){
    var index = self.objects.indexOf(object)
    if (index != -1){
        self.objects.splice(index,1)
    }
  }

  static calculatePoints(vertexQuantity, apothemLength, X, Y, rotation) {
    //Circle equation: (x-X)^2 + (y-Y)^2 = apothemLength^2
    //Point on path of circle: x = r * sin(rotation), y = r * cos(rotation)
    //Rotation = 360/vertexQuantity
    let Points = []
    const RotationIncrements = 360/vertexQuantity
    let StartingOffset = Math.PI/vertexQuantity
    if (rotation) {
        StartingOffset += rotation * Math.PI/180
    }
    let currentRotation = 0
    while (currentRotation < 360) {
        let x = apothemLength * Math.cos((currentRotation * Math.PI/180) + StartingOffset) + X
        let y = apothemLength * Math.sin((currentRotation * Math.PI/180) + StartingOffset) + Y
        Points.push(new Point(x,y))
        currentRotation += RotationIncrements
    }
    return Points
  }

  drawConvex (context, vertexes, apothem, x, y, rotation) {
    let points = Renderer.calculatePoints(vertexes, apothem, x, y, rotation)
    context.beginPath()
    context.moveTo(points[0].x,points[0].y)
    for (let point of points.toSpliced(0,1)) {
        context.lineTo(point.x,point.y)
    }
    context.lineTo(points[0].x,points[0].y)
    context.fill()
    context.closePath()
  }



  addObject(object){
    this.objects.push(object)
  }
  static sortObjects(objects) {
      let sorted = []
      for (let object of objects) {
          let priority = object.priority
          let isSlotEmpty = sorted[priority] == null
          while (!isSlotEmpty) {
              priority++;
              isSlotEmpty = sorted[priority] == null
          }
          sorted[priority] = object
      }
      return sorted
  }
}