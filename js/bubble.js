class Bubble {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.radius = 60;
        this.bounds = {
            min : {
                x : 0,
                y : 0
            },
            max : {
                x : canvasWidth,
                y : canvasHeight
            }
        }
        this.xV = 0;
        this.yV = 0;
        this.type = type;
        this.mode = "normal";
        this.ballHit = false;
    }

    move(){

        if(this.type == "static") {
            // return;
        }

        if(this.mode == "inside") {
            this.xV = ship.xV;
            this.yV = ship.yV;
        }

        this.x += this.xV;
        this.y += this.yV;

        if(this.x > this.bounds.max.x || this.x < this.bounds.min.x) {
            this.xV *= -1;
        }

        if(this.y > this.bounds.max.y || this.y < this.bounds.min.y) {
            this.yV *= -1;
        }

        this.xV *= .99;
        this.yV *= .99;

    }

    checkCollision(){
        let threshold = 10;
        let distance = Math.sqrt(Math.pow(this.x - ship.x, 2) + Math.pow(this.y - ship.y - ship.height/2, 2));

        if(this.mode == "normal") {
            if(distance < this.radius) {
                // this.mode = "collision";
            }
            if(distance < this.radius - 20) {
                this.mode = "inside";
            }
        } else if (this.mode == "inside") {
            if(distance > this.radius) {
                this.mode = "normal";
                this.xV *= 1.55;
                this.yV *= 1.55;
            }
        }

        if(this.type === "dynamic" && this.ballHit === false ) {
            
            for(var i = 0; i < bubbles.length; i++) {

                let secondBall = bubbles[i];
                let distance = Math.sqrt(Math.pow(this.x - secondBall.x, 2) + Math.pow(this.y - secondBall.y, 2));


                if(distance < this.radius + secondBall.radius) {

                    this.ballHit = true;
                    secondBall.ballhit = true;

                    let normal = {
                        x : secondBall.x - this.x,
                        y : secondBall.y - this.y
                    }

                    let dotP = dotProduct(this.xV, this.yV, normal.x, normal.y) / dotProduct(normal.x, normal.y, normal.x, normal.y);
                    let projection = scaleVector(normal, 2 * dotP);
                    let projectiontwo = scaleVector(normal, -1 * dotP);

                    // TODO - put this back
                    // this.xV = this.xV - projection.x;
                    // this.yV = this.yV - projection.y;

                    // secondBall.xV = secondBall.xV - projectiontwo.x;
                    // secondBall.yV = secondBall.yV - projectiontwo.y;

                    console.log(secondBall.x)

                    let overlap = Math.abs(this.radius + secondBall.radius - distance);
                    let overlapPercent = overlap / (this.radius + secondBall.radius);
                    // console.log(overlapPercent);

                    if(overlapPercent < 1) {

                        // let dX = (this.x - secondBall.x) * overlapPercent;
                        // let dY = (this.y - secondBall.y) * overlapPercent;


                        // this.x += dX;
                        // secondBall.x -= dX;

                        // this.y += dY;
                        // secondBall.y -= dY;

                    }
            }


            }
        }

        // }


        //  = project the movement vector onto the normal vector
        // resulting vector = original vector - 2 * (v dot n ) * n

        // projection = ((v dot n / n dot n) * n )
        // projection = 

    }

    draw() {

        this.checkCollision();
        this.move();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, Math.PI * 2, 0);
        ctx.fillStyle = "rgba(255,255,255,.4)";
        ctx.fill();
        ctx.closePath();


        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0);

        if(this.mode === "normal") {
            ctx.strokeStyle = "rgba(255,255,255,.4)";
        }

        if(this.mode === "inside") {
            ctx.strokeStyle = "rgba(0,255,0,.4)";
        }

        if(this.mode == "collision") {
            ctx.strokeStyle = "rgba(255,0,0,.6)";
        }

        if(this.ballHit) {
                        ctx.strokeStyle = "rgba(255,0,0,.6)";
        }


        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
    }
}

const dotProduct = (x1, y1, x2, y2) => {
  return x1 * x2 + y1 * y2;
}

const scaleVector = (vector, scalar) => {
    let newVector = {};
    newVector.x = vector.x * scalar;
    newVector.y = vector.y * scalar;
    return newVector;
}