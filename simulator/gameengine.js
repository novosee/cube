/**
 * initgameengine uses context.global.keyCode and senddata()
 */


function initgameengine(config) {

    const CONST = {
        GAME: 1,
        STAR: 2,
        BREATH: 3,
        BLACK: 0,
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
    };

    var cubeCore = {
        lights: [
            {
                x: 3, y: 1, z: 0
            },
            {
                x: 3, y: 2, z: 0
            },
            {
                x: 3, y: 3, z: 0
            },
            {
                x: 3, y: 4, z: 0
            },
            {
                x: 3, y: 5, z: 0
            },
            {
                x: 3, y: 5, z: 1
            },
            {
                x: 3, y: 5, z: 2
            },
            {
                x: 3, y: 5, z: 3
            },
            {
                x: 3, y: 5, z: 4
            },
            {
                x: 2, y: 2, z: 5
            },
            {
                x: 1, y: 4, z: 6
            },
            {
                x: 1, y: 0, z: 7
            },
            {
                x: 0, y: 2, z: 8
            },
            {
                x: 1, y: 4, z: 9
            },
            {
                x: 2, y: 0, z: 10
            },
            {
                x: 4, y: 0, z: 10
            },
            {
                x: 5, y: 4, z: 9
            },
            {
                x: 6, y: 2, z: 8
            },
            {
                x: 5, y: 0, z: 7
            },
            {
                x: 5, y: 4, z: 6
            },
            {
                x: 4, y: 2, z: 5
            }
        ],
        mode: CONST.STAR,
        count: 21,
    }

    function randomrgbcolor() {
        return (Math.floor(Math.random() * 255) + 1) * 256 * 256 + (Math.floor(Math.random() * 255) + 1) * 256 + (Math.floor(Math.random() * 255) + 1);
    }

    function Spirit(rgb) {
        this.rgb = rgb;
        this.index = 0;
        this.isforward = true;
        this.move = function () {
            if (this.isforward) {
                this.index++;
            } else {
                this.index--;
            }

            if ((this.index >= cubeCore.lights.length) || (this.index < 0)) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function initmode(mode) {
        cubeCore.lights.forEach(function (element) {

            element.rgb = 0;
            element.bright = 0;
            element.time = 10;
            element.timeCount = 10;
        }
        );
        cubeCore.mode = mode;
    }
    var spiritArray = [];

    function ondata() {

        switch (context.global.keyCode) {
            case CONST.LEFT_ARROW:

                if (cubeCore.mode != CONST.GAME) {
                    initmode(CONST.GAME);
                }
                spiritArray.push(new Spirit(randomrgbcolor()));
                spiritArray.forEach(function (spirit) {
                    spirit.isforward = true;
                });
                context.global.keyCode = 0;
                break;

            case CONST.RIGHT_ARROW:
                if (cubeCore.mode != CONST.GAME) {
                    initmode(CONST.GAME);
                }
                spiritArray.forEach(function (spirit) {
                    spirit.isforward = false;
                });
                context.global.keyCode = 0;
                break;

            case CONST.DOWN_ARROW:
                //cubeCore.mode = CONST.GAME;
                context.global.keyCode = 0;
                console.log('DOWN');
                break;
            default:

                break;
        }

        switch (cubeCore.mode) {
            case CONST.GAME:
                /*redraw init*/
                cubeCore.lights.forEach(function (element) {
                    if (!element.rgb) {
                        element.rgb = 1;
                    }
                    element.bright = 0;
                    element.time = 5;
                });
                /*new rgb*/
                spiritArray.forEach(function (spirit) {
                    cubeCore.lights[spirit.index
                    ].rgb = spirit.rgb;
                    cubeCore.lights[spirit.index
                    ].bright = 100;
                    cubeCore.lights[spirit.index
                    ].time = 5;
                });
                /*remove dead spirit*/
                spiritArray.forEach(function (spirit) {
                    if (spirit.move()) {
                        spiritArray.splice(spiritArray.indexOf(spirit),
                            1);
                    };
                });

                if (spiritArray.length == 0) {
                    initmode(CONST.BREATH);
                    cubeCore.count = 10;
                }

                break;
            case CONST.BREATH:

                cubeCore.lights.forEach(function (element) {
                    if (element.timeCount) {
                        element.timeCount = element.timeCount - 10;
                        element.rgb = -Math.abs(element.rgb);;
                    } else {
                        if (element.bright > 0) {
                            element.rgb = Math.abs(element.rgb);
                            element.bright = 0;
                        } else {
                            element.rgb = randomrgbcolor();
                            element.bright = 100;
                        }
                        element.time = 30;
                        element.timeCount = 30;
                    }
                });

                cubeCore.count--;
                if (cubeCore.count < 0) {
                    initmode(CONST.STAR);
                    cubeCore.count = 60;
                }

                break;
            case CONST.STAR:

                cubeCore.lights.forEach(function (element) {
                    if (element.timeCount > 0) {
                        element.timeCount = element.timeCount - 10;
                        element.rgb = -Math.abs(element.rgb);;
                    } else {
                        if (element.bright > 0) {
                            element.rgb = Math.abs(element.rgb);
                            element.bright = 0;
                        } else {
                            element.rgb = randomrgbcolor();
                            element.bright = 100;
                        }
                        element.time = Math.floor(Math.random() * 40);
                        element.timeCount = element.time;
                    }
                });

                cubeCore.count--;
                if (cubeCore.count < 0) {
                    initmode(CONST.BREATH);
                    cubeCore.count = 30;
                }

                break;

            default:
                break;
        }
        senddata(cubeCore.lights);
    }

    if (config) {
        if (config.lights) {
            cubeCore.lights = config.lights;
        }
        if (config.mode) {
            cubeCore.mode = config.mode;
        }
        if (config.count) {
            cubeCore.count = config.count;
        }
    }

    setInterval(ondata, 1000);

}


function senddata(lights) {
    msg.payload = lights;
    node.send(msg);

}

initgameengine(msg.payload);