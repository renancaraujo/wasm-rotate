import React, { useState, useCallback } from 'react'
import GitHubButton from 'react-github-btn'
import styled from 'styled-components'
import RotateJs from './RotateJs'
import RotateWasm from './RotateWasm'


function App() {
  const [bitMapArr, setBitMapArr] = useState([])
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  
  return (
    <AppContainer>
      <Title>Pick and rotate image</Title>
      <GitHubButton href="https://github.com/renancaraujo/wasm-rotate" data-size="large" aria-label="Star renancaraujo/wasm-rotate on GitHub">Star</GitHubButton>
      <ImagePicker onConvertImage={({ bitMapArr, width, height }) => {
        setBitMapArr(bitMapArr)
        setWidth(width)
        setHeight(height)
      }} />
      <Rotates show={bitMapArr.length}>
        <RotateJs bitMapArr={bitMapArr} width={width} height={height} />
        <RotateWasm bitMapArr={bitMapArr} width={width} height={height} />
      </Rotates>
    </AppContainer>
  )
}

function ImagePicker({onConvertImage}) {
  const [canvas, setCanvas] = useState(null)

  const onPickImage = e => {
    const context = canvas.getContext('2d')
    const image = new Image()
    image.src = window.URL.createObjectURL(e.target.files[0])
    image.onload = () => {
      canvas.height = image.height
      canvas.width = image.width
      context.drawImage(image, 0, 0)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data
      onConvertImage({ bitMapArr: imageData, width: canvas.width, height: canvas.height })
    }
  }

  const doRef = useCallback(canvas => {
    setCanvas(canvas)
  }, [])

  return (
    <ImagePickerContainer>
      <input type="file" accept="image/*" onChange={onPickImage}></input>
      <HiddenCanvas ref={doRef} />
    </ImagePickerContainer>
    
  )
}

const Rotates = styled.div`
  display: flex
  opacity: ${props => props.show ? 1 : 0.1}
  pointer-events: ${props => props.show ? 'initial' : 'none'}
  flex: 1
  flex-wrap: wrap
  & > *{
    margin: 0 1em
  }
    
`

const AppContainer = styled.div`
  min-height: 100vh
  background-color: #151515
  color: #fff
  display: flex
  flex-direction: column
  align-items: center
  padding: 1.2em 1em
`

const Title = styled.h1`
  font-weight: 700
  margin: 10px 16px
`

const ImagePickerContainer = styled.div`
  padding: 1.2em 1em
`

const HiddenCanvas = styled.canvas`
  display: none
`

export default App
