import React, { useEffect, useState, useCallback } from 'react'


import WebWorker from './WebWorker'
import Worker from './Worker'

const workerInstance = new WebWorker(Worker)


export default function RotateJs({ bitMapArr, width, height}){

    const [canvas, setCanvas] = useState(null);

    const doRef = useCallback(canvas => {
        setCanvas(canvas);
    }, []);

    const onStartConverting = (e) => {
        e.preventDefault();
        workerInstance.postMessage({bitMapArr, width, height});
    }

    const listen = e => {
        const newBmp = e.data; 

        const context = canvas.getContext('2d');
        canvas.height = height
        canvas.width = width
        context.putImageData(newBmp, 0, 0);
    }

    useEffect(() => {
        workerInstance.addEventListener("message", listen)
        return () => {
            workerInstance.removeEventListener("message", listen)
        };
    });

    return (
        <div>
            <p>Rotate using JS (WebWorker)</p>
            <div>
                <button onClick={onStartConverting}>Convert</button> 

                { width ? ( <p> { width }px x { height }px </p>) : "" }
                
                <br />
                <br />
                <canvas width="0" height="0"  />
            </div>
        </div>
    );
}