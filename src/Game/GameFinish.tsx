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
                <p>You Win</p>
            )
        }
        if (!winCondition) {
            return (
                <p>You Lose!</p>
            )
        }
    }
    return (
        <div></div>
    )
}

export default GameFinish;