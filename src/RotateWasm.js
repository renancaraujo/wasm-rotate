import React, { useState, useCallback } from 'react'




export default function RotateWasm({ bitMapArr, width, height}){

    const [canvas, setCanvas] = useState(null)

    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)

    const [loading, setLoading] = useState(false);

    const doRef = useCallback(canvas => {
        setCanvas(canvas)
    }, [])

    const onStartConverting = async (e) => {
        e.preventDefault()
        
        const response = await fetch("wasm_rotate_core_bg.wasm");
        const bytes = await response.arrayBuffer();
        const results = await WebAssembly.instantiate(bytes, { env: { cos: Math.cos } });

        setEnd(null)
        setLoading(false)
        setStart(performance.now())

        const module = {};
        const mod = await results.instance;
        module.update  = mod.exports.update;
        module.alloc   = mod.exports.alloc;
        module.dealloc = mod.exports.dealloc;
        module.greet    = mod.exports.greet;
        
        const byteSize = width * height * 4;

        const pointer = module.alloc(byteSize);
        console.log(pointer)

        canvas.height = height
        canvas.width = width
        const context = canvas.getContext('2d')
        const usub = new Uint8ClampedArray(mod.exports.memory.buffer, pointer, byteSize);
        usub.set(bitMapArr, 0);
        const imageData = new ImageData(usub, width, height);
        module.greet(pointer, width, height);
        context.putImageData(imageData, 0, 0);
        setEnd(performance.now())
        setLoading(false)

    }



    return (
        <div>
            <h2>Rotate using WASM</h2>
            <div>
                <button onClick={onStartConverting}>Rotate !</button>
                

                { width ? ( <p> { width }px x { height }px </p>) : '' }
                
                <br />
                {loading ? 'wait for it...' : ''}
                { start && end ? ( <p> { (end - start) * 0.001  } seconds </p>) : "" }
                <br />

                <canvas ref={doRef} width="460" height="460"  />
            </div>
        </div>
    )
}