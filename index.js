/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 60;
canvas.height = window.innerHeight - 160;

let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let background_colour = "white";
let draw_colour = "black";
let draw_width = "2";
let is_drawing = false;

let strokes_array = []
let index = -1;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

document.addEventListener('keydown', function(event){
        if (event.ctrlKey && event.key === 'z') {
        undo_last();
    }
}, false);

document.addEventListener('keydown', function(event){
    if (event.ctrlKey && event.key === 'c') {
        clear_canvas();
        }
    }, false);

document.addEventListener('resize', function(event){
    canvas.width = window.innerWidth - 60;
    canvas.height = window.innerHeight - 160;
})

function start(event)
{
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop)

    event.preventDefault();
}

function draw(event)
{
    if(is_drawing)
        {
            context.lineTo(event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop)
            context.strokeStyle = draw_colour;
            context.lineWidth = draw_width;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
        }
    event.preventDefault();
}

function stop(event)
{
    if(is_drawing)
        {
            context.stroke();
            context.closePath();
            is_drawing = false;
        }
    
    event.preventDefault();

    if(event.type != "mouseout")
        {
            strokes_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
            index ++;
        }
}

function clear_canvas()
{
    context.fillStyle = background_colour;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    strokes_array = [];
    index = -1;
}

function undo_last()
{
    if(index <= 0) //no strokes
        {
            clear_canvas();
        } else
        {
            index -= 1;
            strokes_array.pop();
            context.putImageData(strokes_array[index], 0, 0);
        }
}