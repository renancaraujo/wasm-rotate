import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import RotateJs from './RotateJs';


function App() {
  const [bitMapArr, setBitMapArr] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  return (
    <AppContainer>
      <Title>Pick and rotate image</Title>
      <ImagePicker onConvertImage={({ bitMapArr, width, height }) => {
        setBitMapArr(bitMapArr)
        setWidth(width)
        setHeight(height)
      }} />
      <Rotates show={bitMapArr.length}>
        <RotateJs bitMapArr={bitMapArr} width={width} height={height} />
      </Rotates>
    </AppContainer>
  )
}

function ImagePicker({onConvertImage}) {
  const [canvas, setCanvas] = useState(null);

  const onPickImage = e => {
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = window.URL.createObjectURL(e.target.files[0]);
    image.onload = () => {
      canvas.height = image.height;
      canvas.width = image.width;
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      onConvertImage({ bitMapArr: imageData, width: canvas.width, height: canvas.height });
    }
  }

  const doRef = useCallback(canvas => {
    setCanvas(canvas);
  }, []);

  return (
    <ImagePickerContainer>
      <input type="file" accept="image/*" onChange={onPickImage}></input>
      <HiddenCanvas ref={doRef} />
    </ImagePickerContainer>
    
  );
}

const Rotates = styled.div`
  display: flex;
  opacity: ${props => props.show ? 1 : 0.1};
  pointer-events: ${props => props.show ? 'initial' : 'none'};
  flex: 1;
`

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #151515;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2em 1em;
`

const Title = styled.h1`
  font-weight: 700;
  margin: 0;
`

const ImagePickerContainer = styled.div`
  padding: 1.2em 1em;
`

const HiddenCanvas = styled.canvas`
  position: absolute;
  pointer-events: none;
  opacity: 0;
`

export default App;
