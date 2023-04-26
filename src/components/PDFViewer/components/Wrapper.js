import { Box } from '@material-ui/core'
import React, { useState, useRef } from 'react'

export default function Wrapper(props) {

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const wrapper = useRef(null)

  const handleMouseDown = (event) => {
    let _x = event.clientX
    let _y = event.clientY
    const target = event.target
    setX(_x)
    setY(_y)
    props.panstart({detail: {x: _x, y: _y, target, operation: wrapper.current === target ? 'move' : 'scale'}})
  }

  const handleMouseMove = (event) => {
    const dx = event.clientX - x
    const dy = event.clientY - y
    let _x = event.clientX
    let _y = event.clientY
    setX(_x)
    setY(_y)
    props.panmove({detail: {x: _x, y: _y, dx, dy}})
  }

  const handleMouseUp = (event) => {
    let _x = event.clientX
    let _y = event.clientY
    setX(_x)
    setY(_y)
    props.panend({detail: {x: _x, y: _y}})
  }

  const handleTouchStart = (event) => {
    if (event.touches.length > 1) return
    const touch = event.touches[0]
    let _x = touch.clientX
    let _y = touch.clientY
    const target = touch.target
    setX(_x)
    setY(_y)
    props.panstart({detail: {x: _x, y: _y, target}})
  }

  const handleTouchMove = (event) => {
    event.preventDefault()
    if (event.touches.length > 1) return
    const touch = event.touches[0]
    const dx = touch.clientX - x
    const dy = touch.clientY - y
    let _x = touch.clientX
    let _y = touch.clientY
    setX(_x)
    setY(_y)
    props.panmove({detail: {x: _x, y: _y, dx, dy}})
  }

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0]
    let _x = touch.clientX
    let _y = touch.clientY
    setX(_x)
    setY(_y)
    props.panend({detail: {x: _x, y: _y}})
  }

  return (
    <Box
      itemRef={props.itemRef}
      className={props.class.join(' ')}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={wrapper}
    >
      {props.children}
    </Box>
  )
}