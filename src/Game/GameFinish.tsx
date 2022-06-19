import * as React from 'react';

type GameFinishProps = {
    winCondition: boolean,
    isGameOver: boolean,
}

const GameFinish = (props: GameFinishProps) => {
    let { winCondition, isGameOver } = props
    
    if (isGameOver) {
        if (winCondition) {
            return (
                <p>You win!</p>
            )
        } else {
            return (
                <p>You Lose!</p>
            )
        }
    }

    return (
        <>
        </>
    )
}

export default GameFinish;