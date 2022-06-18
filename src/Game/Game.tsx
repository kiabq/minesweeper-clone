import * as React from 'react';

import styles from './Game.module.css';
import GameFinish from './GameFinish';

// Initial state shape
interface GameState {
  gArr: Array<number[]>,
  cArr: Array<number | undefined>,
  mSet: Set<number>,
  fArr: Array<number[]>,
  rArr: Array<any>,
  initialized: boolean,
  gameOver: boolean,
  flagAmount: number,
  minesAmount: number,
}

function checkClick(event: any) {
  switch(event.target.id) {
    case "d_ctx":
      console.log(event.target)
      event.preventDefault();
      break;
    default:
      console.log(event)
      break;
  }
}

// This needs changed (very important!)
let tdaGameboardParameters: Array<number[]> = [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]];

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
      } else if (selectedIndex === tdaGameboardParameters[0].length - 1 && item[0] - 1 === -1) {
        return;
      } else if (inputObj instanceof Set) {
        inputObj.add(gameArr.indexOf(item));{
      
        }
      } else {
        inputObj.push(gameArr.indexOf(item));
      }
    } else if (item === undefined) {
      return;
    }
  })
}

function arraysEqual(a: Array<number>, b: Array<number>) {
  let tempA = a;
  let tempB = b;

  tempA.sort((a, b) => a - b);
  tempB.sort((a, b) => a - b);

  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (tempA[i] !== tempB[i]) return false;
  }

  return true;
}

// const initialState: GameState = {
//   gArr: [],
//   cArr: [],
//   mSet: new Set(),
//   fArr: [[],[]],
//   rArr: [],
//   initialized: false,
//   gameOver: false,
//   flagAmount: 15,
//   minesAmount: 15,
// }

class Game extends React.Component<{}, GameState>{
  constructor(p: {}) {
    super(p);

    this.state = {
      gArr: [],
      cArr: [],
      rArr: [],
      mSet: new Set(),
      fArr: [[],[]],
      initialized: false,
      gameOver: false,
      flagAmount: 40,
      minesAmount: 40,
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
  };

  componentDidUpdate() {
    if (this.state.initialized && this.state.gameOver === false && arraysEqual(this.state.fArr[0], Array.from(this.state.mSet)) && this.state.flagAmount === 0) {
      this.gameOver();
    }
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

    for (let i = 0; i < this.state.minesAmount; i++) {
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
    let cluesAmount: number;

    let tempArr;

    input.forEach((item) => {
      index = input.indexOf(item);
      tempClues = [];
      tempArr = pArr8(input, index);
      cluesAmount = 0;
      
      borderCheck(tempArr, input, index, tempClues);

      if (tempInput.has(index)) {
        clues.push(undefined);
      } else {
        for (let i = 0; i < tempClues.length; i++) {
          if (tempInput.has(tempClues[i]) === true) {
            cluesAmount++; 
          }
        }
        clues.push(cluesAmount);
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
            return;
          default: 
            y = [value];
        }
      }

      y.forEach((item) => {
        let bar = clues[item];
        
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

    tempArr4.sort();
    this.setState({rArr: tempArr4});
  }
  
  flagged = (index: number, unflipCheck?: boolean) => {
    let tempFlagArr = this.state.fArr;   
    let flagIndexOf = tempFlagArr[0].indexOf(index);
    let unflippedIndexOf = tempFlagArr[1].indexOf(index);

    if (unflipCheck) {
      tempFlagArr[1].splice(unflippedIndexOf, 1);
    } else {
      if (flagIndexOf > -1) {
        tempFlagArr[0].splice(flagIndexOf, 1);
        this.setState({flagAmount: this.state.flagAmount + 1})
      } else if (this.state.rArr.indexOf(index) === -1) {
        if (this.state.flagAmount > 0) {
          tempFlagArr[0].push(index);
          tempFlagArr[1].push(index);
          this.setState({flagAmount: this.state.flagAmount - 1})
        }
      } 
    }

    this.setState({fArr: tempFlagArr});
  }

  gameOver = () => {
    this.setState({gameOver: true});
  }

  clicked = (gArrPos: number[]) => {
    let gArrPosIndex = this.state.gArr.indexOf(gArrPos);
    let flagCheckArr = this.state.fArr[0].indexOf(gArrPosIndex);
    let unflippedCheckArr = this.state.fArr[1].indexOf(gArrPosIndex);

    if (this.state.mSet.has(gArrPosIndex)) {
      this.setState({gameOver: true});
    }

    if (flagCheckArr > -1) {
      return;
    } else {
      if (flagCheckArr === -1 && unflippedCheckArr > -1) {
        this.flagged(gArrPosIndex, true);
      }

      if (this.state.initialized) {
        this.sweepMines(this.state.gArr, gArrPosIndex, this.state.cArr);
      }

      if (!this.state.initialized) {
        this.setState({initialized: true});
        this.initMines(this.state.gArr, gArrPosIndex);
      }
    }
  }

  colorRender = (item: number) => {
    let index = this.state.cArr[item];

    if (this.state.gameOver) {
      switch (index) {
        case undefined:
          if (this.state.fArr[0].indexOf(item) > -1) {
            return `${styles.gridBombFlagged}`;
          } else {
            return `${styles.gridBomb}`;
          }
      }
    }

    if (this.state.fArr[0].indexOf(item) > -1) {
      return `${styles.gridFlagged}`
    } else if (this.state.fArr[1].indexOf(item) > -1) {
      return `${styles.gridItem}`
    } else {
      if (this.state.rArr.indexOf(item) >= 0) {
        if (index === 0) {
          return `${styles.gridGrey}`;
        } else {
          switch (index) {
            case 1:
              return `${styles.gridOneMine}`;
            case 2: 
              return `${styles.gridTwoMine}`;
            case 3:
              return `${styles.gridThreeMine}`;
            case 4:
              return `${styles.gridFourMine}`;
            case 5:
              return `${styles.gridFiveMine}`;    
            case 6:
              return `${styles.gridSixMine}`;
            case 7:
              return `${styles.gridSevenMine}`;
            case 8:
              return `${styles.gridEightMine}`;    
          }
        }
      } else {
        return `${styles.gridItem}`
      }
    }

    // DEBUGGING MINES
    // if (this.state.initialized && this.state.gameOver) {
    //   switch (index) {
    //     case undefined:
    //       return `${styles.gridBlack}`;
    //   }
    // }
  }

  render() {
    return (
      <div className={styles.board} id={"d_ctx"} >
        <div className={styles.gridHeader}>
          <p>{this.state.flagAmount}</p>
          {/* <button>Reset</button>
          <p>0</p> */}
        </div>

        <div className={styles.grid}>
          {this.state.gArr.map((item, index) => {
            return (
              <button 
                className={`${this.colorRender(index)}`} 
                id={"d_ctx"}
                key={index}
                onClick={() => this.clicked(item)}
                onContextMenu={() => this.flagged(this.state.gArr.indexOf(item))}
                disabled={this.state.gameOver}
                > 
              </button>
            );
          })}
        </div>
          
       <GameFinish winCondition={arraysEqual(this.state.fArr[0], Array.from(this.state.mSet)) && this.state.flagAmount === 0} isGameOver={this.state.gameOver}/>
      </div>
    )
  }
}

export default Game;
