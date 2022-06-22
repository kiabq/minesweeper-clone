import * as React from 'react';
import { useState, useEffect } from 'react';

import WindowControls from './Components/UI/WindowControls';
import Game from './Components/Game/Game';

import styles from './App.module.css';
import borders from './common/css/borders.module.css';

const App = () => {
  // Could use context API / State Management API here and in <Game />.
  const [diff, setDiff] = useState<number>(16);

  return (
      <div className={styles.page}>
        <div className={`${borders.outsideB}`}>
          <div className={styles.windowHeader}>
            <img src={require('./common/images/window_logo.png')} className={styles.windowLogo} />
            <h1 className={styles.windowName}>Minesweeper</h1>
            <div className={styles.windowButtons}>
              <button className={`${styles.windowMinimize} ${borders.outsideB}`}>_</button>
              <button className={`${styles.windowClose} ${borders.outsideB}`} >x</button>
            </div>
          </div>
          <WindowControls diff={diff} setDiff={setDiff}/>
          <Game diff={diff}/>
        </div>
      </div>
  )
}

export default App;