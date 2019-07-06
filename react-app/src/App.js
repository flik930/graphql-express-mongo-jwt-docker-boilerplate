import React, { useState } from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import EmailConfirmationModal from './components/EmailConfirmationModal';
import {hot} from 'react-hot-loader';

function App() {
  const [modalState, setModalState] = useState({
    login: false,
    signup: false,
    emailConfirmation: false
  });

  const loginSucceed = () => {
    setModalState({login: false});
  }

  const signupSucceed = () => {
    setModalState({emailConfirmation: true, signup: false});
  }

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <StyledTypography variant="h6" color="inherit">
            Photos
          </StyledTypography>
          <Button color="inherit" onClick={() => setModalState({login: true})}>Login</Button> / 
          <Button color="inherit" onClick={() => setModalState({signup: true})}>Signup</Button>
        </Toolbar>
      </AppBar>
      <LoginModal succeed={loginSucceed} open={modalState.login} onClose={() => setModalState({login: false})}/>
      <SignupModal succeed={signupSucceed} open={modalState.signup} onClose={() => setModalState({signup: false})}/>
      <EmailConfirmationModal open={modalState.emailConfirmation} onClose={() => setModalState({emailConfirmation: false})} ></EmailConfirmationModal>
    </div>
  );
}

export default hot(module)(App);

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`
