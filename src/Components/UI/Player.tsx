import * as React from 'react';
import { useState, useEffect } from 'react';

const url = require('../../common/mp3/ms.mp3');

const Player = () => {
    const [audio] = useState(new Audio(url));
    const [play, setPlay] = useState(false);

    audio.volume = 0.1;

    const toggle = () => {
        setPlay(!play);
    }

    const playFunc = () => {  
        if (play) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    useEffect(() => {
        audio.addEventListener('ended', () => (play && playFunc()));
        return () => audio.removeEventListener('ended', () => (play && playFunc()));
    })

    playFunc();

    return (
        <p onClick={() => toggle()}>{play ? "Pause" : "Play"}</p>
    )
}   

export default Player;