import * as React from 'react';
import styles from './App.module.css'

// Initial state shape
interface gameArr {
  gArr: Array<number[]>,
  mArr: Set<number>,
  cArr: Array<number>,
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

class App extends React.Component<{}, gameArr>{

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

    let temp: number[][] = [];
    let main: number[][] = [[0,1,2,3,4,5,6,7,8], [0,1,2,3,4,5,6,7,8]];

    for (let i = 0; i < main[0].length; i++) {
      for (let j = 0; j < main[1].length; j++) {
        temp.push([j, i]);
      }
    }
    
    this.setState({gArr: temp});
  };

  // Cleanup
  componentWillUnmount() {
    window.removeEventListener('contextmenu', checkClick);
  }

  createMines = (sSet: Set<number>, iArr: Array<number[]>, fClick: number) => {

    let posArr = pArr(iArr, fClick);
    let posSet = new Set();

    posArr.forEach((item) => {
      if (item !== undefined) {
        if (iArr[fClick][0] === 0 && item[0] - 9 === -1) {
          return;
        } else if (iArr[fClick][0] === 8 && item[0] - 1 === -1) {
          return;
        } else {
          posSet.add(iArr.indexOf(item));
        }
      } else if (item === undefined) {
        return;
      }
    })

    for (let i = 0; i < 10; i++) {
      let rIndex = Math.floor(Math.random() * iArr.length);
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
    this.setState({mArr: tempStateSet});
    this.initClues(this.state.gArr, tempStateSet, fClick);
  }
  
  initClues = (input: Array<number[]>, tempInput: any, fClick: number) => {
    let clues = [];

    input.forEach((item) => {
      let index = input.indexOf(item);
      if (tempInput.has(index)) {
        console.log(index, "mine")
        return;
      } else {
        let tempArr = pArr(input, index);
        let x = 0;
        console.log(tempArr)
        for (let i = 0; i < tempArr.length; i++) {
          if (tempInput.has(tempArr[i])) {
            x += 1;
            console.log(x);
          }
        }

        x = 0;
      }
    })
  }

  clicked = (gArrPos: number[]) => {
    let gArrPosIndex = this.state.gArr.indexOf(gArrPos);

    if (!this.state.initialized) {
      this.setState({initialized: true});
      this.initMines(this.state.gArr, gArrPosIndex);
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
                className={`${styles.gridItem} ${this.state.mArr.has(index) && styles.gridMine}`} 
                name={"g_btn"}
                key={index} 
                onClick={() => this.clicked(item)}>
                {item}{this.state.mArr.has(index) && 1}
              </button>
            );
          })}
        </div>
      </div>
    )
  }
}

export default App;
