import { Box } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import Wrapper from './Wrapper'
import deleteSvg from '@Assets/img/delete.svg'

let direction = '';
let startX;
let startY;

export default function Drawing({ originWidth, originHeight, width, x, y, pageScale, path, updateHandler, deleteHandler }) {
  let ratio = originWidth / originHeight
  const [dx, setDX] = useState(0)
  const [dy, setDY] = useState(0)
  const [dw, setDW] = useState(0)
  const [operation, setOperation] = useState('')
  const svg = useRef(null)

  const init = async () => {
    svg.current.setAttribute('viewBox', `0 0 ${originWidth} ${originHeight}`)
  }

  function handlePanStart(event) {
    startX = event.detail.x;
    startY = event.detail.y;
    let _operation = event.detail.operation
    setOperation(_operation)
    if (_operation === 'scale') {
      direction = event.detail.target.dataset.direction;
    }
  }

  function handlePanMove(event) {
    const _dx = (event.detail.x - startX) / pageScale;
    const _dy = (event.detail.y - startY) / pageScale;
    if (operation === "move") {
      setDX(_dx)
      setDY(_dy)
    } else if (operation === "scale") {
      if (direction === "left-top") {
        let d = Infinity;
        d = Math.min(_dx, _dy * ratio);
        setDX(d)
        setDW(-d)
        setDY(d / ratio)
      }
      if (direction === "right-bottom") {
        let d = -Infinity;
        d = Math.max(_dx, _dy * ratio);
        setDW(d)
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
          scale: (width + dw) / originWidth
        }
      })
      setDX(0)
      setDY(0)
      setDW(0)
      direction = "";
    }
    setOperation('')
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Box position='absolute' left={0} top={0} style={{ userSelect: 'none', width: `${width + dw}px`, height: `${(width + dw) / ratio}px`, transform: `translate(${x + dx}px, ${y + dy}px)` }}>
      <Wrapper
        panstart={handlePanStart} panmove={handlePanMove} panend={handlePanEnd}
        class={['absolute', 'w-full', 'h-full', 'cursor-grab', 'border', 'border-gray-400', 'border-dashed', operation ? 'operation' : '', operation === 'move' ? 'cursor-grabbing' : '']}
      >
        <Box
          data-direction="left-top"
          className="w-10 h-10 bg-green-400 rounded-full cursor-nwse-resize transform -translate-x-1/2 -translate-y-1/2 md-scale-25"
          position='absolute'
          left={0}
          top={0}
        />
        <Box
          data-direction="right-bottom"
          className="w-10 h-10 bg-green-400 rounded-full cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 md-scale-25"
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
      <svg ref={svg} width="100%" height="100%">
        <path
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="black"
          fill="none"
          d={path} />
      </svg>
    </Box>
  )
}