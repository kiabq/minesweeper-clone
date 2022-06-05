import { fireEvent } from '@testing-library/react';
import { table } from 'console';
import { fchmod } from 'fs';
import * as React from 'react';
import styles from './App.module.css'

// Initial state shape
interface gameArr {
  gArr: Array<number[]>,
  mArr: Set<number>,
  initialized: boolean
}

function checkClick(event: any) {
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
      initialized: false
    }
  } 

  // Generate gameboard on page load / app mount.
  componentDidMount() {
    let temp: number[][] = [];
    let main: number[][] = [[0,1,2,3,4,5,6,7,8],[0,1,2,3,4,5,6,7,8]];

    for (let i = 0; i < main[0].length; i++) {
      for (let j = 0; j < main[1].length; j++) {
        temp.push([i, j, 0]);
      }
    }
    
    this.setState({gArr: temp});
  };

  // componentDidUpdate() {
  //   console.log(this.state)
  // }

  createMines = (sSet: Set<number>, iArr: Array<number[]>, fClick: number) => {
    for (let i = 0; i < 10; i++) {
      let rIndex = Math.floor(Math.random() * iArr.length);
      if (rIndex === fClick || sSet.has(rIndex)) {
        i--;
      } else {
        sSet.add(rIndex);
      }
    }
  }

  // TODO: initialize mines on first board click.
  initMines = (inputArr: Array<number[]>, firstClick: number) => {
    let bax: Set<number> = new Set();

    this.createMines(bax, inputArr, firstClick);
    this.setState({mArr: bax});
  }

  // TODO: initialize mines and check against mines/clues array.
  // TODO: Make clues array
  
  clicked = (gArrPos: number[], e: any) => {
    let gArrPosIndex = this.state.gArr.indexOf(gArrPos);
    let mArrPosIndex = this.state.mArr.has(gArrPosIndex);

    // console.log(this.state.gArr, this.state.mArr)
    // console.log(gArrPosIndex, mArrPosIndex)

    // if (this.state.mArr.indexOf(gArrPosIndex) != -1) {
    //   console.log(this.state.gArr[gArrPosIndex][2])
    // }

    checkClick(e);

    if (this.state.initialized) {

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
      <div className={styles.grid}>
        {this.state.gArr.map((item, index) => {
          return (
            <button className={`${styles.gridItem} ${this.state.mArr.has(index) && styles.gridMine}`} key={index} onClick={(e) => this.clicked(item, e)} onContextMenu={function(e) {checkClick(e)}}>
              {this.state.mArr.has(index) && 1}
            </button>
          );
        })}
      </div>
    )
  }
}

export default App;
