import * as React from 'react';
import { useState, useEffect } from 'react';

import Game from './Components/Game/Game';
import Footer from './Components/UI/Footer';
import { ErrorBoundary } from 'react-error-boundary';

import styles from './App.module.css';

const App = () => {
  const bluescreen = () => {
    throw new Error();
  }

  return (
      <div className={styles.page}>
        <div className={`${styles.outsideB}`}>
          <div className={styles.windowHeader}>
            <img src={require('./common/images/window_logo.png')} className={styles.windowLogo} />
            <h1 className={styles.windowName}>Minesweeper</h1>
            <div className={styles.windowButtons}>
              <button className={`${styles.windowMinimize} ${styles.outsideB}`}>_</button>
              <button onClick={() => bluescreen()}className={`${styles.windowClose} ${styles.outsideB}`} >x</button>
            </div>
          </div>

          <Game />

        </div>
        <Footer />
      </div>
  )
}

export default App;