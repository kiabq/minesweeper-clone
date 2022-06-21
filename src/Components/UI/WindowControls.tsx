import * as React from 'react';
import { useState, useEffect, useReducer, useRef } from 'react';
import Player from './Player';

import styles from './WindowControls.module.css';
import borders from '../../common/css/borders.module.css';

const WindowControls = () => {  
    const [show, setShow] = useState({showGame: false, showMusic: false, showHelp: false});

    function handleLeave() {
        setShow({showGame: false, showMusic: false, showHelp: false});
    }

    const showTab = (e: any) => {
        switch (e.target.id) {
            case 'game':
                setShow({showGame: !show.showGame, showMusic: false, showHelp: false});
                break;
            case 'music':
                setShow({showGame: false, showMusic: !show.showMusic, showHelp: false});
                break;
            case 'help':
                setShow({showGame: false, showMusic: false, showHelp: !show.showHelp});
                break;
        }
    }

    return (
        <div className={styles.windowControls}>
            <div id={"game"} className={`${styles.windowDropdown}`} onMouseLeave={() => handleLeave()}>
                <button id={"game"} onMouseUp={(e) => showTab(e)}><span id="game">G</span>ame</button>
                <div className={`${show.showGame ? `${styles.show}` : `${styles.hidden}`} ${borders.outsideB}`}>
                    <p>Easy</p>
                    <p>Medium</p>
                    <p>Hard</p>
                </div>
            </div>
            <div className={`${styles.windowDropdown}`} onMouseLeave={() => handleLeave()}>
                <button onMouseUp={(e) => showTab(e)} id={"help"}><span id="help">H</span>elp</button>
                <div className={`${show.showHelp ? `${styles.show}` : `${styles.hidden}`}  ${borders.outsideB}`}>
                    <p>Rules</p>
                </div>
            </div>
            <div className={`${styles.windowDropdown}`} onMouseLeave={() => handleLeave()}>
                <button onMouseUp={(e) => showTab(e)} id={"music"}><span id="music">M</span>usic</button>
                <div className={`${show.showMusic ? `${styles.show}` : `${styles.hidden}`}  ${borders.outsideB}`}>
                    <Player />
                </div>
            </div>
        </div>
    )
}

export default WindowControls;