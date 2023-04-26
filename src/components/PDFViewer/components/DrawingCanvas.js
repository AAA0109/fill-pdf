import { Box, Button } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import Wrapper from './Wrapper';

let x = 0;
let y = 0;
let minX = Infinity;
let maxX = 0;
let minY = Infinity;
let maxY = 0;
let drawing = false;

export default function DrawingCanvas({ finishHandler, cancelHandler }) {

  const [path, setPath] = useState("")
  const [paths, setPaths] = useState([])

  const canvas = useRef(null)
  const handlePanStart = (event) => {
    let _paths = [...paths]
    let _path = path
    // if (event.detail.target !== canvas.current) {
    //   return (drawing = false);
    // }
    drawing = true;
    x = event.detail.x;
    y = event.detail.y;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    _paths.push(["M", x, y]);
    _path += `M${x},${y}`;
    setPaths(_paths)
    setPath(_path)
  }

  function handlePanMove(event) {
    if (!drawing) return;
    
    let _paths = [...paths]
    let _path = path

    x = event.detail.x;
    y = event.detail.y;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    _paths.push(["L", x, y]);
    _path += `L${x},${y}`;
    setPaths(_paths)
    setPath(_path)
  }
  function handlePanEnd() {

    drawing = false;
  }
  function finish() {
    if (!paths.length) return;
    const dx = -(minX - 10);
    const dy = -(minY - 10);
    const width = maxX - minX + 20;
    const height = maxY - minY + 20;
    finishHandler({
      detail: {
        originWidth: width,
        originHeight: height,
        path: paths.reduce((acc, cur) => {
          return acc + cur[0] + (cur[1] + dx) + "," + (cur[2] + dy);
        }, "")
      }
    })
  }
  function cancel() {
    cancelHandler()
  }

  return (
    <Wrapper itemRef={canvas} class={['relative', 'w-full', 'h-full', 'select-none']} panstart={handlePanStart} panmove={handlePanMove} panend={handlePanEnd}>
      <Box position='absolute' right={0} bottom={0} mb={4} mr={4} display='flex'>
        <Button
          onClick={cancel}
          variant="contained" 
          color="secondary"
          style={{marginRight: '10px'}}
        >
          Cancel
        </Button>
        <Button
          onClick={finish}
          variant="contained" 
          color="primary"
        >
          Done
        </Button>
      </Box>
      <svg className="w-full h-full pointer-events-none">
        <path
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
          d={path}
          stroke="black"
          fill="none" />
      </svg>
    </Wrapper>
  )
}