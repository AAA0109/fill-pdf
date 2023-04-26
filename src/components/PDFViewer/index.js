import React, { useEffect } from 'react';
import PDFPage from './components/PDFPage'
import Image from './components/Image'
import Text from './components/Text'
import Drawing from './components/Drawing'
import DrawingCanvas from './components/DrawingCanvas';
import { Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux'
import { actions } from 'Redux@Actions';
import { Constants } from 'Redux@Constants';
import { ggID } from "@Utils/helper.js";
import prepareAssets, { fetchFont } from "@Utils/prepareAssets.js";
const genID = ggID();

export default function PDFViewer() {

  const { pages, selectedPageIndex, pagesScale, addDrawing, allObjects, currentFont } = useSelector((state) => state.info)
  const dispatch = useDispatch()

  const addShadowOutline = (x) => {
    return x === selectedPageIndex ? ' shadow-outline' : ''
  }

  const addDrawingFunc = (originWidth, originHeight, path, scale = 1) => {
    const id = genID()
    const object = {
      id, path, type: 'drawing', x: 0, y: 0, originWidth, originHeight, width: originWidth * scale, scale
    }
    let _allObjects = allObjects.map((objects, pIndex) => pIndex === selectedPageIndex ? [...objects, object] : objects)
    dispatch(actions.setItem(Constants.SET_ALL_OBJECTS, _allObjects))
  }

  const measureHandler = (scale, index) => {
    const _pagesScale = [...pagesScale]
    _pagesScale[index] = scale
    dispatch(actions.setItem(Constants.SET_PAGES_SCALE, _pagesScale))
  }

  const selectPage = (index) => {
    dispatch(actions.setItem(Constants.SET_SELECTED_PAGEINDEX, index))
  }

  const selectFontFamily = (event) => {
    const name = event.detail.name
    fetchFont(name)
    dispatch(actions.setItem(Constants.SET_CURRENT_FONT, name))
  }

  function updateObject(objectId, payload) {
    let _allObjects = allObjects.map((objects, pIndex) =>
      pIndex == selectedPageIndex
        ? objects.map(object =>
            object.id === objectId ? { ...object, ...payload } : object
          )
        : objects
    );
    dispatch(actions.setItem(Constants.SET_ALL_OBJECTS, _allObjects))
  }
  function deleteObject(objectId) {
    let _allObjects = allObjects.map((objects, pIndex) =>
      pIndex == selectedPageIndex
        ? objects.filter(object => object.id !== objectId)
        : objects
    );
    dispatch(actions.setItem(Constants.SET_ALL_OBJECTS, _allObjects))
  }

  useEffect(() => {
    dispatch(actions.setItem(Constants.SET_SELECTED_PAGEINDEX, 0))
    setTimeout(() => {
      fetchFont(currentFont)
      prepareAssets()
    }, 5000)
  }, [])

  if (pages.length) {
    return (
      <>
        {
          addDrawing &&
          <Box position='fixed' zIndex={1111} top={0} left={0} right={0} borderBottom='1px' className='bg-white shadow-lg' style={{ height: '50%' }}>
            <DrawingCanvas 
              finishHandler={(e) => {
                const { originWidth, originHeight, path } = e.detail
                let scale = 1
                if (originWidth > 500) scale = 500 / originWidth
                addDrawingFunc(originWidth, originHeight, path, scale)
                dispatch(actions.setItem(Constants.SET_ADDING_DRAWING, false))
              }}
              cancelHandler={() => { dispatch(actions.setItem(Constants.SET_ADDING_DRAWING, false)) }}
            />
          </Box>
        }
        <Box width='100%' style={{ backgroundColor: '#f7f3f3' }}>
          {
            pages.map((page, index) => {
              return (
                <Box width='100%' display='flex' flexDirection='column' alignItems='center' overflow='hidden' onMouseDown={() => selectPage(index)} onTouchStart={() => selectPage(index)} key={'page' + index}>
                  <Box position='relative' className={'shadow-lg' + addShadowOutline(index)} margin={1}>
                    <PDFPage measureHandler={measureHandler} page={page} pageIndex={index} />
                    <Box position='absolute' top={0} left={0} className='transform' style={{transform: `scale(${pagesScale[index]})`, touchAction: 'none'}}>
                      {
                        allObjects[index].map(object => {
                          if (object.type === 'image') {
                            return (
                              <Image 
                                key={'image' + object.id}
                                updateHandler={e => updateObject(object.id, e.detail)}
                                deleteHandler={() => deleteObject(object.id)}
                                file={object.file}
                                payload={object.payload}
                                x={object.x}
                                y={object.y}
                                width={object.width}
                                height={object.height}
                                pageScale={pagesScale[index]}
                              />
                            )
                          } 
                          // if (object.type === 'text') {
                          //   return (
                          //     <Text 
                          //       updateHandler={e => updateObject(object.id, e.detail)}
                          //       deleteHandler={() => deleteObject(object.id)}
                          //       selectFontHandler={selectFontFamily}
                          //       text={object.text}
                          //       x={object.x}
                          //       y={object.y}
                          //       lineHeight={object.lineHeight}
                          //       fontFamily={object.fontFamily}
                          //       pageScale={pagesScale[index]}
                          //     />
                          //   )
                          // } 
                          else if (object.type === 'drawing') {
                            return (
                              <Drawing 
                                key={'drawing' + object.id}
                                updateHandler={e => updateObject(object.id, e.detail)}
                                deleteHandler={() => deleteObject(object.id)}
                                path={object.path}
                                x={object.x}
                                y={object.y}
                                width={object.width}
                                originWidth={object.originWidth}
                                originHeight={object.originHeight}
                                pageScale={pagesScale[index]}
                              />
                            )
                          }
                        })
                      }
                    </Box>
                  </Box>
                </Box>
              )
            })
          }
        </Box>
        
      </>
    )
  } else {
    return (
      <></>
      // <h1>hello!</h1>
    )
  }
}