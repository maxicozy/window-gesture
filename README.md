# window-gesture

is a small concept and prototype for controlling windows in a car with gestures

## Used Software

To test the gesture control, we used some illustrations of a car rendered in p5.js, 
so we could easily simulate opening/closing windows

The different gestures are recognized and tracked by handtrack.js

## Installation

Download or clone the Code, Unzip the folder and enter the folder in your console

Then install the necessary dependencies with `npm i`

## Used Gestures

Using the ```point``` gesture, the windows can be selected individually by moving the 
hand currently performing the `point` gesture to the four corners of the captured video.


Corners and Windows correspond as so:

- top left corner = front left window

- bottom left corner = back left window

- top right corner = front right window

- bottom right corner = back right window


Then, moving up a hand performing the `closed` gesture will close all selected windows, 
while moving a `closed` hand downwards will cause all currently selected windows to open.


