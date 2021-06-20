// define handtrack.js specifications
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

// define images 
let leftside;
let rightside;
let windowFrontLeft;
let windowBackLeft;
let windowFrontRight;
let windowBackRight;
let doorleft;
let doorritght;

// define static width and height of the car image
const width = 1527;
const height = 1718;

// set start position for the windows 
let flPos  = 362; 
let blPos = 358;
let frPos  = 362;
let brPos = 358;

// define statevalues to toggle windows properly
let triggerA = 2;
let triggerFL = 2;
let triggerBL = 2;
let triggerFR = 2;
let triggerBR = 2;

// define statevalues for window controlls toggle mode
let flState = false;
let blState = false;
let frState = false;
let brState = false;

// define logic values for handtrack predictions and controll calculations 
let isVideo = false; 
let model = null;
let sX = 0, sY = 0; // startcoordinates for the gesture system
let xDif, yDif; // distance between startcoordinates and current hand location
let lastState = '';
let stateHistory = []; // array of last 4 states the system detected

// handtrack.js settings
const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

function startVideo() { // function to plott video
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() { // locic behind video toggle functon
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}

function runDetection() { // function that manages the predicted detections and handeles the window controll
  model.detect(video).then(predictions => { 
      const filteredPredictions = predictions.filter((p) => p.label === 'open' || p.label === 'closed' || p.label === 'point'); // filtering for function we don't need to minimize error margin

      let current; // defining current state of the prediction model
      // ignore empty array filteredPredictions as current is undefined
      if (filteredPredictions.length === 1) current = filteredPredictions[0];
      if (filteredPredictions.length === 2) current = filteredPredictions.sort((a, b) => a.bbox[0] < b.bbox[0])[0]; // evade colision if to hands are visible on cam
      if (current) stateHistory.push(current.label); 
      if (stateHistory.length >= 4) stateHistory = stateHistory.slice(-4) || []; // state history machine to minimize errors by unconfidence and more definite states
      //console.log(stateHistory);
      if (stateHistory.filter((e) => stateHistory[0] === e).length === 4) console.log('tada'); 
      
      const vidW = document.getElementById('myvideo').width; // automatic video formating
      const vidH = document.getElementById('myvideo').height;

      
      if (current) { // making sure current is defined by checking if hand is detected
        if (stateHistory[0] != 'point' && stateHistory[1] != 'point' && stateHistory[2] != 'point' && stateHistory[3] === 'point') {
          sX = current.bbox[0]; // setting startcoordinates when starting to point
          sY = current.bbox[1];
        }

        if (stateHistory.includes('point')){ // as long as u are pointing the code checks if u are trying to activate or deactivate window toggles
          if (xDif <= 30 && xDif >= -30 && yDif <= -50 && triggerA === 0){ // if ur going straight up it will select all windows
            triggerA = 1; // case trigger to toggle it once and not consistantly
            if (!flState || !blState || !frState || !brState){
              flState = true;
              blState = true;
              frState = true;
              brState = true;
            }
          }else if (xDif >= 50 && yDif <= -50 && triggerFR === 0){ // if you go in the upper right directin it will select the front right window
            triggerFR = 1;
            if (!frState){
              frState = true;
            } else {
              frState = false;
            }
          }else if (xDif <= -50 && yDif <= -50 && triggerFL === 0){ // if you go in the upper left directin it will select the front left window
            triggerFL = 1;
            if (!flState){
              flState = true;
            } else {
              flState = false;
            }
          }else if (xDif >= 50 && yDif >= 50 && triggerBR === 0){ // if you go in the bottom right directin it will select the back right window
            triggerBR = 1;
            if (!brState){
              brState = true;
            } else {
              brState = false;
            }
          }else if (xDif <= -50 && yDif >= 50 && triggerBL === 0){ // if you go in the bottom left directin it will select the back left window
            triggerBL = 1;
            if (!blState){
              blState = true;
            } else {
              blState = false;
            }
          }else if(xDif <= 30 && xDif >= -30 && yDif <= 30 && yDif >= -30){ // you can only select another window toggle when you go back somewhere arround the middle
            triggerA = 0;
            triggerFL = 0;
            triggerBL = 0;
            triggerFR = 0;
            triggerBR = 0;
          }
        }
        
        // logics for grabbing the selected windows with the close gesture and pulling it up or down
        if (brState === true && current.label === 'closed' && yDif >25 && brPos <= 446){ 
          brPos++;
        } else if (brState === true && current.label === 'closed' && yDif <-25 && brPos >= 358){
          brPos = brPos - 1;
        }

        if (blState === true && current.label === 'closed' && yDif >25 && blPos <= 446){
          blPos++;
        } else if (blState === true && current.label === 'closed' && yDif <-25 && blPos >= 358){
          blPos = blPos - 1;
        }

        if (frState === true && current.label === 'closed' && yDif >25 && frPos <= 450){
          frPos++;
        } else if (frState === true && current.label === 'closed' && yDif <-25 && frPos >= 362){
          frPos = frPos - 1;
        }

        if (flState === true && current.label === 'closed' && yDif >25 && flPos <= 450){
          flPos++;
        } else if (flState === true && current.label === 'closed' && yDif <-25 && flPos >= 362){
          flPos = flPos - 1;
        }
        xDif = current.bbox[0] - sX; //calculating the distance between the startcoordinates and you current hand location
        yDif = current.bbox[1] - sY;
      }

      
      lastState = current ? current.label : 'none'; // update for the statehistory
      // console.log(predictions);
      model.renderPredictions(predictions, canvas, context, video);
      if (isVideo) {
          requestAnimationFrame(runDetection);
      }
  });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
  // detect objects in the image.
  model = lmodel
  updateNote.innerText = "Loaded Model!"
  trackButton.disabled = false
});

// Load the model.
handTrack.load(modelParams).then(lmodel => {
  // detect objects in the image.
  model = lmodel
  updateNote.innerText = "Loaded Model!"
  trackButton.disabled = false
});

// loading images
function preload() {
  leftside = loadImage('./src/car-left-side.png');
  rightside = loadImage('./src/car-right-side.png');
  windowFrontLeft = loadImage('./src/window-front-left.png');
  windowBackLeft = loadImage('./src/window-back-left.png');
  windowFrontRight = loadImage('./src/window-front-right.png');
  windowBackRight = loadImage('./src/window-back-right.png');
  doorleft = loadImage('./src/door-left.png');
  doorright = loadImage('./src/door-right.png');
}

function setup() {
  createCanvas(width, height);
}

// drawing the images and selection display on the canvas
function draw() {
  noStroke();
  background(220);
  image(leftside, 0, 0);
  image(rightside, 0, 859);
  image(windowFrontLeft, 582, flPos);
  image(windowBackLeft, 842, blPos);
  image(windowFrontRight, 717, frPos+859);
  image(windowBackRight, 460, brPos+859);
  image(doorleft, 577, 356);
  image(doorright, 426, 356+859);
  if(flState) {
    fill(200,0,0);
  } else {
    fill(200);
  }
  ellipse(width/2-20, height/2+80-20, 20, 20);
  if(frState) {
    fill(200,0,0);
  } else {
    fill(200);
  }
  ellipse(width/2+20, height/2+80-20, 20, 20);
  if(blState) {
    fill(200,0,0);
  } else {
    fill(200);
  }
  ellipse(width/2-20, height/2+80+20, 20, 20);
  if(brState) {
    fill(200,0,0);
  } else {
    fill(200);
  }
  ellipse(width/2+20, height/2+80+20, 20, 20);

}