// bootstrap qw from runeappslib.js since minimap.js uses it
qw = function(){};

var playerDot = null;
ImageData.fromBase64(function (result) { 
    playerDot = result; 
}, "iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjQ4QTM1NUY4OUZBMTFFNzkyQjlGNjQ3NkUwM0EzREEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjQ4QTM1NjA4OUZBMTFFNzkyQjlGNjQ3NkUwM0EzREEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNDhBMzU1RDg5RkExMUU3OTJCOUY2NDc2RTAzQTNEQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNDhBMzU1RTg5RkExMUU3OTJCOUY2NDc2RTAzQTNEQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiMMl8AAAAAuSURBVHjaYvz//z8DEIAJIGBk/A8V+fHjB8OL5y+AUkD+54+f/9+/ex8sBxBgACzPGwWqEqJHAAAAAElFTkSuQmCC");

var minimapReader = new MinimapReader();
var minimap = null;

var minimapRefreshInterval = 5000;
var playerFinderInterval = 1000;

var Status = {
    STARTING: {
        id: "STARTING",
        text: "Starting...",
        class: "paused"
    },
    PAUSED: {
        id: "PAUSED",
        text: "Paused rn",
        class: "paused"
    },
    RUNNING: {
        id: "RUNNING",
        text: "OK-",
        class: "ok"
    },
    ALERT: {
        id: "ALERT",
        text: "PLAYERS DETECTED!",
        class: "alert"
    }
};

var status = Status.PAUSED.id;

var statusText = null;
var container = null;
var stateButton = null;

function start() {
    statusText = document.getElementById("status");

    if (!window.alt1) {
        statusText.innerText = "Alt1 not detected!";
        return false;
    }
    
    container = document.getElementById("container");
    stateButton = document.getElementById("state-button");
    
    setStatus(Status.STARTING);

    findMinimap();
    setInterval(function() {
        findMinimap();
    }, minimapRefreshInterval);

    setInterval(function() {
        if (!minimap || status == Status.PAUSED.id) {
            return;
        }

        var minimapRegion = a1lib.getregion(minimap.x, minimap.y, minimap.w, minimap.h);
        var players = findPlayers(minimapRegion);
        setStatus(players > 0 ? Status.ALERT : Status.RUNNING);
    }, playerFinderInterval);
}

function changeState() {
    if (window.status != Status.PAUSED.id) {
        setStatus(Status.PAUSED);
    } else {
        setStatus(Status.RUNNING);
    }
}

function setStatus(status) {
    if (statusText) {
        statusText.innerText = status.text;
    }
    if (container) {
        container.className = status.class;
    }

    if (stateButton) {
        var stateButtonText = status.id == Status.PAUSED.id ? "Start" : "Pause";
        stateButton.innerText = stateButtonText;
    }

    window.status = status.id;
}

function findPlayers(minimapRegion) {
    if (!minimap) {
        return 0;
    }
    return a1lib.findsubimg(minimapRegion, playerDot).length;
}

function findMinimap() {
    minimap = minimapReader.find();
}