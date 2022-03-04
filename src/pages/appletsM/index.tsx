import React, { FC, useState } from 'react'

const HomePage: FC = () => {
    const [count, setState] = useState(0)

    return (
        <>
            Count: {count}
            <button onClick={() => setState(0)}>Reset</button>
            <button onClick={() => setState(count - 1)}>-</button>
            <button onClick={() => setState(count + 1)}>+</button>
        </>
    )
}

export default HomePage
