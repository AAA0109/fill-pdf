import { Box } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import Wrapper from './Wrapper'
import deleteSvg from '@Assets/img/delete.svg'

let directions = []
let startX;
let startY;

export default function Image({ width, height, updateHandler, deleteHandler, payload, file, x, y, pageScale }) {
  const [dx, setDX] = useState(0)
  const [dy, setDY] = useState(0)
  const [dw, setDW] = useState(0)
  const [dh, setDH] = useState(0)

  const [operation, setOperation] = useState('')
  const canvas = useRef(null)

  const init = async () => {
    let scale = 1
    const limit = 500
    canvas.current.width = width
    canvas.current.height = height
    canvas.current.getContext("2d").drawImage(payload, 0, 0);
    if (width > limit) scale = limit / width
    if (height > limit) scale = Math.min(scale, limit / height)
    updateHandler({ detail: {width: width * scale, height: height * scale }})
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      canvas.current.toBlob(blob => {
        updateHandler({ detail: {file: blob} })
      });
    }
  }

  function handlePanStart(event) {
    startX = event.detail.x;
    startY = event.detail.y;
    let _operation = event.detail.operation
    setOperation(_operation)
    if (_operation == 'scale') {
      directions = event.detail.target.dataset.direction.split('-');
    }
  }

  function handlePanMove(event) {
    const _dx = (event.detail.x - startX) / pageScale;
    const _dy = (event.detail.y - startY) / pageScale;
    if (operation === "move") {
      setDX(_dx)
      setDY(_dy)
    } else if (operation === "scale") {
      if (directions.includes("left")) {
        setDX(_dx)
        setDW(-_dx)
      }
      if (directions.includes("top")) {
        setDY(_dy)
        setDH(-_dy)
      }
      if (directions.includes("right")) {
        setDW(_dx)
      }
      if (directions.includes("bottom")) {
        setDH(_dy)
      }
    }
  }

  function handlePanEnd(event) {
    if (operation === "move") {
      updateHandler({
        detail: {
          x: x + dx,
          y: y + dy
        }
      })
      setDX(0)
      setDY(0)
    } else if (operation === "scale") {
      updateHandler({
        detail: {
          x: x + dx,
          y: y + dy,
          width: width + dw,
          height: height + dh
        }
      })
      setDX(0)
      setDY(0)
      setDW(0)
      setDH(0)
      directions = [];
    }
    setOperation('')
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Box position='absolute' left={0} top={0} style={{ userSelect: 'none', width: `${width + dw}px`, height: `${height + dh}px`, transform: `translate(${x + dx}px, ${y + dy}px)` }}>
      <Wrapper
        panstart={handlePanStart} panmove={handlePanMove} panend={handlePanEnd}
        class={['absolute', 'w-full', 'h-full', 'cursor-grab', operation ? 'operation' : '', operation === 'move' ? 'cursor-grabbing' : '']}
      >
        <Box
          data-direction="left"
          className="resize-border border-l cursor-ew-resize"
          position='absolute'
          left={0}
          top={0}
        />
        <Box
          data-direction="top"
          className="resize-border border-t cursor-ns-resize"
          position='absolute'
          left={0}
          top={0}
        />
        <Box
          data-direction="bottom"
          className="resize-border border-b cursor-ns-resize"
          position='absolute'
          left={0}
          bottom={0}
        />
        <Box
          data-direction="right"
          className="resize-border border-r cursor-ew-resize"
          position='absolute'
          right={0}
          top={0}
          bottom={0}
        />
        <Box
          data-direction="left-top"
          className="resize-corner cursor-nwse-resize transform -translate-x-1/2 -translate-y-1/2 md-scale-25"
          position='absolute'
          left={0}
          top={0}
        />
        <Box
          data-direction="right-top"
          className="resize-corner cursor-nesw-resize transform translate-x-1/2 -translate-y-1/2 md-scale-25" 
          position='absolute'
          right={0}
          top={0}
        />
        <Box
          data-direction="left-bottom"
          className="resize-corner cursor-nesw-resize transform -translate-x-1/2 translate-y-1/2 md-scale-25" 
          position='absolute'
          left={0}
          bottom={0}
        />
        <Box
          data-direction="right-bottom"
          className="resize-corner cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 md-scale-25" 
          position='absolute'
          right={0}
          bottom={0}
        />
      </Wrapper>
      <Box
        onClick={deleteHandler}
        position='absolute'
        left={0}
        top={0}
        right={0}
        margin='auto'
        className="w-12 h-12 rounded-full bg-white cursor-pointer transform -translate-y-1/2 md-scale-25">
        <img className="w-full h-full" src={deleteSvg} alt="delete object" />
      </Box>
      <canvas className="w-full h-full" ref={canvas} />
    </Box>
  )
}