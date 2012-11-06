$(function () {
    var W = $("#myCanvas").width();
    var H = $("#myCanvas").height();

    var pencil = new toolPencil();
    var filler = new toolFiller();

    // utility functions
    function log(str) {
        $('#log').append(str + "<br/>");
    }

    function findPos() {
        var obj = document.getElementById('myCanvas');
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }

    function intval(name) {
            return parseInt(document.getElementById(name).value);
    }
    
    function isSameColor(img, x, y, color) {
        var data = img.data;
        var offset = ((y * (img.width * 4)) + (x * 4));
        if ((data[offset + 0]) != ((color >> 24) & 0xFF)
          || (data[offset + 1]) != ((color >> 16) & 0xFF)
          || (data[offset + 2]) != ((color >> 8) & 0xFF)
            //|| (data[offset + 3]) != (color & 0xFF)
        )
            return false;
        return true;
    }
    
    function getPixelColor(img, x, y) {
        var data = img.data;
        var offset = ((y * (img.width * 4)) + (x * 4));
        var result = data[offset + 0] << 24; // r
        result |= data[offset + 1] << 16; // g
        result |= data[offset + 2] << 8; // b
        //result |= data[offset + 3] << 0; // a
        return result;
    }
    
    function setPixelColor(img, x, y, color) {
        var data = img.data;
        var offset = ((y * (img.width * 4)) + (x * 4));
        data[offset + 0] = (color >> 24) & 0xFF;
        data[offset + 1] = (color >> 16) & 0xFF;
        data[offset + 2] = (color >>  8) & 0xFF;
        //data[offset + 3] = (color >>  0) & 0xFF;
    }

    // flood fill tool
    function toolFiller() {
        var dx = [-1, 0, +1, 0];
        var dy = [0, -1, 0, +1];

        var tool = this;
        this.mousedown = function (ev) {
            // measure execution time
            var start = new Date().getTime();

            var visited = new Array(W * H);
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            var pos = findPos(this);
            var x = ev.pageX - pos.x;
            var y = ev.pageY - pos.y;
            
            var img = context.getImageData(0, 0, W, H);
            
            var hitColor = getPixelColor(img, x, y);
            var stack = [];
            stack.push({ x: x, y: y });
            var newColor = (intval('red') << 24) | (intval('green') << 16) | (intval('blue') << 8);
            setPixelColor(img, x, y, newColor);
            visited[x * W + y] = true;
            while (stack.length > 0) {
                var cur = stack.pop();

                for (var i = 0; i < 4; i++) {
                    var c = { x: cur.x + dx[i], y: cur.y + dy[i] };
                    if (c.x < 0 || c.y < 0 || c.x >= W || c.y >= H || visited[c.x * W + c.y] || !isSameColor(img, c.x, c.y, hitColor)) {
                        continue;
                    }
                    setPixelColor(img, c.x, c.y, newColor);
                    visited[c.x * W + c.y] = true;
                    stack.push(c);
                }
            }

            context.putImageData(img, 0, 0);

            // measure execution time
            var end = new Date().getTime();
            var time = end - start;
            log('Fill execution time: ' + time + " ms");
        };
    }
    
    // pencil tool
    function toolPencil() {
        var tool = this;
        this.started = false;

        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function (ev) {
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            context.beginPath();
            var pos = findPos(this);
            var x = ev.pageX - pos.x;
            var y = ev.pageY - pos.y;
            context.moveTo(x, y);
            tool.started = true;
        };

        // This function is called every time you move the mouse. Obviously, it only 
        // draws if the tool.started state is set to true (when you are holding down 
        // the mouse button).
        this.mousemove = function (ev) {
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            if (tool.started) {
                context.lineWidth = intval('width');
                context.strokeStyle = "rgb(" + intval('red') + "," + intval('green') + "," + intval('blue') + ")";
                var pos = findPos(this);
                var x = ev.pageX - pos.x;
                var y = ev.pageY - pos.y;
                context.lineTo(x, y);
                context.stroke();
            }
        };

        // This is called when you release the mouse button.
        this.mouseup = function (ev) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
            }
        };
    }

    // The general-purpose event handler. This function just determines the mouse 
    // position relative to the canvas element.
    function evCanvas(ev) {
        ev._x = ev.layerX;
        ev._y = ev.layerY;

        var fill = document.getElementById('fill').checked;

        var tool;
        if(fill) {
            tool = filler;
        }
        else {
            tool = pencil;
        }

        var func = tool[ev.type];
        if (func) {
            func(ev);
        }
    }

    // initial fill
    var canvas = document.getElementById('myCanvas');
    if (canvas && canvas.getContext) {
        var context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, W, H);
        }
    }

    // canvas events
    canvas.addEventListener('mousemove', evCanvas, false);
    canvas.addEventListener('mouseup', evCanvas, false);
    canvas.addEventListener('mousedown', evCanvas, false);
});
