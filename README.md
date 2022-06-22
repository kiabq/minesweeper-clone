# Page Preview
![ALT-TEXT](https://i.imgur.com/YdsFsoa.gif)

# Purpose
This is a Minesweeper clone based off of Windows 95/98 Minesweeper. It was made using React/Typescript as a project to learn Typescript. (Finished)

There are few problems with this clone:

1. Game loop is not performative because I made the mistake of using 'for' loops when rendering *everything*.

2. State management could be better. Currently the state is stored in the ```<Game />``` component as one large object. I don't know if this is a bad idea or not, but it works.

3. Small micro-issues would be with the UI. The buttons are not as interactive as they were in the original version. With a tweaking of CSS and the Dropdown TSX code, it can be changed.

## Install
- Clone repository into directory of your choice.
- (for package dependencies) ``` npm install ``` in installed  directory.
- From CLI, run ``` npm start ``` in installed directory.

## TODO
- Finish ```<Rules />``` component
- Update README.md
- Add animations and styling

#### Cool things to add:

- You can add a component to the game board to make it draggable. I used [this](https://codesandbox.io/s/condescending-dirac-rxwgx?file=/src/App.js) solution from [here](https://stackoverflow.com/a/39192992/11833883). It does add a neat effect, but I decided it was not worth keeping.
