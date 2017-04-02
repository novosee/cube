var accelorationBall = function (p) {
    var balls = [];

    var threshold = 30;
    var accChangeX = 0;
    var accChangeY = 0;
    var accChangeT = 0;

    p.setup = function () {
        p.createCanvas(p.displayWidth, p.displayHeight);
        //frameRate(20);
        for (var i = 0; i < 20; i++) {
            balls.push(new Ball());
        }
    }

    p.mousePressed = function () {
        p.fullscreen(true);
    }

    p.draw = function () {
        p.background(0);

        for (var i = 0; i < balls.length; i++) {
            balls[i].move();
            balls[i].display();
        }

        checkForShake();
    }

    // Ball class
    function Ball() {
        this.x = p.random(p.width);
        this.y = p.random(p.height);
        this.diameter = p.random(10, 30);
        this.xspeed = p.random(-2, 2);
        this.yspeed = p.random(-2, 2);
        this.oxspeed = this.xspeed;
        this.oyspeed = this.yspeed;
        this.direction = 0.7;

        this.move = function () {
            this.x += this.xspeed * this.direction;
            this.y += this.yspeed * this.direction;
        };

        // Bounce when touch the edge of the canvas  
        this.turn = function () {
            if (this.x < 0) {
                this.x = 0;
                this.direction = -this.direction;
            }
            else if (this.y < 0) {
                this.y = 0;
                this.direction = -this.direction;
            }
            else if (this.x > p.width - 20) {
                this.x = p.width - 20;
                this.direction = -this.direction;
            }
            else if (this.y > p.height - 20) {
                this.y = p.height - 20;
                this.direction = -this.direction;
            }
        };

        // Add to xspeed and yspeed based on 
        // the change in accelerationX value
        this.shake = function () {
            this.xspeed += random(5, accChangeX / 3);
            this.yspeed += random(5, accChangeX / 3);
        };

        // Gradually slows down 
        this.stopShake = function () {
            if (this.xspeed > this.oxspeed) {
                this.xspeed -= 0.6;
            }
            else {
                this.xspeed = this.oxspeed;
            }
            if (this.yspeed > this.oyspeed) {
                this.yspeed -= 0.6;
            }
            else {
                this.yspeed = this.oyspeed;
            }
        };

        this.display = function () {
            p.ellipse(this.x, this.y, this.diameter, this.diameter);
        };
    }

    function checkForShake() {
        // Calculate total change in accelerationX and accelerationY
        accChangeX = p.abs(p.accelerationX - p.pAccelerationX);
        accChangeY = p.abs(p.accelerationY - p.pAccelerationY);
        accChangeT = p.accChangeX + p.accChangeY;
        // If shake
        if (accChangeT >= threshold) {
            for (var i = 0; i < balls.length; i++) {
                balls[i].shake();
                balls[i].turn();
            }
        }
        // If not shake
        else {
            for (var i = 0; i < balls.length; i++) {
                balls[i].stopShake();
                balls[i].turn();
                balls[i].move();
            }
        }
    }
}








var a = function (p) {

    var x = 100;
    var y = 100;

    p.setup = function () {
        var cI = p.createCanvas(700, 410);

    };
    var i = 0;
    p.draw = function () {
        console.log("a");
        p.background(100);
        p.fill(255);
        p.rect(x, y, i - 500 * Math.floor((i++) / 500), 50);
    };
};

var b = function (p) {

    var x = 0;
    var y = 0;

    p.setup = function () {
        var cI = p.createCanvas(700, 410);
    };
    var i = 0;
    p.draw = function () {
        console.log("b");
        p.background(100);
        p.fill(0);
        p.rect(x, y, 30, i - 300 * Math.floor((i++) / 300));
    };
};
var ap5 = null;
var idx = 0;

var example2 = new Vue({
    el: '#example-2',
    data: {
        name: 'Vue.js'
    },
    // define methods under the `methods` object
    methods: {

        greet: function (event) {
            if (ap5) {
                ap5.remove();
            }
            if (idx == 0) {
                ap5 = new p5(accelorationBall);
                idx = 1;
            } else {
                ap5 = new p5(b);
                idx = 0;
            }

        }
    }
})


//var ap5 = new p5(a, "aContainer");
//var byp5 = new p5(b, "bContainer");