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