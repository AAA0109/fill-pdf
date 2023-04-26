import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Box, Fab, Button } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { useDispatch, useSelector } from "react-redux"
import { actions } from 'Redux@Actions';
import { Constants } from 'Redux@Constants';
import gesture from '@Assets/img/gesture.svg';
import image from '@Assets/img/image.svg';
import note from '@Assets/img/notes.svg';
import { ggID } from "@Utils/helper.js";
import {
  readAsImage,
  readAsPDF,
  readAsDataURL
} from "@Utils/asyncReader.js";

import { save } from "@Utils/PDF.js";

const genID = ggID();
const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  box: {
    width: '100%',
    alignItems: 'center',
  }
}));

export default function Tbar({ ...props }) {
  const { pages, pdfName, pdfFile, pagesScale, allObjects, currentFont, selectedPageIndex, saving } = useSelector((state) => state.info)
  const classes = useStyles();
  const dispatch = useDispatch()

  const { className } = props;

  const addPDF = async file => {
    try {
      const pdf = await readAsPDF(file);
      let _pdfName = file.name;
      let _pdfFile = file;
      const numPages = pdf.numPages;
      let _pages = Array(numPages)
        .fill()
        .map((_, i) => pdf.getPage(i + 1));
      let _allObjects = _pages.map(() => []);
      let _pagesScale = Array(numPages).fill(1);
      dispatch(actions.setItem([
        Constants.SET_PDF_NAME,
        Constants.SET_PDF_FILE,
        Constants.SET_PAGES,
        Constants.SET_ALL_OBJECTS,
        Constants.SET_PAGES_SCALE
      ], [
        _pdfName,
        _pdfFile,
        _pages,
        _allObjects,
        _pagesScale
      ]))
    } catch (e) {
      console.log("Failed to add pdf.");
      throw e;
    }
  }

  const addDrawingFunc = () => {
    try {
      if (selectedPageIndex >= 0) {
        dispatch(actions.setItem(Constants.SET_ADDING_DRAWING, true))
      }
    } catch (e) {
      console.log('Failed to add drawing.')
      throw e;
    }
  }

  const uploadFile = async e => {
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
    const file = files[0];
    if (!file || file.type !== "application/pdf") return;
    dispatch(actions.setItem(Constants.SET_SELECTED_PAGEINDEX, -1))

    try {
      clearStore()
      await addPDF(file);
      dispatch(actions.setItem(Constants.SET_SELECTED_PAGEINDEX, 0))
    } catch (e) {
      console.log(e);
    }
  }

  const clearStore = () => {
    dispatch(actions.clear())
  }

  const savePDF = async () => {
    if (!pdfFile || saving || !pages.length) return;
    dispatch(actions.setItem(Constants.SET_SAVING), true)
    try {
      await save(pdfFile, allObjects, pdfName, pagesScale);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(actions.setItem(Constants.SET_SAVING), false)
    }
  }

  const addImageFunc = (e) => {
    const file = e.target.files[0];
    if (file && selectedPageIndex >= 0) {
      addImage(file);
    }
    e.target.value = null;
  }

  const addImage = async file => {
    try {
      // get dataURL to prevent canvas from tainted
      const url = await readAsDataURL(file);
      const img = await readAsImage(url);
      const id = genID();
      const { width, height } = img;
      const object = {
        id,
        type: "image",
        width,
        height,
        x: 0,
        y: 0,
        payload: img,
        file
      };
      let _allObjects = allObjects.map((objects, pIndex) =>
        pIndex === selectedPageIndex ? [...objects, object] : objects
      );
      dispatch(actions.setItem(Constants.SET_ALL_OBJECTS, _allObjects))
    } catch (e) {
      console.log(`Fail to add image.`, e);
    }
  }

  return (
    <Toolbar className={className} variant="dense">
      <Box display="flex" justifyContent="center" className={classes.box}>
        <input
          type="file"
          id="image"
          name="image"
          style={{ display: 'none' }}
          accept='.png,.jpg,.jpeg'
          onChange={addImageFunc} 
        />
        <Box marginRight={1}>
          <label htmlFor="upload-pdf">
            <input
              style={{ display: 'none' }}
              id="upload-pdf"
              name="upload-pdf"
              type="file"
              accept='.pdf'
              onChange={e => { uploadFile(e) }}
            />
            <Fab
              size="small"
              component="span"
              aria-label="add"
              variant="extended"
            >
              Open PDF&nbsp;<PictureAsPdfIcon />
            </Fab>
          </label>
        </Box>
        <Box display='flex' marginRight={2} bgcolor='#e0e0e0' borderRadius={3} className='h-8'>
          <label className="flex-center w-8 h-full cursor-pointer" htmlFor="image">
            <img src={image} alt="An icon for adding images" />
          </label>
          <label className="flex-center w-8 h-full cursor-pointer" htmlFor="text" >
            <img src={note} alt="An icon for adding text" />
          </label>
          <label className="flex-center w-8 h-full cursor-pointer" onClick={addDrawingFunc}>
            <img src={gesture} alt="An icon for adding drawing" />
          </label>
        </Box>
        <Button onClick={savePDF} variant="contained" color="secondary">
          Save
        </Button>
      </Box>
    </Toolbar>
  )
}