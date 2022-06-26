# Page Preview
<div align="center">
    <img src="https://i.imgur.com/YdsFsoa.gif" />
</div>
    
# Purpose
This is a Minesweeper clone based off of Windows 95/98 Minesweeper. It was made using React/Typescript as a project to learn Typescript. (Finished)

There are few problems with this clone:

1. Game loop is not performative because I made the mistake of using 'for' loops when rendering *everything*.
    - On the topic of the game loop - the game does not look as it originally does (square board instead of a rectangular board.) due to how I'm rendering the board and using my ```borderCheck()``` and ```pArr8()``` functions in the ```<Game />``` component. I plan on changing this in the future to look as it did in the original.

2. State management could be better. Currently the state is stored in the ```<Game />``` component as one large object. I don't know if this is a bad idea or not, but it works.

3. Small micro-issues would be with the UI. The buttons are not as interactive as they were in the original version. With a tweaking of CSS and the Dropdown TSX code, it can be changed.

## Install
<a href="https://msc-react.herokuapp.com/" target="_blank">View Site</a>

- Clone repository into directory of your choice.
- (for package dependencies) ``` npm install ``` in installed  directory.
- From CLI, run ``` npm start ``` in installed directory.

## TODO
- Finish ```<Rules />``` component
- Update README.md
- Add animations and styling

#### Cool things to add:

- You can add a component to make the game board draggable. I used [this](https://codesandbox.io/s/condescending-dirac-rxwgx?file=/src/App.js) solution from [here](https://stackoverflow.com/a/39192992/11833883). It does add a neat effect, but I decided it was not worth keeping.
