import * as React from 'react';
import styles from './App.module.css'

// Initial state shape
interface gameArr {
  gArr: Array<number[]>,
  mArr: Set<number>,
  initialized: boolean,
  gameOver: boolean
}

function checkClick(event: any) {
  console.log(event)
  switch(event.type) {
    case "click":
      return 0;
    case "contextmenu":
      window.oncontextmenu = (event) => {
        event.preventDefault();
      }
      return 1;
    default:
      return "Error";
  }
}

class App extends React.Component<{}, gameArr>{

  constructor(props: any) {
    super(props);

    this.state = {
      gArr: [],
      mArr: new Set(),
      initialized: false,
      gameOver: false
    }
  } 

  // Generate gameboard on page load / app mount.
  componentDidMount() {
    let temp: number[][] = [];
    let main: number[][] = [[0,1,2,3,4,5,6,7,8], [0,1,2,3,4,5,6,7,8]];

    for (let i = 0; i < main[0].length; i++) {
      for (let j = 0; j < main[1].length; j++) {
        temp.push([j, i]);
      }
    }
    
    this.setState({gArr: temp});
  };

  createMines = (sSet: Set<number>, iArr: Array<number[]>, fClick: number) => {

    let posArr: Array<number[]> = [
      iArr[fClick - 10],
      iArr[fClick - 9],
      iArr[fClick - 8],
      iArr[fClick - 1],
      iArr[fClick + 1],
      iArr[fClick + 8],
      iArr[fClick + 9],
      iArr[fClick + 10],
    ]

    let posSet = new Set();

    posArr.forEach((item) => {
      if (item != undefined) {
        if (iArr[fClick][0] === 0 && item[0] - 9 === -1) {
          return;
        } else if (iArr[fClick][0] === 8 && item[0] - 1 === -1) {
          return;
        } else {
          posSet.add(iArr.indexOf(item));
        }
      } else if (item == undefined) {
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

  initMines = (inputArr: Array<number[]>, firstClick: number) => {
    let tempStateSet: Set<number> = new Set();
    this.createMines(tempStateSet, inputArr, firstClick);
    this.setState({mArr: tempStateSet});
  }
  
  clicked = (gArrPos: number[], e: any) => {
    let gArrPosIndex = this.state.gArr.indexOf(gArrPos);
    // let mArrPosIndex = this.state.mArr.has(gArrPosIndex);
    console.log(this.state.mArr);
    const mArrPosIndex = (iArr: Set<number>, sVal: number, tVal: number) => {
      if (iArr.has(sVal)) {
        console.log((sVal - tVal) / 9, sVal);
      }
    }

    let testVar = 0;
    checkClick(e);


    if (this.state.initialized) {
      for (let i = 0; i < this.state.gArr.length + 1; i++) {
        mArrPosIndex(this.state.mArr, testVar, gArrPosIndex);
        testVar = testVar + 1;
      }
    }

    if (!this.state.initialized) {
      this.setState({initialized: true});
      this.initMines(this.state.gArr, gArrPosIndex);
    }
  }

  // Map each generated position to own element.
  // onClick returns array that was mapped to that particular element.
  render() {
    return (
      <div className={styles.page}>
        <h1>Minesweeper</h1>
        <div className={styles.grid}>
          {this.state.gArr.map((item, index) => {
            return (
              <button 
                className={`${styles.gridItem} ${this.state.mArr.has(index) && styles.gridMine}`} 
                key={index} 
                onClick={(e) => this.clicked(item, e)} 
                onContextMenu={function(e) {checkClick(e)}}>
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
