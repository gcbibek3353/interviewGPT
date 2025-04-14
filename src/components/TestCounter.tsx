"use client"
import React, { useState } from 'react'

const TestCounter = () => {
    const [count, setCount] = useState<number>(0);

    const inc = () => setCount(count + 1);
    const dec = () => setCount(count > 0 ? count - 1 : 0);
    const swapSign = () => setCount(count * -1);

    return (
        <div>
            <h2>{count}</h2>
            <div>
                <button onClick={inc}>add</button>
                <button onClick={dec}>subtract</button>
                <button onClick={swapSign}>change Sign</button>
            </div>
        </div>
    )
}

export default TestCounter