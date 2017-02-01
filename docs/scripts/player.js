var Player = function (container, animation) {
    var self = this;

    this.animation = animation;
    this.container = container;
    this.playButton = null;
    this.pauseButton = null;
    this.progressHandle = null;
    this.handleRect = 10;
    this.barRect = 100;

    this.createUserInterface();

    this.animation.observe("play", function () {
        self.playButton.style.display = "none";
        self.pauseButton.style.display = "block";
    });

    this.animation.observe("reverse", function () {
        self.playButton.style.display = "none";
        self.pauseButton.style.display = "block";
    });

    this.animation.observe("pause", function () {
        self.playButton.style.display = "block";
        self.pauseButton.style.display = "none";
    });

    this.animation.observe("stop", function () {
        self.playButton.style.display = "block";
        self.pauseButton.style.display = "none";
    });

    this.animation.observe("tick", function () {
        var difference = self.barRect.width - self.handleRect.width;

        var left = difference * animation.progress;
        self.handle.style.transform = "translateX(" + left + "px)";
    });

    this.animation.stop();
    this.playButton.style.display = "block";
    this.pauseButton.style.display = "none";
};

Player.prototype.getEvent = function(event){
    event.preventDefault();
    if (event.touches){
        return event.touches[0];
    }
    return event;
};

Player.prototype.createButton = function (id, content) {
    var button = document.createElement("button");
    button.innerHTML = content;
    button.id = id;

    button.style.backgroundColor = "#333";
    button.style.color = "#ccc";
    button.style.fontSize = "12px";
    button.style.border = "0";
    button.style.cursor = "pointer";
    button.style.height = "30px";
    button.style.width = "30px";
    button.style.lineHeight = "30px";

    button.addEventListener("mouseover", function () {
        button.style.backgroundColor = "#666";
    });

    button.addEventListener("mouseout", function () {
        button.style.backgroundColor = "#333";
    });

    return button;
};

Player.prototype.createProgressBar = function () {
    var self = this;
    var container = document.createElement("div");

    var bar = document.createElement("div");
    bar.style.width = "100%";
    bar.style.height = "10px";
    bar.style.backgroundColor = "#a20000";
    bar.style.transform = "translate3d(0,0,0)";
    bar.style.userSelect = "none";

    var handle = document.createElement("div");
    handle.style.width = "16px";
    handle.style.height = "16px";
    handle.style.borderRadius = "50%";
    handle.style.backgroundColor = "#ccc";
    handle.style.position = "relative";
    handle.style.top = "-4px";
    handle.style.userSelect = "none";
    handle.style.cursor = "pointer";

    bar.appendChild(handle);
    container.appendChild(bar);
    var startLeft = 0;
    var startPageX = 0;

    var mousemove = function (event) {
        var event = self.getEvent(event);
        var difference = event.pageX - startPageX;
        var x = startLeft + difference;
        var progress = x / (self.barRect.width - self.handleRect.width);

        self.animation.seek(progress);
    };

    var mouseup = function (event) {
        var event = self.getEvent(event);
        var difference = event.pageX - startPageX;
        var x = startLeft + difference;
        var progress = x / (self.barRect.width - self.handleRect.width);

        self.animation.seek(progress);
        self.animation.stop();

        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    };

    var mousedown = function (event) {
        var event = self.getEvent(event);

        self.barRect = self.bar.getBoundingClientRect();
        self.handleRect = self.handle.getBoundingClientRect();
        startPageX = event.pageX;
        startLeft = self.handleRect.left - self.barRect.left;

        self.animation.pause();

        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        document.addEventListener("touchmove", mousemove);
        document.addEventListener("touchend", mouseup);
        document.addEventListener("touchcancel", mouseup);
    };

    handle.addEventListener("mousedown", mousedown);
    handle.addEventListener("touchstart", mousedown);

    this.handle = handle;
    this.bar = bar;

    return container;
};

Player.prototype.createUserInterface = function () {
    var self = this;

    var container = this.container;
    container.style.backgroundColor = "#333";
    container.style.height = "40px";
    container.style.transform = "translate3d(0,0,0)";
    container.style.userSelect = "none";

    var progressBar = this.createProgressBar();
    var playButton = this.createButton("play", "&#9658;");
    var pauseButton = this.createButton("pause", "&#10074;&#10074;");

    container.appendChild(progressBar);
    container.appendChild(playButton);
    container.appendChild(pauseButton);

    this.playButton = playButton;
    this.pauseButton = pauseButton;

    playButton.addEventListener("click", function () {
        self.barRect = self.bar.getBoundingClientRect();
        self.handleRect = self.handle.getBoundingClientRect();

        self.play();
    });

    pauseButton.addEventListener("click", function () {
        self.pause();
    });

    return container;
};

Player.prototype.play = function () {
    if (this.animation.progress === 1) {
        this.animation.stop();
        this.animation.seek(0);
    }
    this.animation.play();
};

Player.prototype.pause = function () {
    this.animation.pause();
};