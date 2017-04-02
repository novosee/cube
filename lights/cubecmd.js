const readlineSync = require('readline-sync');

const Yeelight = require('yeelight2');
lights = {};
Yeelight.discover(function (light) {

    console.log('id: ' + light.id + '  name: ' + light.name + '  ip: ' + light.socket.remoteAddress);
    lights[light.id] = light;
    //light.set_name(i.toString());
    // light.set_rgb('16711935');
    // light.set_ct_abx(1700);
    // light.set_bright(50);
    /*
    function blink() {
        light.toggle();
    }
    setInterval(blink, 2000);
    */
});


setTimeout(cmd, 3000);
function cmd() {
    console.log('\n\nGood day! mate! Let\'s start!');
    // TODO: Log the answer in a database
    for (var id in lights) {
        var light = lights[id];
        light.set_power('on');
        var answer = readlineSync.question('ID: ' + light.id + '   name:' + light.name + '\n' + 'Please input the name: \n');

        if (answer) {
            light.set_name(answer);
            console.log('Change the name to :' + light.name);
        } else {
            console.log('Keep the same name: ' + light.name);
        }
        light.set_power('off');

    }

    console.log(`Finished!\nBye!\n`);
    process.exit();


}