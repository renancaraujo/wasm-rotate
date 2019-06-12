

export default function MyWorker(args) {

        this.onmessage = e => {

            const { bitMapArr, width, height } = e.data
            const pixelLength = 4;
            
            const lineLength = width * pixelLength;
            const halfHeight = Math.trunc(height / 2);
            const endArr = Uint8ClampedArray.from([...bitMapArr]);
        
            for (let line = 0; line < halfHeight; line++) {
                const startOfLine = line * lineLength;
                const startOfOppositeLine = (height - 1 - line) * lineLength;
                for (let column = 0; column < width; column++) {
                    const pixelStart = startOfLine + column * pixelLength;
                    const pixelEnd = pixelStart + pixelLength;

                    const oppositePixelStart = startOfOppositeLine + column * pixelLength;
                    const oppositePixelEnd = oppositePixelStart + pixelLength;

                    const oppositePixel = bitMapArr.slice(oppositePixelStart, oppositePixelEnd);
                    const targetPixel = bitMapArr.slice(pixelStart, pixelEnd);

                    for (let item = oppositePixelStart; item < oppositePixelEnd; item++) {
                        let is = item - oppositePixelStart;
                        endArr[item] = targetPixel[is];
                    }

                    for (let item = pixelStart; item < pixelEnd; item++) {
                        let is = item - pixelStart;
                        endArr[item] = oppositePixel[is];
                    }


                }
            }
            
    
            postMessage(endArr);
    
        }
    }
    