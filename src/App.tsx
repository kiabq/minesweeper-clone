import * as React from 'react';
import { useState, useEffect } from 'react';
import Game from './Game/Game';
import Footer from './UI/Footer';

import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.page}>
      <h1>Minesweeper</h1>

      <h2>How to play on Mobile:</h2>
      <ul>
        <li></li>
      </ul>

      <Game />
      <Footer />
    </div>
  )
}

export default App;