import * as React from 'react';
import { useState, useEffect } from 'react';

const url = require('../../common/mp3/ms.mp3');

const Player = () => {
    const [audio] = useState(new Audio(url));
    const [play, setPlay] = useState(false);

    const toggle = () => {
        setPlay(!play);
    }

    if (play) {
        audio.play();
    } else {
        audio.pause();
    }

    return (
        <p onClick={() => toggle()}>{play ? "Pause" : "Play"} m</p>
    )
}   

export default Player;