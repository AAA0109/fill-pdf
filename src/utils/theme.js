import { createMuiTheme } from '@material-ui/core/styles';
import { enUS } from '@material-ui/core/locale';

export const light = createMuiTheme({
  palette: {
    common: {
      black: "#000",
      white: "#fff"
    },
    background: {
      paper: "#fff",
      default: '#fff'
    },
    primary: {
      light: "#1976d2",
      main: "#1976d2",
      dark: "#0378ed",
      contrastText: "#fff"
    },
    secondary: {
      light: "rgb(220, 0, 78)",
      main: "rgb(220, 0, 78)",
      dark: "rgb(220, 0, 78)",
      contrastText: "#fff"
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)"
    }
  },
}, enUS)