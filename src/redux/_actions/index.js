import { Constants } from "../_constants"
const setItem = (type, value) => {
  return {
    type,
    value
  }
}

const clear = () => {
  return {
    type: Constants.CLEAR,
    value: ''
  }
}

export const actions = {
  setItem, clear
}
