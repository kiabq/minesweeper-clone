import * as React from 'react';

import styles from './Game.module.css';
import borders from '../../common/css/borders.module.css';

// Initial state shape
// TODO:
// Use difficulty setting to adjust flagAmount, minesAmount, and boardSize.
interface GameState {
  gArr: Array<number[]>,
  cArr: Array<number | undefined>,
  mSet: Set<number>,
  fArr: Array<number[]>,
  rArr: Array<any>,
  initialized: boolean,
  gameOver: boolean,
  boardSize: number,
  timer: number,
  intervalID: ReturnType<typeof setInterval> | 0,
  flagAmount: number,
  minesAmount: number,
  lClick: number | null,
  setWin: boolean
}

function setVal(arg: number) {
  switch (arg) {
    case 9:
      return 16;
    case 16:
      return 50;
    case 20:
      return 70; 
    case 25:
      return 120;
    default: 
      return 50;
  }
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

class Game extends React.Component<{diff: number}, GameState>{
  constructor(p: any) {
    super(p);

    this.state = {
      gArr: [],
      cArr: [],
      rArr: [],
      mSet: new Set(),
      fArr: [[],[]],
      initialized: false,
      gameOver: false,
      boardSize: this.props.diff,
      flagAmount: setVal(this.props.diff),
      minesAmount: setVal(this.props.diff),
      timer: 0,
      intervalID: 0,
      lClick: null,
      setWin: false
    }
  } 

  // Generate gameboard on page load / app mount.
  componentDidMount() {
    this.makeBoard(this.state.boardSize, [] as Array<number[]>);
  };

  componentDidUpdate() {
    if (this.state.timer > 999) {
      this.setState({timer: 999});
      this.gameOver();
    }

    if (this.state.initialized && this.state.gameOver === false && arraysEqual(this.state.fArr[0], Array.from(this.state.mSet)) && this.state.flagAmount === 0 && this.state.rArr.length === this.state.gArr.length - this.state.minesAmount) {
      this.gameOver();
      this.setState({setWin: true});
    }

    if (this.state.boardSize != this.props.diff) {
      this.makeBoard(this.props.diff, [] as Array<number[]>);
      this.reset();
    }
  }

  // Cleanup
  componentWillUnmount() {}
  
  makeBoard = (parameters: number, arg: Array<any>) => {
    for (let i = 0; i < parameters; i++) {
      for (let j = 0; j < parameters; j++) {
        arg.push([j, i]);
      }
    }

    this.setState({gArr: arg});
  }

  pArr8(inputArr: Array<number[]>, value: number) {
    // This Function checks all eight indexes around the index passed, as well as 
    /* 
  
      Would return something like this:
  
      [10, 11, 12, 19, 21, 28, 29, 30]
  
      Broken down, it would look like this:
  
      Top: [10, 11, 12]
      Middle: [19, 21]
      Bottom: [28, 29, 30]
  
      The middle array is missing the value that was entered because --
      we are only checking the eight indexes around the i
  
    */
  
    let gLength = this.state.boardSize;
    
    let sides = {
      topL_botR: gLength + 1,
      topM_botM: gLength,
      topR_botL: gLength - 1,
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

  borderCheck(inputArr: Array<number[]>, gameArr: Array<number[]>, index: number, inputObj: Set<number> | Array<any>): void {
    let selectedIndex = gameArr[index][0];

    inputArr.forEach((item: any) => {
      if (item !== undefined) {
        if (selectedIndex === 0 && item[0] - this.state.boardSize === -1) {
          return;
        } else if (selectedIndex === this.state.boardSize - 1 && item[0] - 1 === -1) {
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

  handleTimer = () => {
    const interval = setInterval(() => {
      this.setState({timer: this.state.timer + 1});
    }, 1000);
  
    this.setState({intervalID: interval});
  }

  createMines = (sSet: Set<number>, iArr: Array<number[]>, fClick: number) => {
    let posArr = this.pArr8(iArr, fClick);
    let posSet: Set<number> = new Set();
    let rIndex;

    this.borderCheck(posArr, iArr, fClick, posSet);

    for (let i = 0; i < this.state.minesAmount; i++) {
      rIndex = Math.floor(Math.random() * iArr.length);
      if (rIndex === fClick || sSet.has(rIndex) || posSet.has(rIndex)) {
        i--;
      } else {
        sSet.add(rIndex);
      }
    }
  }

  initMines = (gameboardArr: Array<number[]>, fClick: number): void => {
    let tempStateSet: Set<number> = new Set();

    this.createMines(tempStateSet, gameboardArr, fClick);
    this.initClues(gameboardArr, tempStateSet, fClick);
    this.setState({mSet: tempStateSet});
  }
  
  initClues = (input: Array<number[]>, tempInput: any, fClick: number): void => {
    let clues: GameState["cArr"] = [];
    let tempClues: Array<any>;
    let index: number;
    let cluesAmount: number;

    let tempArr;

    input.forEach((item) => {
      index = input.indexOf(item);
      tempClues = [];
      tempArr = this.pArr8(input, index);
      cluesAmount = 0;
      
      this.borderCheck(tempArr, input, index, tempClues);

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

  sweepMines = (clueArr: Array<number[]>, clickValue: number, clues: Array<number | undefined>): void => {
    let set: Set<number> = new Set();
    let tempArr3: Array<any>, tempArr4: Array<any> = [];

    let state = this.state;
    let dpArr8 = (arg1: number[][], arg2: number) => this.pArr8(arg1, arg2)
    let dborderCheck = (arg1: number[][], arg2: number[][], arg3: number, arg4: Set<number> | Array<number>) => this.borderCheck(arg1, arg2, arg3, arg4)

    set.add(clickValue);
    tempArr3 = this.state.rArr;

    function sweep(value: number, initialized?:boolean) {
      if (state.fArr[0].indexOf(value) > -1) {
        return;
      }

      let x = dpArr8(clueArr, value);
      let y: Array<any> = [];
      dborderCheck(x, clueArr, value, y);

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

    sweep(clickValue, this.state.initialized);

    tempArr3.forEach((item) => {
      set.add(item);
    })

    let iterator: any = set.entries();
    for (const entry of iterator) {
      if (this.state.fArr[0].indexOf(entry[0]) === -1) {
        tempArr4.push(entry[0]);
      }
    }

    tempArr4.sort();
    this.setState({rArr: tempArr4});
  }
  
  flagged = (index: number, event: React.MouseEvent<HTMLButtonElement> | null, unflipCheck?: boolean, ) => {
    event?.preventDefault();

    let tempFlagArr = this.state.fArr;   
    let flagIndexOf = tempFlagArr[0].indexOf(index);
    let unflippedIndexOf = tempFlagArr[1].indexOf(index);

    if (unflipCheck) {
      tempFlagArr[1].splice(unflippedIndexOf, 1);
    } else if (!this.state.gameOver) {
      if (flagIndexOf > -1) {
        tempFlagArr[0].splice(flagIndexOf, 1);
        this.setState({flagAmount: this.state.flagAmount + 1});
      } else if (this.state.rArr.indexOf(index) === -1) {
        if (this.state.flagAmount > 0) {
          tempFlagArr[0].push(index);
          if (this.state.fArr[1].indexOf(index) === -1) {
            tempFlagArr[1].push(index);
          }
          this.setState({flagAmount: this.state.flagAmount - 1})
        }
      } 
    }

    this.setState({fArr: tempFlagArr});
  }

  gameOver = () => {
    this.setState({gameOver: true});
    clearInterval(this.state.intervalID);
  }

  clicked = (gArrPos: number[]) => {
    let gArrPosIndex = this.state.gArr.indexOf(gArrPos);
    let flagCheckArr = this.state.fArr[0].indexOf(gArrPosIndex);
    let unflippedCheckArr = this.state.fArr[1].indexOf(gArrPosIndex);

    if (flagCheckArr === - 1 && this.state.mSet.has(gArrPosIndex)) {
      this.gameOver();
      this.setState({lClick: gArrPosIndex});
    }

    if (flagCheckArr > -1) {
      return;
    } else {
      if (flagCheckArr === -1 && unflippedCheckArr > -1) {
        this.flagged(gArrPosIndex, null, true);
      }

      if (this.state.initialized) {
        this.sweepMines(this.state.gArr, gArrPosIndex, this.state.cArr);
      }

      if (!this.state.initialized) {
        this.setState({initialized: true});
        this.initMines(this.state.gArr, gArrPosIndex);
        this.handleTimer();
      }
    }
  }

  reset = () => {
    clearInterval(this.state.intervalID);
    this.setState({
      cArr: [],
      rArr: [],
      fArr: [[],[]],
      mSet: new Set(), 
      initialized: false, 
      gameOver: false,
      boardSize: this.props.diff,
      flagAmount: setVal(this.props.diff),
      minesAmount: setVal(this.props.diff),
      timer: 0,
      intervalID: 0,
      lClick: null,
      setWin: false
    });
  }

  gridSize = () => {
    switch (this.state.boardSize) {
      case 9:
        return `${styles.gridSizeE}`;
      case 16:
        return `${styles.gridSizeM}`;
      case 20:
        return `${styles.gridSizeL}`;
      case 25:
        return `${styles.gridSizeVL}`;
      default:
        return `${styles.gridSizeM}`;
    }
  }

  colorRender = (item: number) => {
    let index = this.state.cArr[item];

    if (this.state.gameOver) {
      switch (index) {
        case undefined:
          if (this.state.fArr[0].indexOf(item) > -1) {
            return `${styles.gridBombFlagged}`;
          } else if (item === this.state.lClick) {
            return `${styles.gridBombExploded}`;
          } else {
            return `${styles.gridBomb}`;
          }

      }
    }

    if (this.state.fArr[0].indexOf(item) > -1) {
      return `${styles.gridFlagged}`
    }     

    if (this.state.rArr.indexOf(item) === -1 && this.state.fArr[1].indexOf(item) > -1) {
      return `${styles.gridUnflipped}`
    } else {
      if (this.state.rArr.indexOf(item) >= 0) {
        if (index === 0) {
          return `${styles.gridFlipped}`;
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
        return `${styles.gridUnflipped}`
      }
    }
  }

  switchVals = (val: number) => {
    switch (val) {
      case 0:
        return `${styles.gridNumberZero}`;
      case 1:
        return `${styles.gridNumberOne}`;
      case 2:
        return `${styles.gridNumberTwo}`;
      case 3:
        return `${styles.gridNumberThree}`;
      case 4:
        return `${styles.gridNumberFour}`;
      case 5:
        return `${styles.gridNumberFive}`;
      case 6:
        return `${styles.gridNumberSix}`;
      case 7:
        return `${styles.gridNumberSeven}`;
      case 8:
        return `${styles.gridNumberEight}`;
      case 9:
        return `${styles.gridNumberNine}`;
    }
  }

  digitRender = (state: number) => {
    let d_3: number = Math.floor((state / 100) % 10);
    let d_2: number = Math.floor((state / 10) % 10);
    let d_1: number = Math.floor((state/ 1) % 10);
    let cases: Array<string> = ['h', 't', 'o'];
    let rVal1, rVal2, rVal3;

    for (let i = 0; i < cases.length; i++) {
      switch (cases[i]) {
        case 'h':
          rVal1 = this.switchVals(d_3);
          break;
        case 't':
          rVal2 = this.switchVals(d_2);
          break;
        case 'o':
          rVal3 = this.switchVals(d_1);
          break;
        default:
          return null;
      }
    }

    return (
      <>
        <div className={`${styles.gridNumberHW} ${rVal1}`} />
        <div className={`${styles.gridNumberHW} ${rVal2}`} />
        <div className={`${styles.gridNumberHW} ${rVal3}`} />
      </>
    );
  }

  resetRender = () => {
    if (this.state.setWin) {
      return `${styles.resetWin}`;
    } else if (this.state.gameOver) {
      return `${styles.resetDead}`;
    } else {
      return `${styles.reset}`;
    }
  }

  render() {
    return (
      <div className={styles.board} >
        <div className={`${styles.gridHeader} ${borders.insideB}`}>

          <div className={`${styles.gridHeaderFlags} `}>
            <div className={`${borders.insideB}`}>
              {this.digitRender(this.state.flagAmount)}  
            </div>
          </div>

          <div className={`${styles.gridHeaderReset}`}>
            <button onClick={this.reset} className={`${styles.resetHW} ${this.resetRender()}`}></button>
          </div>

          <div className={`${styles.gridHeaderTimer}`}>
            <div className={`${borders.insideB}`}>
              {this.digitRender(this.state.timer)}
            </div>
          </div>

        </div>

        <div className={`${borders.insideB} ${styles.grid} ${this.gridSize()}`}>
          {this.state.gArr.map((item, index) => {
            return (
              <button 
                className={`${this.colorRender(index)}`} 
                key={index}
                onClick={() => {this.clicked(item)}}
                onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => this.flagged(this.state.gArr.indexOf(item), e)}
                disabled={this.state.gameOver}
                >
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Game;
