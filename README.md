# window-gesture

is a small concept and prototype for controlling windows in a car with gestures

## Used Software

To test the gesture control, we used some illustrations of a car rendered in p5.js, 
so we could easily simulate opening/closing windows

The different gestures are recognized and tracked by handtrack.js

## Installation

Download or clone the Code, Unzip the folder and enter the folder in your console.
For convenience, loading the html file on a live server is recommended, especially for development purposes

## Used Gestures

The windows can be selected individually, by moving the 
hand currently performing handtrack.js' `point` gesture to the four corners of the captured video.


Corners and Windows correspond as so:

- top left corner = front left window

- bottom left corner = back left window

- top right corner = front right window

- bottom right corner = back right window



Then, moving a hand performing the `closed` gesture upwards will close all selected windows, 
while moving a `closed` hand downwards will cause all currently selected windows to open.


![Gesture-onepager](https://user-images.githubusercontent.com/57222054/122685831-2a8a1680-d20e-11eb-9b0d-a8adc4fd7dff.png)




# How it work

https://user-images.githubusercontent.com/57222054/122724947-c2bae680-d274-11eb-8ada-cb01026c4079.mp4
