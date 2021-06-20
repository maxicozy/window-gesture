const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let leftside;
let rightside;
let windowFrontLeft;
let windowBackLeft;
let windowFrontRight;
let windowBackRight;
let doorleft;
let doorritght;

const width = 1527;
const height = 1718;

let flPos  = 362;
let blPos = 358;
let frPos  = 362;
let brPos = 358;

let flState = false;
let blState = false;
let frState = false;
let brState = false;

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 20, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

function startVideo() {
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

function toggleVideo() {
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

function runDetection() {
  model.detect(video).then(predictions => {
      const filteredPredictions = predictions.filter((p) => p.label === 'open' || p.label === 'closed' || p.label === 'point' || p.label === 'pinch');

      let current;
      // ignore empty array filteredPredictions as current is undefined
      if (filteredPredictions.length === 1) current = filteredPredictions[0];
      if (filteredPredictions.length === 2) current = filteredPredictions.sort((a, b) => a.bbox[0] < b.bbox[0])[0];
      if (current) stateHistory.push(current.label);
      if (stateHistory.length >= 4) stateHistory = stateHistory.slice(-4) || [];
      console.log(stateHistory);
      if (stateHistory.filter((e) => stateHistory[0] === e).length === 4) console.log('tada');
      
      const vidW = document.getElementById('myvideo').width;
      const vidH = document.getElementById('myvideo').height;

      if (current) {

        vX = map(current.bbox[0], 0, vidW, 0, width / 2);
        tX = current.bbox[0];
        vY = map(current.bbox[1], 0, vidH, 0, height / 2);
        tY = current.bbox[1];

        if (current.label === 'closed') {
          eX = width/2;
          eY = height/2;
        }
        
        if (lastState === 'open' && current.label === 'point') {
          startX = vX;
          startY = vY;
        }

        if (lastState === 'point' && current.label === 'open') {
          eX += (vX - startX);
          eY += (vY - startY);
        }
      }


      lastState = current ? current.label : 'none';
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
  if(blState) {
    fill(200,0,0);
  } else {
    fill(200);
  }
  ellipse(width/2+20, height/2+80-20, 20, 20);
  if(frState) {
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