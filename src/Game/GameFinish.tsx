import * as React from 'react';

type GameFinishProps = {
    winCondition: boolean,
}

const GameFinish = (props: GameFinishProps) => {
    let { winCondition } = props

    if (winCondition) {
        return (
            <p>You Win</p>
        )
    } else {
        return (
            <p>You Lose!</p>
        )
    }
}

export default GameFinish;