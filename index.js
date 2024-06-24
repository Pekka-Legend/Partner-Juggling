const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1000
canvas.height = 600

var spriteSheet = new Image()
spriteSheet.src = "spritesheet.png"

var keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    up: false,
    down: false,
    left: false,
    right: false
}

var leftTouches = 0
var rightTouches = 0
var maxTouches = 2

var mousepos = {
    x: 0,
    y: 0,
}
var mousedown = false

var menu = 0

var colorList = ["Black", "Red", "Blue", "Green", "Orange", 'Purple', "Aqua", "Pink", "Lime"]
let leftColor = 0
let rightColor = 0

//shoe size is 45 x 20 Shoe 1: ((9, 31), (54, 51))    Shoe 2: ((74, 31), (119, 51))
class Cleat
{
    constructor(foot)
    {
        this.xVel = 0
        this.yVel = 0
        this.maxVel = 20
        this.foot = foot
        if (this.foot == 0)
        {
            this.x = 200
            this.y = 500
        }
        if (this.foot == 1)
        {
            this.x = 710
            this.y = 500
        }
        this.sizeFactor = 2
    }
    draw()
    {
        //feet are 65 pixels away from each other in the spritesheet
        if (this.foot == 0)
        {
            this.color = leftColor
        }
        if (this.foot == 1)
        {
            this.color = rightColor
        }
        c.drawImage(spriteSheet, 9 + 66 * this.foot, 31 + this.color * 64, 45, 22, this.x, this.y, 45 * this.sizeFactor, 20 * this.sizeFactor)
    }
    update()
    {
        if (this.foot == 0)
        {
            if (keys.w == true)
            {
                this.yVel -= 1
            }
            if (keys.s == true)
            {
                this.yVel += 1
            }
            if (keys.a == true)
            {
                this.xVel -= 1
            }
            if (keys.d == true)
            {
                this.xVel += 1
            }
            if (keys.w == false && keys.s == false)
            {
                this.yVel *= .95
            }
            if (keys.a == false && keys.d == false)
            {
                this.xVel *= .95
            }
        }
        else if (this.foot == 1)
        {
            if (keys.up == true)
            {
                this.yVel -= 1
            }
            if (keys.down == true)
            {
                this.yVel += 1
            }
            if (keys.left == true)
            {
                this.xVel -= 1
            }
            if (keys.right == true)
            {
                this.xVel += 1
            }
            if (keys.up == false && keys.down == false)
            {
                this.yVel *= .95
            }
            if (keys.left == false && keys.right == false)
            {
                this.xVel *= .95
            }
        }
        this.x += this.xVel * dt * 10
        this.y += this.yVel * dt * 10

        if (this.foot == 0)
        {
            if (this.x < 0)
            {
                this.x = 0
                this.xVel = 0
            }
            if (this.x + (45 * this.sizeFactor) > 500)
            {
                this.x = 500 - (45 * this.sizeFactor)
                this.xVel = 0
            }
            if (this.y + (19 * this.sizeFactor) > 600)
            {
                this.y = 600 - (19 * this.sizeFactor)
                this.yVel = 0
            }
            if (this.y + (19 * this.sizeFactor) < 400)
            {
                this.y = 400 - (19 * this.sizeFactor)
                this.yVel = 0
            }
        }

        if (this.foot == 1)
        {
            if (this.x < 500)
            {
                this.x = 500
                this.xVel = 0
            }
            if (this.x + (45 * this.sizeFactor) > 1000)
            {
                this.x = 1000 - (45 * this.sizeFactor)
                this.xVel = 0
            }
            if (this.y + (19 * this.sizeFactor) > 600)
            {
                this.y = 600 - (19 * this.sizeFactor)
                this.yVel = 0
            }
            if (this.y + (19 * this.sizeFactor) < 400)
            {
                this.y = 400 - (19 * this.sizeFactor)
                this.yVel = 0
            }
        }

        let collisionX = this.x + ((45 * this.sizeFactor) / 2)
        let collisionY = this.y + ((22 * this.sizeFactor) / 2)
        //ball collisions
        let distToBall = Math.sqrt(Math.pow(collisionX - ball.x, 2) + Math.pow(collisionY - ball.y, 2))
        if (distToBall < 70)
        {
            //ball.y -= ball.yVel
            
            if (framesNotTouching > 10)
            {
                ball.yVel = -ball.yVel * .99 + this.yVel
                ball.xVel = ball.x - collisionX + this.xVel
                touches++
                framesNotTouching = 0
                if (this.foot == 0)
                {
                    leftTouches++
                    rightTouches = 0
                    if (leftTouches > maxTouches)
                    {
                        endGame()
                    }
                }
                if (this.foot == 1)
                {
                    rightTouches++
                    leftTouches = 0
                    if (rightTouches > maxTouches)
                    {
                        endGame()
                    }
                }
            }
            framesNotTouching = 0
        }
        else
        {
            framesNotTouching++
        }
    }
}

class Ball
{
    constructor()
    {
        this.x = 500
        this.y = 50
        this.launchDir = Math.round(Math.random())
        if (this.launchDir == 0)
        {
            this.xVel = 40
        }
        else
        {
            this.xVel = -40
        }
        
        this.yVel = 0
    }
    draw()
    {
        if (this.y > 0)
        {
            c.drawImage(spriteSheet, 128, 0, 64, 64, this.x - 32, this.y - 32, 64, 64)
        }
        else
        {
            c.fillStyle = 'black'
            c.beginPath()
            c.arc(this.x, 0, 32, 0, 6.28)
            c.fill()
        }
        
    }
    update()
    {
        if (startTime > 0)
        {
            startTime-= dt
        }
        else
        {
            this.yVel += 1
            this.x += this.xVel * dt * 5
            this.y += this.yVel * dt * 5
            if (this.x < 32)
            {
                this.x = 32
                this.xVel = -this.xVel
            }
            if (this.x > 1000 - 32)
            {
                this.x = 1000 - 32
                this.xVel = -this.xVel
            }
            if (ball.y > 600)
            {
                endGame()
            }
        }
    }
}
class Button
{
    constructor(x, y, width, height, text, color, hoverColor, fontColor, img = null)
    {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.text = text
        this.defaultColor = color
        this.fontColor = fontColor
        this.hoverColor = hoverColor
        this.color = this.defaultColor
        this.img = img * 64 //delete this if I want to use something that doesn't have an offset of 64

        this.fontSize = this.findBestTextSize()
    }
    findBestTextSize()
    {
        let fontSize = 250
        c.font = fontSize.toString() + "px Arial"
        let textSize = c.measureText(this.text)
        while (textSize.width >= this.width - 10 || (textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent) >= this.height - 10)
        {
            fontSize--
            c.font = fontSize.toString() + "px Arial"
            textSize = c.measureText(this.text)
        }
        return fontSize
    }
    draw()
    {
        c.fillStyle = this.color
        c.fillRect(this.x, this.y, this.width, this.height)
        
        if (this.fontColor == "")
        {
            this.fontColor = 'black'
        }
        if (this.text == "Night")
        {
            this.fontColor = "white"
        }
        if (this.text != "")
        {
            c.fillStyle = this.fontColor
            if (this.height == this.width)
            {
                c.font = this.fontSize / 1 + "px Arial"
            }
            else
            {
                c.font = this.fontSize / 1.5 + "px Arial"
            }
            if (this.fontSize < 18)
            {
                this.fontSize = 15
            }
            let textSize = c.measureText(this.text)
            let textHeight = textSize.actualBoundingBoxAscent - textSize.actualBoundingBoxDescent
            c.fillText(this.text, this.x + (this.width / 2) - (textSize.width / 2), this.y + (this.height / 2) + (textHeight / 2), this.width, this.height)
        }
        else
        {
            c.drawImage(spriteSheet, this.img + 1, 0, 62, 64, this.x + this.width / 10, this.y + this.height / 10, this.width - this.width / 5, this.height - this.height / 5)
        }
    }
    isClicked()
    {
        if (mousepos.x >= this.x && mousepos.x <= this.x + this.width && mousepos.y >= this.y && mousepos.y <= this.y + this.height)
        {
            this.color = this.hoverColor
            if (mousedown)
            {
                mousedown = false
                return true
            }
            
        }
        else
        {
            this.color = this.defaultColor
        }
        return false
    }
    changeText(newText)
    {
        this.text = newText
    }
}

function endGame()
{
    lives--
    ball = new Ball()
    cleat1 = new Cleat(0)
    cleat2 = new Cleat(1)
    rightTouches = 0
    leftTouches = 0
    if (lives < 0)
    {
        menu = 0
    }
}

var dt = 0
var lt = Date.now()
var ct = Date.now()
var cleat1 = new Cleat(0)
var cleat2 = new Cleat(1)
var ball = new Ball()
var end = false

var touches = 0
var framesNotTouching = 0
var lives = 3
var startTime = 3

maxTouchesButton = new Button(20, canvas.height - canvas.height / 4, 300, 100, "Set Max Touches", "blue", "darkblue", "white")
playButton = new Button(canvas.width - 320, canvas.height - canvas.height / 4, 300, 100, "  Play  ", "blue", "darkblue", "white")
leftColorButton = new Button(canvas.width / 3 - 100, canvas.height / 2 - 50, 200, 100, colorList[leftColor], 'blue', 'darkblue', 'white')
rightColorButton = new Button(canvas.width - canvas.width / 3 - 100, canvas.height / 2 - 50, 200, 100, colorList[rightColor], 'blue', 'darkblue', 'white')


function animate()
{
    requestAnimationFrame(animate)
    if (!end)
    {
        if (menu == 0)
        {
            c.clearRect(0, 0, canvas.width, canvas.height)
            c.fillStyle = 'skyblue'
            c.fillRect(0, 0, canvas.width, 400)
            c.fillStyle = 'green'
            c.fillRect(0, 400, canvas.width, 200)
            c.fillStyle = "black"

            c.fillStyle = 'black'
            c.font = "60px Arial"
            c.fillText("Max Touches: " + maxTouches.toString(), canvas.width / 64, 60)
            c.fillText("Score : " + touches.toString(), canvas.width / 64, 120)


            leftColorButton.draw()
            if (leftColorButton.isClicked())
            {
                leftColor++
                if (leftColor > colorList.length - 1)
                {
                    leftColor = 0
                }
                leftColorButton.text = colorList[leftColor]
            }
            rightColorButton.draw()
            if (rightColorButton.isClicked())
            {
                rightColor++
                if (rightColor > colorList.length - 1)
                {
                    rightColor = 0
                }
                rightColorButton.text = colorList[rightColor]
            }
            maxTouchesButton.draw()
            if (maxTouchesButton.isClicked())
            {
                maxTouches = parseInt(prompt("Enter the maximum number of touches you would like to have (1-10): "))
                if (isNaN(maxTouches))
                {
                    maxTouches = 2
                }
                else if (maxTouches < 1)
                {
                    maxTouches = 1
                }
                else if (maxTouches > 10)
                {
                    maxTouches = 10
                }
            }
            playButton.draw()
            if (playButton.isClicked())
            {
                endGame()
                lives = 3 //because it subtracts a life
                menu = 1
            }
        }
        else if (menu == 1)
        {
            lt = ct
            ct = Date.now()
            dt = (ct - lt) / 1000
            c.clearRect(0, 0, canvas.width, canvas.height)
            c.fillStyle = 'skyblue'
            c.fillRect(0, 0, canvas.width, 400)
            c.fillStyle = 'green'
            c.fillRect(0, 400, canvas.width, 200)
            c.fillStyle = "black"
            c.fillRect(499, 0, 2, 600)
        
            c.font = '80px Arial'
            c.fillStyle = 'black'
            let measure = c.measureText(leftTouches.toString())
            let h = measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent
            c.fillText(leftTouches.toString(), 250 - measure.width / 2, 300 - h / 2)

            measure = c.measureText(rightTouches.toString())
            h = measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent
            c.fillText(rightTouches.toString(), 750 - measure.width / 2, 300 - h / 2)

            c.fillStyle = 'black'
            c.font = "60px Arial"
            c.fillText(touches.toString(), canvas.width / 64, 60)
            c.fillText("Lives: " + lives.toString(), canvas.width / 64, 120)

            measure = c.measureText("Max: " + maxTouches.toString())
            c.fillText("Max: " + maxTouches.toString(), canvas.width - canvas.width / 64 - measure.width, 60)


            ball.update()
            ball.draw()

            cleat1.update()
            cleat1.draw()
        
            cleat2.update()
            cleat2.draw()
            
        }
    }
}
animate()

document.onkeydown = function(e)
{
    if (e.key == "w")
    {
        keys.w = true
    }
    if (e.key == "s")
    {
        keys.s = true
    }
    if (e.key == "a")
    {
        keys.a = true
    }
    if (e.key == "d")
    {
        keys.d = true
    }
    if (e.key == "ArrowUp")
    {
        keys.up = true
    }
    if (e.key == "ArrowDown")
    {
        keys.down = true
    }
    if (e.key == "ArrowLeft")
    {
        keys.left = true
    }
    if (e.key == "ArrowRight")
    {
        keys.right = true
    }
}

document.onkeyup = function(e)
{
    if (e.key == "w")
    {
        keys.w = false
    }
    if (e.key == "s")
    {
        keys.s = false
    }
    if (e.key == "a")
    {
        keys.a = false
    }
    if (e.key == "d")
    {
        keys.d = false
    }


    if (e.key == "ArrowUp")
    {
        keys.up = false
    }
    if (e.key == "ArrowDown")
    {
        keys.down = false
    }
    if (e.key == "ArrowLeft")
    {
        keys.left = false
    }
    if (e.key == "ArrowRight")
    {
        keys.right = false
    }
}

document.onmousemove = function(e)
{
    mousepos.x = e.offsetX
    mousepos.y = e.offsetY
}
document.onmousedown = function(e)
{
    mousedown = true
}
document.onmouseup = function(e)
{
    mousedown = false
}