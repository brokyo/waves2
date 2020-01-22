// schedule event
// lights[i].iteratorStep = 1 / (30 * attackTime)
// lights[i].startColor = startColor
// lights[i].endColor = endColor


var lights = [
  {
    id: 0,
    iterator: 0,
    iteratorStep: 0.016,
    changing: true,
    startColor: color('#ff0000'),
    endColor: color('#0000ff'),
    currentColor: color('#000000')
  },
  {
    id: 1,
    iterator: 0,
    iteratorStep: 0.016,
    changing: false,
    startColor: color('#00ff00'),
    endColor: color('#0ff000'),
    currentColor: color('#000000')
  }
]

var tempColor

function setup() {
  createCanvas(400, 400);
  frameRate(30)
}
  
function draw(){
  lights.forEach(light => {
    if(light.changing) {
     light.currentColor = lerpColor(light.startColor, light.endColor, light.iterator)
     
     light.iterator += light.iteratorStep
    }
    
    if(light.iterator > 1) {
      light.changing = false
      light.iterator = 0
    }
  })
  
  let backgroundColor = lerpColor(lights[0].currentColor, lights[1].currentColor, 0.5)
  background(backgroundColor)
}
