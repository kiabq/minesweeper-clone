import * as React from 'react';
import { useState, useEffect, useReducer, useRef } from 'react';
import Player from './Player';
import Modal from './RulesModal';

import styles from './WindowControls.module.css';
import styles_modal from './RulesModal.module.css';
import styles_app from '../../App.module.css';
import borders from '../../common/css/borders.module.css';

type WCProps = {
    diff: number,
    setDiff: Function
}

const WindowControls = ({setDiff, diff}: WCProps) => {  
    const [show, setShow] = useState({showGame: false, showMusic: false, showHelp: false});
    const [modal, setModal] = useState(false);

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
                <button id={"game"} onMouseUp={(e) => showTab(e)}><span id="game">D</span>ifficulty</button>
                <div className={`${show.showGame ? `${styles.show}` : `${styles.hidden}`} ${borders.outsideB}`}>
                    <p onClick={() => setDiff(9)}>{diff === 9 ? '>' : null}Easy</p>
                    <p onClick={() => setDiff(16)}>{diff === 16 ? '>' : null}Medium</p>
                    <p onClick={() => setDiff(20)}>{diff === 20 ? '>' : null}Hard</p>
                    <p onClick={() => setDiff(25)}>{diff === 25 ? '>' : null}Very Hard</p>
                </div>
            </div>
            <div className={`${styles.windowDropdown}`} onMouseLeave={() => handleLeave()}>
                <button onMouseUp={(e) => showTab(e)} id={"help"}><span id="help">H</span>elp</button>
                <div className={`${show.showHelp ? `${styles.show}` : `${styles.hidden}`}  ${borders.outsideB}`}>
                    <p onClick={() => setModal(!modal)}>Rules</p>
                    {modal && 
                        <Modal>
                            <div className={`${styles_modal.modal} ${borders.outsideB}`}>
                                <div className={`${styles_app.windowHeader}`}>
                                    <h1 className={styles_app.windowName}>How to Play</h1>
                                    <div className={styles_app.windowButtons}>
                                        <button onClick={() => setModal(false)}>x</button>
                                    </div>
                                </div>
                                <div className={`${styles_modal.rules}`}>
                                    <h3 className={`${styles_modal.rulesHeader}`}>Controls</h3>
                                    <div className={`${styles_modal.controls}`}>
                                        <div className={`${styles_modal.rulesLists}`}>
                                            <p>PC</p>
                                            <ul>
                                                <li>Left click to flip a tile.</li>
                                                <li>Right click to flag a tile.</li>
                                            </ul>
                                        </div>
                                        <div className={`${styles_modal.rulesLists}`}>
                                            <p>Mobile</p>
                                            <ul>
                                                <li>Tap to flip a tile.</li>
                                                <li>Hold tap to flag a tile.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <h3 className={`${styles_modal.rulesHeader}`}>Rules</h3>
                                    <div className={`${styles_modal.rulesLists}`}>
                                        <ul>
                                            <li>First click is always safe.</li>
                                            <li>All mines must be flagged to win.</li>
                                            <li>All tiles that are not mines must be flipped.</li>
                                        </ul>
                                    </div>
                                </div>
                                <img src={require('../../common/images/construction.gif')} />
                            </div>
                        </Modal>
                    }
                </div>
            </div>
            <div className={`${styles.windowDropdown}`} onMouseLeave={() => handleLeave()}>
                <button onMouseUp={(e) => showTab(e)} id={"music"}><span id="music">M</span>usic</button>
                <div className={`${show.showMusic ? `${styles.show}` : `${styles.hidden}`}  ${borders.outsideB}`}>
                    <Player />
                </div>
            </div>
            <div className={`${styles.windowDropdown}`}>
                <button>
                    <a href="https://github.com/kiabq/minesweeper-clone" target="_blank">
                        <span>G</span>it
                    </a>    
                </button>
            </div>
        </div>
    )
}

export default WindowControls;
