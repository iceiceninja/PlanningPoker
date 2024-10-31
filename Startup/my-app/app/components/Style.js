import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { createBox } from '@mui/system';

/* REMOVE THESE AFTER YOU FIX TABLE UI */
const grey = { 50: '#F3F6F9', 100: '#E5EAF2', 200: '#DAE2ED', 300: '#C7D0DD', 400: '#B0B8C4', 500: '#9DA8B7', 600: '#6B7A90', 700: '#434D5B', 800: '#303740', 900: '#1C2025'};
const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  z-index: 1;
`,
);

// Modal Box Style
const Style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

// Responsive Text Theme
const textTheme = createTheme({});

// Planning Poker Text
textTheme.typography.h2 = {
  fontSize: '1.5rem',                                         // Extra Small Width: Screen Width < 600px
  [textTheme.breakpoints.up('sm')]: { fontSize: '2.0em', },   // Small width: Screen Width >= 600px
  [textTheme.breakpoints.up('md')]: { fontSize: '2.4rem', }   // Medium width: Screen Width >= 900px
}

// Host Startup / User Text
textTheme.typography.h3 = {
  fontSize: '1.2rem',                                         // Extra Small Width: Screen Width < 600px
  [textTheme.breakpoints.up('sm')]: { fontSize: '1.5rem', },  // Small width: Screen Width >= 600px
  [textTheme.breakpoints.up('md')]: { fontSize: '2.0rem', }   // Medium width: Screen Width >= 900px
}

// Everfox Logo Text
textTheme.typography.h5 = {
  fontSize: '1.2rem',                                         // Extra Small Width: Screen Width < 600px
  [textTheme.breakpoints.up('sm')]: { fontSize: '1.5rem', },  // Small width: Screen Width >= 600px
  [textTheme.breakpoints.up('md')]: { fontSize: '1.7rem', },  // Medium width: Screen Width >= 900px
}

// Host/User Top Nav Topic Text Box
textTheme.typography.h6 = {
  fontSize: '1.1rem',                                         // Extra Small Width: Screen Width < 600px
  [textTheme.breakpoints.up('sm')]: { fontSize: '1.3rem', },  // Small width: Screen Width >= 600px
  [textTheme.breakpoints.up('md')]: { fontSize: '2.0rem', },  // Medium width: Screen Width >= 900px
}

// Host/User Top Nav Host Text Box
textTheme.typography.subtitle1 = {
  fontSize: '1.0rem',                                         // Extra Small Width: Screen Width < 600px
  [textTheme.breakpoints.up('sm')]: { fontSize: '1.1rem', },  // Small width: Screen Width >= 600px
  [textTheme.breakpoints.up('md')]: { fontSize: '1.5rem', },  // Medium width: Screen Width >= 900px
}

// Host/User Top Nav Right Buttons
textTheme.typography.button = {
  fontSize: '0.5rem',                                         // Extra Small Width: Screen Width < 600px
  [textTheme.breakpoints.up('sm')]: { fontSize: '0.6rem', },  // Small width: Screen Width >= 600px
  [textTheme.breakpoints.up('md')]: { fontSize: '0.9rem', },  // Medium width: Screen Width >= 900px
}

// Host/User Center Text Box
textTheme.typography.body1 = {
  fontSize: '1.0rem',                                         // Extra Small Width: Screen Width < 600px
  [textTheme.breakpoints.up('sm')]: { fontSize: '1.1rem', },  // Small width: Screen Width >= 600px
  [textTheme.breakpoints.up('md')]: { fontSize: '1.5rem', },  // Medium width: Screen Width >= 900px
}

// Button
const buttonTheme = createTheme({
  palette: {
    primary: {
      main: "#F3F1F6",
      contrastText: "#000000"
    }
  }
});

export {
  PopupBody,
  Style, 
  textTheme,
  buttonTheme
};