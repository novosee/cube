const Yeelight = require('yeelight2');



Yeelight.startmusicservice();
/*
setInterval(function () {
    for (var id in Yeelight.lights) {

        console.log(id + 'send');
        Yeelight.scenecommand(id, 1, 1, lights[0].time * 50 + ',' + 1 + ',' + randomrgbcolor() + ',' + 1);

    }

}, 5000);
*/
function randomrgbcolor() {
    return (Math.floor(Math.random() * 255) + 1) * 256 * 256 + (Math.floor(Math.random() * 255) + 1) * 256 + (Math.floor(Math.random() * 255) + 1);
}

var WebSocket = require('ws');
ws = new WebSocket('ws://127.0.0.1:1880/vivid');
ws.on('open', function () {
    //ws.send('something');
});
ws.on('message', function (message) {

    lights = JSON.parse(message);

    for (var i in lights) {
        if (lights[i].rgb >= 0) {
            if (lights[i].bright == 0) {
                Yeelight.cfcommand(lights[i].id, 1, 2, lights[i].time * 100 + ',' + 1 + ',' + lights[i].rgb + ',' + 1);
            } else {
                Yeelight.scenecommand(lights[i].id, lights[i].time * 100 + ',' + 1 + ',' + lights[i].rgb + ',' + 100);
            }
        }
    }
});