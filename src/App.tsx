import * as React from 'react';
import styles from './App.module.css'

// Initial state shape
interface gameState {
  gArr: Array<number[]>,
  mArr: Set<number>,
  cArr: Array<number | undefined>,
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

function pArr(inputArr: Array<number[]>, value: number) {
  return [      
    inputArr[value - 10],
    inputArr[value - 9],
    inputArr[value - 8],
    inputArr[value - 1],
    inputArr[value + 1],
    inputArr[value + 8],
    inputArr[value + 9],
    inputArr[value + 10]
  ]
}

function borderCheck(inputArr: Array<number[]>, gameArr: Array<number[]>, index: number, inputObj: Set<number> | Array<any>) {
  inputArr.forEach((item: any) => {
    if (item !== undefined) {
      if (gameArr[index][0] === 0 && item[0] - 9 === -1) {
        return;
      } else if (gameArr[index][0] === 8 && item[0] - 1 === -1) {
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

class App extends React.Component<{}, gameState>{
  constructor(props: any) {
    super(props);

    this.state = {
      gArr: [],
      mArr: new Set(),
      cArr: [],
      initialized: false,
      gameOver: false,
    }
  } 

  // Generate gameboard on page load / app mount.
  componentDidMount() {
    window.addEventListener('contextmenu', checkClick);

    let tdaGameboard: number[][] = [];
    let tdaGameboardParameters: number[][] = [[0,1,2,3,4,5,6,7,8], [0,1,2,3,4,5,6,7,8]];

    for (let i = 0; i < tdaGameboardParameters[0].length; i++) {
      for (let j = 0; j < tdaGameboardParameters[1].length; j++) {
        tdaGameboard.push([j, i]);
      }
    }
    
    this.setState({gArr: tdaGameboard});
  };

  componentDidUpdate() {
    console.log("Updated")
  }

  // Cleanup
  componentWillUnmount() {
    window.removeEventListener('contextmenu', checkClick);
  }

  createMines = (sSet: Set<number>, iArr: Array<number[]>, fClick: number) => {
    let posArr = pArr(iArr, fClick);
    let posSet: Set<number> = new Set();
    let rIndex;

    borderCheck(posArr, iArr, fClick, posSet);

    for (let i = 0; i < 10; i++) {
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
    this.setState({mArr: tempStateSet});
  }
  
  initClues = (input: Array<number[]>, tempInput: any, fClick: number) => {
    let clues: gameState["cArr"] = [];
    let tempClues: Array<any>;
    let tempArr;
    let x;
    let index: number;

    input.forEach((item) => {
      index = input.indexOf(item)
      tempArr = pArr(input, index);
      tempClues = [];
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
    let tempArr = clues;
    let tempArr2 = pArr(clueArr, clickValue);
    let x;
    
    for (let i = 0; i < tempArr2.length; i++) {
      let x = clues[clueArr.indexOf(tempArr2[i])];
      if (x === 0) {
        return;
      } else {
        return;
      }
    }

    // tempArr.forEach((item) => {
    //   if (item != undefined) {
    //     tempArr2 = pArr(clueArr, clickValue)
    //     console.log(tempArr2)
    //   }
    // })
  }

  clicked = (gArrPos: number[]) => {
    let gArrPosIndex = this.state.gArr.indexOf(gArrPos);

    if (!this.state.initialized) {
      this.setState({initialized: true});
      this.initMines(this.state.gArr, gArrPosIndex);
    }
  }

  testRender = (item: number) => {
    let index = this.state.cArr[item]
    switch (index) {
      case undefined:
        return `${styles.gridBlack}`;
      case 0: 
        return `${styles.gridGrey}`;
      case 1:
        return `${styles.gridLightOrange}`;
      case 2:
        return `${styles.gridLightRed}`;
      default:
        return `${styles.gridRed}`
    }

    
  }

  render() {
    return (
      <div className={styles.page}>
        <h1>Minesweeper</h1>
        <div className={styles.grid}>
          {this.state.gArr.map((item, index) => {
            return (
              <button 
                className={`${styles.gridItem} ${this.state.initialized && this.testRender(index)}`} 
                name={"g_btn"}
                key={index} 
                onClick={() => this.clicked(item)}>
                {/* {item}{this.state.mArr.has(index) && 1} */}
                {this.state.cArr[index] != 0 && this.state.cArr[index]}
              </button>
            );
          })}
        </div>
      </div>
    )
  }
}

export default App;
