import React, { useEffect, useState, useCallback } from 'react'


import WebWorker from './WebWorker'
import Worker from './Worker'

const workerInstance = new WebWorker(Worker)


export default function RotateJs({ bitMapArr, width, height}){

    const [canvas, setCanvas] = useState(null)

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    const doRef = useCallback(canvas => {
        setCanvas(canvas)
    }, [])

    const onStartConverting = (e) => {
        e.preventDefault()
        setStart(performance.now())
        setEnd(null)
        workerInstance.postMessage({bitMapArr, width, height})
    }

    const listen = e => {
        const newBmp = e.data 
        const arr = Uint8ClampedArray.from(newBmp)
        setEnd(performance.now())

        const image = new ImageData(arr, width, height);

        console.log(arr, width, height);
        canvas.getContext('2d').putImageData(image, 0, 0)
    }

    useEffect(() => {
        workerInstance.addEventListener("message", listen)
        return () => {
            workerInstance.removeEventListener("message", listen)
        }
    })

    return (
        <div>
            <h2>Rotate using JS (WebWorker)</h2>
            <div>
                <button onClick={onStartConverting}>Convert</button> 

                { width ? ( <p> { width }px x { height }px </p>) : "" }
                
                <br />
                <br />

                { start && end ? ( <p> { (end - start) * 0.001  } seconds </p>) : "" }
                <br />
                <br />
                <br />
                <canvas ref={doRef} width="460" height="460"  />
            </div>
        </div>
    )
}