var nop = function () {};

var lerp2D = function (start, end, duration, startMillis) {
    var value = (millis() - startMillis) / (duration * 1000);
    return {
        x: lerp(start.x, end.x, value),
        y: lerp(start.y, end.y, value)
    };
};

var drawStar = function (position, diameter, override) {
    fill(255);
    noStroke();
    if (override) {
        override();
    }

    ellipse(position.x, position.y, diameter, diameter);
};

var drawStars = function (stars) {
    stars.forEach(function (star) {
        drawStar(star, 3);
    });
};

var drawTrail = function (start, end) {
    stroke(255, 255, 255);
    strokeWeight(5);
    line(start.x, start.y, end.x, end.y);
};

var drawShootingStar = function (start, end, speed, startMillis) {
    var starPosition = lerp2D(start, end, speed, startMillis);
    drawStar(starPosition, 35);
    drawTrail(start, starPosition);
};

var drawPath = function (path) {
    strokeWeight(10);
    stroke(60, 201, 28);
    point(path.start.x || 0, path.start.y || 0);

    stroke(255, 0, 0);
    point(path.end.x || 0, path.end.y || 0);
};

var Start = function (path, state) {
    this.interactive = true;
    this.path = path;
    this.state = state;
    this.path.start = {};
};

Start.prototype.next = function () {
    this.path.start = createVector(mouseX, mouseY);
    this.state.set('end');
};

Start.prototype.draw = function () {
    drawPath(this.path);
};

var End = function (path, state) {
    this.interactive = true;
    this.path = path;
    this.state = state;

    this.path.end = {};
};

End.prototype.next = function () {
    this.path.end = createVector(mouseX, mouseY);
    this.state.set('animate');
};

End.prototype.draw = function () {
    drawPath(this.path);
};

var Animate = function (path, state) {
  this.path = path;
  this.state = state;
  this.duration = 3; // seconds
  this.startMillis = null;
};

Animate.prototype.next = function () {
    this.state.set('dead');
};

Animate.prototype.draw = function () {
    if (!this.startMillis) {
        this.startMillis = millis();
    }

    if ((millis() - this.startMillis) > this.duration * 1000) {
        this.next();
    } else {
        drawPath(this.path);
        drawShootingStar(this.path.start, this.path.end, this.duration, this.startMillis);
    }
};

var Dead = {
    dead: true,
    draw: nop,
    next: nop
};

var State = function () {
    this.path = {};
    this.states = {
        start: new Start(this.path, this),
        end: new End(this.path, this),
        animate: new Animate(this.path, this),
        dead: Dead
    };
    this.state = this.states.start;
};

State.prototype.set = function (state) {
    this.state = this.states[state];
};

State.prototype.next = function () {
    this.state.next();
};

State.prototype.draw = function () {
    this.state.draw();
};

State.prototype.canInteract = function () {
    return this.state.interactive;
};

State.prototype.isDead = function () {
    return this.state.dead;
};

var RestingState = function (app) {
    this.app = app;
};

RestingState.prototype.next = function () {
    this.app.lastState = new State();
    this.app.states.push(this.app.lastState);
    this.app.state().next();
};

var LockedState = function () {};
LockedState.prototype.next = nop;

var App = function ({ width, height }) {
    this.width = width
    this.height = height
    this.states = [];
    this.lastState = null;
    this.restingState = new RestingState(this);
    this.lockedState = new LockedState();

    this.stars = Array(250).fill(0).map(function () {
        return {
            x: random(0, width),
            y: random(0, height)
        };
    });

    this.stateMap = {
        interacting: 'lastState',
        resting: 'restingState',
        locked: 'lockedState'
    };
};

App.prototype.cullDeadStates = function () {
    this.states = this.states.filter(function (state) {
        return !state.isDead();
    });
};

App.prototype.drawPauseButton = function () {
    var buttonColor = this.locked ? color(0, 255, 0) : color(255, 0, 0);

    fill(buttonColor.toString());
    noStroke();
    rect(0, 0, 50, 50);
};

App.prototype.drawStates = function () {
    this.states.forEach(function (state) {
        state.draw();
    });
};

App.prototype.drawStars = function () {
    drawStars(this.stars);
};

App.prototype.draw = function () {
    background(29, 40, 115);

    this.drawStars();
    this.drawStates();
    this.drawPauseButton();

    if (frameCount % 300 === 0) { this.cullDeadStates(); }
};

App.prototype.clicked = function () {
    if (mouseX <= 50 && mouseY <= 50) {
        this.locked = !this.locked;
        return;
    }

    this.state().next();
};

App.prototype.isInteracting = function () {
    return this.lastState && this.lastState.canInteract();
};

App.prototype.stateKey = function () {
    if (this.locked) { return 'locked'; }
    return this.isInteracting() ? 'interacting' : 'resting';
};

App.prototype.state = function () {
    return this[this.stateMap[this.stateKey()]];
};

var app = new App({ width: windowWidth, height: windowHeight });
setup = function () {
  size(app.width, app.height)
}

draw = function () {
    app.draw();
};

mouseClicked = function () {
    app.clicked();
};
