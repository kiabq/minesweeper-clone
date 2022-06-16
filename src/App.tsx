import * as React from 'react';
import { useState, useEffect } from 'react';
import Game from './Game/Game';

import styles from './App.module.css'

const App = () => {
  return (
    <div className={styles.page}>
      <h1>Minesweeper</h1>

      <Game />
    </div>
  )
}

export default App;