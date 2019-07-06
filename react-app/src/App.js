import React, { useState } from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import {hot} from 'react-hot-loader';

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const logedIn = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(false);
  }

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <StyledTypography variant="h6" color="inherit">
            Photos
          </StyledTypography>
          <Button color="inherit" onClick={() => setLoginModalOpen(true)}>Login</Button> / 
          <Button color="inherit" onClick={() => setSignupModalOpen(true)}>Signup</Button>
        </Toolbar>
      </AppBar>
      <LoginModal logedIn={logedIn} open={loginModalOpen} onClose={() => setLoginModalOpen(false)}/>
      <SignupModal logedIn={logedIn} open={signupModalOpen} onClose={() => setSignupModalOpen(false)}/>
    </div>
  );
}

export default hot(module)(App);

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`
