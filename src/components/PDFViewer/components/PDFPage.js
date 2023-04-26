import React, { useEffect, useRef, useState } from 'react';

export default function PDFPage({page, measureHandler, pageIndex}) {

  let [width, setWidth] = useState(0)
  let [height, setHeight] = useState(0)

  let canvasRef = useRef(null)

  const measure = () => {
    let clientWidth = canvasRef.current.clientWidth
    measureHandler(clientWidth / width, pageIndex)
  }
  
  const init = async () => {
    const _page = await page;
    const context = canvasRef.current.getContext('2d')
    const viewport = _page.getViewport({ scale: 1, rotation: 0 })
    setWidth(viewport.width)
    setHeight(viewport.height)
    await _page.render({
      canvasContext: context,
      viewport
    }).promise
    measure()
    window.addEventListener('resize', measure)
  }

  useEffect(() => {
    init()
    return (() => {
      window.removeEventListener('resize', measure)
    })
  }, [])

  return (
    <canvas ref={canvasRef} className='max-w-full' style={{width: `${width}px`}} width={width} height={height}></canvas>
  )
}
