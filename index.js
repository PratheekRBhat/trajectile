const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')

const blockWidth = 100
const blockHeight = 20
const borderWidth = 560
const borderHeight = 500
const ballDiameter = 20
let xDirection = -2
let yDirection = 2

const userStart = [230, 10]
let currentUserPosition = userStart

const ballStart = [270, 30]
let currentBallPosition = ballStart

let level = 0

let timerID

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topLeft = [xAxis, yAxis + blockHeight]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
  }
}

const blocks = [
  new Block(10, 450),
  new Block(120, 450),
  new Block(230, 450),
  new Block(340, 450),
  new Block(450, 450),
  new Block(10, 420),
  new Block(120, 420),
  new Block(230, 420),
  new Block(340, 420),
  new Block(450, 420),
  new Block(10, 390),
  new Block(120, 390),
  new Block(230, 390),
  new Block(340, 390),
  new Block(450, 390),
  new Block(10, 360),
  new Block(120, 360),
  new Block(230, 360),
  new Block(340, 360),
  new Block(450, 360),
  new Block(10, 330),
  new Block(120, 330),
  new Block(230, 330),
  new Block(340, 330),
  new Block(450, 330),
  new Block(10, 300),
  new Block(120, 300),
  new Block(230, 300),
  new Block(340, 300),
  new Block(450, 300)
]

function addBlocks() {
  for (let i=0; i<blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'
    grid.appendChild(block)
  }
}

addBlocks()

const user = document.createElement('div')
user.classList.add('user')
positionUser()
grid.appendChild(user)

function positionUser() {
  user.style.left = currentUserPosition[0] + 'px'
  user.style.bottom = currentUserPosition[1] + 'px'
}

function positionBall() {
  ball.style.left = currentBallPosition[0] + 'px'
  ball.style.bottom = currentBallPosition[1] + 'px'
}

function moveUser(event) {
  switch(event.key) {
    case 'ArrowLeft':
      if (currentUserPosition[0] > 0) {
        currentUserPosition[0] -= 10
        positionUser()
      }
      break
    case 'ArrowRight': 
      if (currentUserPosition[0] < borderWidth - blockWidth) {
        currentUserPosition[0] += 10
        positionUser()
      }
      break
  }
} 
document.addEventListener('keydown', moveUser)

const ball = document.createElement('div')
ball.classList.add('ball')
positionBall()
grid.appendChild(ball)

function moveBall() {
  currentBallPosition[0] += xDirection
  currentBallPosition[1] += yDirection
  positionBall()
  collisionCheck()
}

timerID = setInterval(moveBall, 15)

function collisionCheck() {
  // block collision check
  for (let i=0; i < blocks.length; i++) {
    let block = blocks[i]
    if ((currentBallPosition[0] > block.bottomLeft[0]) && (currentBallPosition[0] < block.bottomRight[0]) && (currentBallPosition[1] + ballDiameter > block.bottomLeft[1]) && (currentBallPosition[1] < block.topLeft[1])) {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      playSound('block_destroy')
      allBlocks[i].classList.remove('block')
      blocks.splice(i, 1)
      scoreDisplay.innerText = "Score: " + ++level
      yDirection = -yDirection
    }
  }

  // user collision check
  if ((currentBallPosition[0] > currentUserPosition[0]) && (currentBallPosition[0] < currentUserPosition[0] + blockWidth) && (currentBallPosition[1] + ballDiameter > currentUserPosition[1]) && (currentBallPosition[1]) < currentUserPosition[1] + blockHeight ) {
    yDirection = -yDirection
    playSound('bounce')
  }

  // wall collision check
  if (currentBallPosition[0] >= (borderWidth - ballDiameter)) {
    xDirection = -xDirection
    playSound('bounce')
  }
  if (currentBallPosition[1] >= (borderHeight - ballDiameter)) {
    yDirection = -yDirection
    playSound('bounce')
  }
  if (currentBallPosition[0] <= 0) {
    xDirection = -xDirection
    playSound('bounce')
  }

  // game over check
  if (currentBallPosition[1] <= 0) {
    playSound('game_over')
    scoreDisplay.innerHTML = 'Game Over'
    clearInterval(timerID)
    document.removeEventListener('keydown', moveUser)
  }

  //game win check
  if (blocks.length === 0 ) {
    scoreDisplay.innerHTML = 'You Win'
    clearInterval(timerID)
    document.removeEventListener('keydown', moveUser)
  }
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".wav")
  audio.play()
}