var Building = /** @class */ (function () {
    //Initializes the building elements, creates floors and elevators using a factory method,
    // and appends them to the screen
    function Building(elevatorsNumber, floorsNumber) {
        var _this = this;
        var _a;
        //Handles click events by determining the most suitable elevator to the specified floor,
        //setting timer counters, and instructing the selected elevator to work towards the specified floor.
        this.onClick = function (currentFloor) {
            var floorNumber = currentFloor.button.floorNumber;
            var suitElevator = _this.findSuitableElevator(floorNumber);
            var timeUntilArrived = _this.elevators[suitElevator].getTimeUntilArrived(floorNumber);
            currentFloor.startTimer(timeUntilArrived);
            _this.elevators[suitElevator].work(floorNumber);
        };
        this.initializeElements();
        this.floors = FloorsFactory.createFloors(floorsNumber, this.floorsElement, this.onClick);
        this.elevators = FloorsFactory.createElevators(elevatorsNumber, this.elevatorsElement);
        this.buildingElement.appendChild(this.floorsElement);
        this.buildingElement.appendChild(this.elevatorsElement);
        (_a = document.getElementById("screen")) === null || _a === void 0 ? void 0 : _a.appendChild(this.buildingElement);
    }
    // Creates and initializes building, floors,
    // and elevators elements with appropriate class names;
    Building.prototype.initializeElements = function () {
        this.buildingElement = document.createElement("div");
        this.floorsElement = document.createElement("div");
        this.elevatorsElement = document.createElement("div");
        this.buildingElement.className = "building";
        this.floorsElement.className = "floors";
        this.elevatorsElement.className = "elevators";
    };
    //Determines the most suitable elevator for a given floor by comparing the time
    //until arrival for each elevator and returning the index of the best option
    Building.prototype.findSuitableElevator = function (floor_number) {
        var suitableElevator = 0;
        var minTimeArrived = this.elevators[0].getTimeUntilArrived(floor_number);
        for (var i = 1; i < this.elevators.length; i++) {
            var iTimeArrived = this.elevators[i].getTimeUntilArrived(floor_number);
            if (iTimeArrived < minTimeArrived) {
                suitableElevator = i;
                minTimeArrived = iTimeArrived;
            }
        }
        return suitableElevator;
    };
    return Building;
}());
var Floor = /** @class */ (function () {
    //Initializes a new floor object with floor number, parent HTML element,
    // draw line option, and click callback, appending it to the DOM
    function Floor(floorNumber, parentElement, drawLine, callBack) {
        var _this = this;
        //Plays the arrival sound and triggers the arrival action for the button when called
        this.handleElevArrival = function () {
            _this.audio.audio.play();
            _this.button.handleArrival();
        };
        //Invokes the specified callback function with the current floor
        //instance when a button click event occurs.
        this.handleButtonClick = function () {
            _this.onClickButton(_this);
        };
        this.onClickButton = callBack;
        this.createObjects(floorNumber, drawLine);
        parentElement.appendChild(this.divElement);
    }
    //Dynamically creates DOM elements for a floor, including a button, timer, and audio elements,
    //based on specified parameters like floor number and whether to draw a line
    Floor.prototype.createObjects = function (floorNumber, drawLine) {
        this.divElement = document.createElement("div");
        this.divElement.className = "floor";
        this.drawBlackLine(drawLine, this.divElement);
        var warpTimerButton = document.createElement("div");
        warpTimerButton.className = "warp_timer_button";
        this.button = new Button(floorNumber, warpTimerButton, this.handleButtonClick);
        this.timer = new Timer(warpTimerButton, this.handleElevArrival);
        this.divElement.appendChild(warpTimerButton);
        this.audio = new AudioElement();
    };
    //Sets the timer counter to the time until elevator will arrived and starts the timer
    Floor.prototype.startTimer = function (time) {
        this.timer.setCounter(time);
    };
    //Conditionally creates and appends a black line element to
    //the parent element based on the Draw_line parameter's value
    Floor.prototype.drawBlackLine = function (DrawLine, parentElement) {
        if (DrawLine) {
            var blackLineElement = document.createElement("div");
            blackLineElement.className = "black_line";
            parentElement.appendChild(blackLineElement);
        }
    };
    return Floor;
}());
var Button = /** @class */ (function () {
    //Initializes a new instance of the Button class with the specified floor number,
    // parent HTML element, and callback function, and appends the button element to the parent element in the DOM.
    function Button(floorNumber, parentElement, callBack) {
        this.floorNumber = floorNumber;
        this.flag = false;
        this.initImgElement(callBack);
        parentElement.appendChild(this.img);
    }
    //Creates and configures the button's HTML element, sets its class and text content,
    //and assigns a click event handler that triggers the button's work method when clicked
    Button.prototype.initImgElement = function (call_bake) {
        var _this = this;
        this.img = document.createElement("button");
        this.img.className = "metal linear";
        this.img.textContent = "".concat(this.floorNumber);
        this.img.onclick = function () {
            _this.handleClick(call_bake);
        };
    };
    //Executes a callback function and updates button status if not flagged,
    //triggering a request and changing the flag.
    Button.prototype.handleClick = function (callBack) {
        if (!this.flag) {
            callBack();
            this.toggleFlag();
            this.changeColor(Settings.buttonPressed);
        }
    };
    //Changes the button's color to black upon arrival, then after a delay, toggles the button's status.
    Button.prototype.handleArrival = function () {
        var _this = this;
        this.changeColor(Settings.buttonUnPressed);
        setTimeout(function () {
            _this.toggleFlag();
        }, 2000);
    };
    //Toggles the flag status of the button
    Button.prototype.toggleFlag = function () {
        this.flag = !this.flag;
    };
    //Changes the button's color to the specified color
    Button.prototype.changeColor = function (color) {
        this.img.style.color = color;
    };
    return Button;
}());
var AudioElement = /** @class */ (function () {
    function AudioElement() {
        this.audio = document.createElement("audio");
        this.audio.src = "./ding.mp3";
    }
    return AudioElement;
}());
var Elevator = /** @class */ (function () {
    //Sets up a new elevator instance with current time availability,
    //initial destination, and adds its image to the DOM.
    function Elevator(parentElement) {
        this.timeAvailable = Date.now();
        this.destination = 0;
        this.img = document.createElement("img");
        this.img.className = "elevator";
        this.img.src = "./elv.png";
        parentElement.appendChild(this.img);
    }
    // Initiates elevator movement towards a specified floor, scheduling the movement with a
    //transition time based on distance and updating time availability
    Elevator.prototype.work = function (floorNumber) {
        var _this = this;
        var transitionTime = this.getDistance(floorNumber) * Settings.floorTime;
        setTimeout(function () {
            _this.move(floorNumber, transitionTime);
        }, this.getTimeUntilAvailable());
        this.updateAvailableTime(transitionTime);
        this.destination = floorNumber;
    };
    //Animates the elevator's vertical movement to a specified floor using CSS transitions,
    // adjusting the transition time and translation accordingly
    Elevator.prototype.move = function (floorNumber, transitionTime) {
        var translateY = -Settings.floorSize * floorNumber;
        this.img.style.transition = "transform ".concat(transitionTime, "s ease");
        this.img.style.transform = "translateY(".concat(translateY, "px)");
    };
    //Updates the time available for the elevator based on the transition
    // time and adds additional time for preparation and travel.
    Elevator.prototype.updateAvailableTime = function (transitionTime) {
        var addedTime = (transitionTime + Settings.floorWaitingTime) * Settings.milliSecond;
        if (!this.isWorking()) {
            this.timeAvailable = Date.now();
        }
        this.timeAvailable += addedTime;
    };
    //Calculates and returns the absolute distance between the elevator's
    // current destination and a specified floor number
    Elevator.prototype.getDistance = function (floorNumber) {
        return Math.abs(this.destination - floorNumber);
    };
    //Checks if the elevator is currently working or available based on
    //the comparison between its available time and the current time
    Elevator.prototype.isWorking = function () {
        return this.timeAvailable > Date.now();
    };
    //Calculates and returns the time until the elevator becomes available,
    // considering its current working status and available time
    Elevator.prototype.getTimeUntilAvailable = function () {
        var timeUntilAvailable = 0;
        if (this.isWorking()) {
            timeUntilAvailable = this.timeAvailable - Date.now();
        }
        return timeUntilAvailable;
    };
    //Calculates estimated arrival time to a floor, factoring in availability time and half of the distance.
    Elevator.prototype.getTimeUntilArrived = function (floorNumber) {
        var timeArrivedAsSecond = this.getTimeUntilAvailable() / Settings.milliSecond +
            this.getDistance(floorNumber) * Settings.floorTime;
        return timeArrivedAsSecond;
    };
    return Elevator;
}());
var FloorsFactory = /** @class */ (function () {
    function FloorsFactory() {
    }
    //Creates and returns an array of floor instances
    FloorsFactory.createFloors = function (floorsNumber, parentElement, callBack) {
        var floors = [];
        for (var i = floorsNumber; i >= 0; i--) {
            floors.push(new Floor(i, parentElement, i != floorsNumber, callBack));
        }
        return floors;
    };
    //Creates and returns an array of elevator instances
    FloorsFactory.createElevators = function (elevatorsNumber, parentElement) {
        var elevators = [];
        for (var i = 0; i < elevatorsNumber; i++) {
            elevators.push(new Elevator(parentElement));
        }
        return elevators;
    };
    //Creates and returns a building instance
    FloorsFactory.createBuilding = function (floorsNum, elevatorsNum) {
        return new Building(floorsNum, elevatorsNum);
    };
    //Creates an html element
    FloorsFactory.createHtmlElement = function (element, type, className) {
        element = document.createElement(type);
        element.className = className;
    };
    return FloorsFactory;
}());
var Timer = /** @class */ (function () {
    function Timer(parentElement, callBack) {
        this.callBack = callBack;
        this.divElement = document.createElement("div");
        this.divElement.className = "timer";
        parentElement.appendChild(this.divElement);
    }
    //Sets the timer's counter to a specified time
    Timer.prototype.setCounter = function (newTime) {
        this.counter = newTime;
        this.counting();
    };
    //Starts the timer's countdown, updating the timer's counter every half a second.
    Timer.prototype.counting = function () {
        var _this = this;
        var intervalId = setInterval(function () {
            _this.counter = _this.counter - Settings.decimal;
            var roundedCounter = _this.counter.toFixed(1);
            _this.divElement.textContent = "".concat(roundedCounter);
            if (_this.counter < 0) {
                _this.ending(intervalId);
            }
        }, Settings.reUpdateTime);
    };
    //Ends the timer's countdown and calls the callback function.
    Timer.prototype.ending = function (intervalId) {
        clearInterval(intervalId);
        this.divElement.textContent = "";
        this.callBack();
    };
    return Timer;
}());
var Settings = /** @class */ (function () {
    function Settings() {
    }
    Settings.floorWaitingTime = 2;
    Settings.floorTime = 0.5;
    Settings.milliSecond = 1000;
    Settings.floorSize = 110;
    Settings.blackLineSize = 7;
    Settings.decimal = 0.1;
    Settings.reUpdateTime = 100;
    Settings.buttonPressed = "green";
    Settings.buttonUnPressed = "black";
    return Settings;
}());
function main() {
    var buildings = [];
    for (var i = 0; i < 20; i++) {
        buildings.push(FloorsFactory.createBuilding(3, 20));
    }
}
main();
