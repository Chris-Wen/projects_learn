import React, { FC, useEffect, useState } from 'react'

const HomePage: FC = () => {
    const [count, setState] = useState<number>(0)

    useEffect(() => {
        console.log(count)
    }, [])

    return (
        <>
            Count1: {count}
            <button onClick={() => setState(0)}>Reset</button>
            <button onClick={() => setState(count - 1)}>-</button>
            <button onClick={() => setState(count + 1)}>+</button>
        </>
    )
}

export default HomePage
