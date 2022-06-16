import * as React from 'react';
import styles from './Game.module.css'

// Initial state shape
interface GameState {
  gArr: Array<number[]>,
  cArr: Array<number | undefined>,
  mSet: Set<number>,
  fSet: Set<number>,
  rArr: Array<any>,
  initialized: boolean,
  gameOver: boolean
}

function checkClick(event: any) {
  switch(event.target.name) {
    case "g_btn":
      event.preventDefault();
      break;
    default:
      break;
  }
}

let tdaGameboardParameters: number[][] = [[0,1,2,3,4,5,6,7,8,9],[0,1,2,3,4,5,6,7,8,9]];
let tempMines = 18;

function pArr8(inputArr: Array<number[]>, value: number) {
  // This Function checks all eight indexes around the index passed, as well as 
  /* 

    Would return something like this:

    [10, 11, 12, 19, 21, 28, 29, 30]

    Broken down, it would look like this:

    Top: [10, 11, 12]
    Middle: [19, 21]
    Bottom: [28, 29, 30]

    The middle array is missing the value that was entered because it --
    we are only checking the eight indexes around the i

  */

  let gameboardLength = tdaGameboardParameters[0].length;
  
  let sides = {
    topL_botR: gameboardLength + 1,
    topM_botM: gameboardLength,
    topR_botL: gameboardLength - 1,
  }

  return [      
    inputArr[value - sides.topL_botR], // Top Left Square
    inputArr[value - sides.topM_botM], // Top Middle Square
    inputArr[value - sides.topR_botL], // Top Right Square
    inputArr[value - 1], // Center Left Square
    inputArr[value + 1], // Center Right Square
    inputArr[value + sides.topR_botL], // Bottom Left Square
    inputArr[value + sides.topM_botM], // Bottom Middle Square
    inputArr[value + sides.topL_botR] // Bottom Right Square
  ]
}

function borderCheck(inputArr: Array<number[]>, gameArr: Array<number[]>, index: number, inputObj: Set<number> | Array<any>) {
  let selectedIndex = gameArr[index][0];

  inputArr.forEach((item: any) => {
    if (item !== undefined) {
      if (selectedIndex === 0 && item[0] - tdaGameboardParameters[0].length === -1) {
        return;
      } else if (selectedIndex === 9 && item[0] - 1 === -1) {
        return;
      } else if (inputObj instanceof Set) {
        inputObj.add(gameArr.indexOf(item));
      } else {
        inputObj.push(gameArr.indexOf(item));
      }
    } else if (item === undefined) {
      return;
    }
  })
}

class Game extends React.Component<{}, GameState>{
  constructor(props: any) {
    super(props);

    this.state = {
      gArr: [],
      cArr: [],
      rArr: [],
      mSet: new Set(),
      fSet: new Set(),
      initialized: false,
      gameOver: false,
    }
  } 

  // Generate gameboard on page load / app mount.
  componentDidMount() {
    window.addEventListener('contextmenu', checkClick);

    let tdaGameboard: number[][] = [];

    for (let i = 0; i < tdaGameboardParameters[0].length; i++) {
      for (let j = 0; j < tdaGameboardParameters[1].length; j++) {
        tdaGameboard.push([j, i]);
      }
    }
    
    this.setState({gArr: tdaGameboard});
    tdaGameboard = [];
  };

  componentDidUpdate() {
    console.log(this.state.fSet, this.state.mSet)
  }

  // Cleanup
  componentWillUnmount() {
    window.removeEventListener('contextmenu', checkClick);
  }

  createMines = (sSet: Set<number>, iArr: Array<number[]>, fClick: number) => {
    let posArr = pArr8(iArr, fClick);
    let posSet: Set<number> = new Set();
    let rIndex;

    borderCheck(posArr, iArr, fClick, posSet);

    for (let i = 0; i < tempMines; i++) {
      rIndex = Math.floor(Math.random() * iArr.length);
      if (rIndex === fClick || sSet.has(rIndex) || posSet.has(rIndex)) {
        i--;
      } else {
        sSet.add(rIndex);
      }
    }
  }

  initMines = (gameboardArr: Array<number[]>, fClick: number) => {
    let tempStateSet: Set<number> = new Set();
    this.createMines(tempStateSet, gameboardArr, fClick);
    this.initClues(gameboardArr, tempStateSet, fClick);
    this.setState({mSet: tempStateSet});
  }
  
  initClues = (input: Array<number[]>, tempInput: any, fClick: number) => {
    let clues: GameState["cArr"] = [];
    let tempClues: Array<any>;
    let index: number;
    let tempArr, x;

    input.forEach((item) => {
      index = input.indexOf(item);
      tempClues = [];
      tempArr = pArr8(input, index);
      x = 0;

      borderCheck(tempArr, input, index, tempClues);

      if (tempInput.has(index)) {
        clues.push(undefined);
      } else {
        for (let i = 0; i < tempClues.length; i++) {
          if (tempInput.has(tempClues[i]) === true) {
            x++;
          }
        }
        clues.push(x);
      }
    })

    this.setState({cArr: clues});
    this.sweepMines(input, fClick, clues);
  }

  sweepMines = (clueArr: Array<number[]>, clickValue: number, clues: Array<number | undefined>) => {
    let set: Set<number> = new Set();
    let tempArr3: Array<any>, tempArr4: Array<any> = [];
    let initBool: boolean = this.state.initialized;

    set.add(clickValue);
    tempArr3 = this.state.rArr;

    function sweep(value: number, initialized?: boolean) {
      let x = pArr8(clueArr, value);
      let y: Array<any> = [];
      borderCheck(x, clueArr, value, y);

      if (initialized)  {
        switch (clues[value]) {
          case undefined:
            console.log("Game Over");
            break;
          default: 
            y = [value];
        }
      }

      y.forEach((item) => {
        let bar = clues[item]
        if (bar === 0) {
          if (tempArr3.indexOf(item) === -1) {
            tempArr3.push(item);
            sweep(item);
          }
        } else if (bar === undefined) {
          return;
        } else {
          set.add(item);
          return;
        }
      })
    }

    sweep(clickValue, initBool);

    tempArr3.forEach((item) => {
      set.add(item);
    })

    let iterator: any = set.entries();
    for (const entry of iterator) {
      tempArr4.push(entry[0]);
    }

    tempArr4.sort()
    this.setState({rArr: tempArr4});
  }
  
  flagged = (index: number) => {
    let flagAmount = tempMines;
    let tempFlagSet: Set<number> = this.state.fSet;

    tempFlagSet.add(index);
    this.setState({fSet: tempFlagSet});
  }

  clicked = (gArrPos: number[]) => {
    let gArrPosIndex = this.state.gArr.indexOf(gArrPos);

    if (this.state.initialized) {
      this.sweepMines(this.state.gArr, gArrPosIndex, this.state.cArr);
    }

    if (!this.state.initialized) {
      this.setState({initialized: true});
      this.initMines(this.state.gArr, gArrPosIndex);
    }
  }

  testRender = (item: number) => {
    let index;

    if (this.state.rArr.indexOf(item) >= 0) {
      index = this.state.cArr[item];
      
      if (index === 0) {
        return `${styles.gridGrey}`;
      } else {
        switch (index) {
          case 1:
            return `${styles.gridLightOrange}`;
          case 2: 
            return `${styles.gridLightRed}`;
          case undefined:
            return `${styles.gridBlack}`;
          default:
            return `${styles.gridRed}`;
        }
      }
    }
  }

  render() {
    return (
        <div className={styles.grid}>
          {this.state.gArr.map((item, index) => {
            return (
              <button 
                className={`${styles.gridItem} ${this.state.initialized && this.testRender(index)}`} 
                name={"g_btn"}
                key={index} 
                onClick={() => this.clicked(item)}
                onContextMenu={() => this.flagged(this.state.gArr.indexOf(item))}
                >
                {this.state.rArr.indexOf(index) >= 0 && this.state.cArr[index] != 0 && this.state.cArr[index]}
              </button>
            );
          })}
        </div>
    )
  }
}

export default Game;