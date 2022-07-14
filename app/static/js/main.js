function send(x, y, speed, angle) {
    var data = {
        x: x,
        y: y,
        speed: speed,
        angle: angle
    };

    $.ajax({
        url: "/send",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        type: "POST",
        success : function(result) {
            //it worked
        }, error : function(result){
           // console.log(result); Returns some stuff but idk what it means
        }
    });
}

window.addEventListener("click", function(e) {
  // Make page to full screen to allow app to fit
  if (!document.fullscreenElement) { // remove one ! for later
    document.documentElement.requestFullscreen({"navigationUI": "hide"}).catch(err => { alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`) });
  }
});

document.addEventListener('contextmenu', event => event.preventDefault());

screen.orientation.addEventListener("change", async () => {
    await new Promise(r => setTimeout(r, 500));
    if (!screen.orientation.type.toLowerCase().includes("landscape")) {
        location.reload();
    }
});

var canvas, ctx;
window.addEventListener('load', () => {

    if (!screen.orientation.type.toLowerCase().includes("landscape")) {
        document.getElementById("body").innerHTML = "";
        alert("Please rotate your device to landscape mode");
        return;
    }

    canvas = document.getElementById('joystick');
    ctx = canvas.getContext('2d');
    resize();

    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('mousemove', Draw);

    document.addEventListener('touchstart', startDrawing);
    document.addEventListener('touchend', stopDrawing);
    document.addEventListener('touchcancel', stopDrawing);
    document.addEventListener('touchmove', Draw);
    window.addEventListener('resize', resize);

});

var width, height, radius, x_orig, y_orig;
function resize() {
    width = window.innerWidth;
    radius = 75;
    height = radius * 6.5;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    background();
    joystick(width / 2, height / 3);
}

function background() {
    x_orig = width / 2;
    y_orig = height / 3;

    ctx.beginPath();
    ctx.arc(x_orig, y_orig, radius + 20, 0, Math.PI * 2, true);
    ctx.fillStyle = '#D3D3D3';
    ctx.fill();
}

function joystick(width, height) {
    ctx.beginPath();
    ctx.arc(width, height, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = '#2234A8';
    ctx.fill();
    ctx.strokeStyle = '#659BDF';
    ctx.lineWidth = 8;
    ctx.stroke();
}

let coord = { x: 0, y: 0 };
let paint = false;

function getPosition(event) {
    if (event != null) {
        var mouse_x = event.clientX || event.touches[0].clientX;
        var mouse_y = event.clientY || event.touches[0].clientY;
        coord.x = mouse_x - canvas.offsetLeft;
        coord.y = mouse_y - canvas.offsetTop;
    }
}

function is_it_in_the_circle() {
    var current_radius = Math.sqrt(Math.pow(coord.x - x_orig, 2) + Math.pow(coord.y - y_orig, 2));
    if (radius >= current_radius) return true
    else return false
}


function startDrawing(event) {
    paint = true;
    getPosition(event);
    if (is_it_in_the_circle()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
        joystick(coord.x, coord.y);
        Draw();
    }
}


function stopDrawing() {
    paint = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    joystick(width / 2, height / 3);
    this.x = 0
    this.y = 0
    this.speed = 0
    this.angle = 0
    send(0, 0, 0, 0);
}

function Draw(event) {

    if (paint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
        var angle_in_degrees,x, y, speed;
        var angle = Math.atan2((coord.y - y_orig), (coord.x - x_orig));

        if (Math.sign(angle) == -1) {
            angle_in_degrees = Math.round(-angle * 180 / Math.PI);
        }
        else {
            angle_in_degrees =Math.round( 360 - angle * 180 / Math.PI);
        }


        if (is_it_in_the_circle()) {
            joystick(coord.x, coord.y);
            x = coord.x;
            y = coord.y;
        }
        else {
            x = radius * Math.cos(angle) + x_orig;
            y = radius * Math.sin(angle) + y_orig;
            joystick(x, y);
        }


        getPosition(event);

        var speed =  Math.round(100 * Math.sqrt(Math.pow(x - x_orig, 2) + Math.pow(y - y_orig, 2)) / radius);

        var x_relative = Math.round(x - x_orig);
        var y_relative = Math.round(y - y_orig);

        this.x = x_relative;
        this.y = y_relative;
        this.speed = speed;
        this.angle = angle_in_degrees;

        send(x_relative, y_relative, speed, angle_in_degrees);
    }
}