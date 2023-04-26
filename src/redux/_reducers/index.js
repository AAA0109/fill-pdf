import { combineReducers } from 'redux';
import { Constants, StateConstants } from '../_constants';

let initial = {
  upload_url: '',
  pdfFile: undefined,
  pdfName: '',
  pages: [],
  pagesScale: [],
  allObjects: [],
  currentFont: 'Times-Roman',
  selectedPageIndex: -1,
  saving: false,
  addDrawing: false
}

const initialState = () => ({ ...initial })

function info(state = initialState(), action) {
  if (Array.isArray(action.type)) {
    if (!Array.isArray(action.value)) { console.error('redux@input error', action.type, action.value); return; }
    let returnState = {
      ...state
    }
    action.type.map((value, index) => {
      returnState = {
        ...returnState,
        [StateConstants[value]]: action.value[index]
      }
      return true
    })
    return returnState
  } else {
    if (~Object.keys(StateConstants).indexOf(action.type)) {
      return {
        ...state,
        [StateConstants[action.type]]: action.value
      }
    } else {
      switch(action.type) {
        case Constants.CLEAR:
          return {
            ...initial
          }
        default:
          return state;
      }
    }
  }
}

const rootReducer = combineReducers({
  info,
});

export default rootReducer;