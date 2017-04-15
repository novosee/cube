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

var context = {};

function keyPressed() {
  context.global.keyCode = keyCode;
  sendit(keyCode);
}

function p5color(icolor) {
  var b = Math.floor(icolor % 256);
  var g = Math.floor(icolor / 256 % 256);
  var r = Math.floor(icolor / 256 / 256);
  return color(r, g, b, 250);
}

function senddata(lights) {
  initcubetable(lights);
  lights.forEach(function (element) {
    if (element.rgb >= 0) {
      if (element.bright == 0) {
        //console.log("bright 0");
        cubeTable[element.x][element.y][element.z].eColor = color(255, 255, 255, 5);
      } else {
        cubeTable[element.x][element.y][element.z].eColor = p5color(element.rgb);
      }
      cubeTable[element.x][element.y][element.z].time = element.time;
      cubeTable[element.x][element.y][element.z].timeCount = element.time;

    }

  });

}





var ws;
var wsUri = "ws:";
var loc = window.location;
console.log(loc);
if (loc.protocol === "https:") {
  wsUri = "wss:";
}
// This needs to point to the web socket in the Node-RED flow
// ... in this case it's ws/simple
//wsUri += "//" + loc.host + "/vivid";
wsUri += "//127.0.0.1:1880/vivid";

function wsConnect() {
  console.log("connect", wsUri);
  ws = new WebSocket(wsUri);
  ws.onmessage = function (msg) {
    // parse the incoming message as a JSON object
    var lights = JSON.parse(msg.data);
    initcubetable(lights);
    lights.forEach(function (element) {
      if (element.rgb >= 0) {
        if (element.bright == 0) {
          cubeTable[element.x][element.y][element.z].eColor = color(255, 255, 255, 10);
        } else {
          cubeTable[element.x][element.y][element.z].eColor = p5color(element.rgb);
        }
        cubeTable[element.x][element.y][element.z].time = element.time;
        cubeTable[element.x][element.y][element.z].timeCount = element.time;

      }

    });



  }
  ws.onopen = function () {
    console.log("connected");
  }
  ws.onclose = function () {
    setTimeout(wsConnect, 3000);
  }
}

function sendit(m) {
  if (ws) {
    ws.send(JSON.stringify(m));
  }
}








function setup() {
  context.global = {};
  context.global.keyCode = 0;
  createCanvas(windowWidth, windowHeight, WEBGL);
  //wsConnect();
  initgameengine();
  frameRate(10);
}


var cubeTable = {};
var iscubeTableInit = false;
function initcubetable(lights) {
  if (iscubeTableInit) {
    return;
  }
  iscubeTableInit = true;
  var xNum = 0, yNum = 0, zNum = 0;
  lights.forEach(function (element) {
    if (element.x > xNum) {
      xNum = element.x;
    }
    if (element.y > yNum) {
      yNum = element.y;
    }
    if (element.z > zNum) {
      zNum = element.z;
    }
  });

  xNum++;
  yNum++;
  zNum++;
  cubeTable.xNum = xNum;
  cubeTable.yNum = yNum;
  cubeTable.zNum = zNum;
  cubeTable.index = 0;
  cubeTable.totalNum = xNum * yNum * zNum;

  for (var x = 0; x < xNum; x++) {
    cubeTable[x] = {};
    for (var y = 0; y < yNum; y++) {
      cubeTable[x][y] = {};
      for (var z = 0; z < zNum; z++) {
        cubeTable[x][y][z] = null;
      }
    }
  }

  lights.forEach(function (element) {
    cubeTable[element.x][element.y][element.z] = { sColor: color(255, 255, 255, 10), eColor: color(255, 255, 255, 10), time: 0, timeCount: 0 };
  });


}

function draw() {
  background(0);
  //rotateX(mouseY * 0.002);
  rotateY(mouseX * 0.02);
  //translate(0, , 0);

  rotateZ(mouseY * 0.001);

  for (var x = 0; x < cubeTable.xNum; x++) {
    for (var y = 0; y < cubeTable.yNum; y++) {
      for (var z = 0; z < cubeTable.zNum; z++) {
        if (cubeTable[x][y][z]) {
          push();
          translate(x * 50 - (cubeTable.xNum) * 25, y * 50 - (cubeTable.yNum) * 25, z * 50 - (cubeTable.zNum) * 25);


          if (cubeTable[x][y][z].timeCount != 0) {
            cubeTable[x][y][z].timeCount--;
            var newColor = [];
            for (var i = 0; i < 4; i++) {
              newColor[i] = cubeTable[x][y][z].sColor.levels[i] + Math.floor(((cubeTable[x][y][z].eColor.levels[i] - cubeTable[x][y][z].sColor.levels[i]) / cubeTable[x][y][z].time) * (cubeTable[x][y][z].time - cubeTable[x][y][z].timeCount));
            }
            //console.log(newColor);
            fill(color(newColor[0], newColor[1], newColor[2], newColor[3]));
          } else {

            fill(cubeTable[x][y][z].eColor);
            cubeTable[x][y][z].sColor = cubeTable[x][y][z].eColor;
          }

          //fill(cubeTable[x][y][z].eColor);
          box(49);
          pop();

        } else {

        }


      }
    }
  }
}