import React, { useState, useEffect } from 'react';
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
import FacebookLogin from 'react-facebook-login';
import MemberService from './services/memberService';
import Utils from './utils/utils';
import globalStore from './stores/globalStore';
import Avatar from '@material-ui/core/Avatar';

function App() {
  const [modalState, setModalState] = useState({
    login: false,
    signup: false,
    emailConfirmation: false
  });

  const loginSucceed = () => {
    setModalState({...modalState, login: false});
  }

  const signupSucceed = () => {
    setModalState({...modalState, emailConfirmation: true, signup: false});
  }

  const responseFacebook = (response) => {
    MemberService.facebookLogin({token: response.accessToken}).then(response => {
      Utils.setBearerToken(response.data.token);
      globalStore.userInfo = response.data.user;
    })
  }

  useEffect(() => {
    MemberService.getUserInfo().then((res) => {
      globalStore.userInfo = res.data.userInfo;
    });
  });

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <StyledTypography variant="h6" color="inherit">
            Photos
          </StyledTypography>
          {
            globalStore.userInfo ?
              <>
                <FacebookLogin
                  appId="2253032208279352"
                  autoLoad={true}
                  fields="name,email,picture"
                  size="small"
                  callback={responseFacebook} />
                <Button color="inherit" onClick={() => setModalState({...modalState, login: true})}>Login</Button> /
                <Button color="inherit" onClick={() => setModalState({...modalState, signup: true})}>Signup</Button>
              </>
            :
              <Avatar src={process.env.PUBLIC_URL + '/images/default_avatar.png'}/>
          }

        </Toolbar>
      </AppBar>
      <LoginModal succeed={loginSucceed} open={modalState.login} onClose={() => setModalState({...modalState, login: false})}/>
      <SignupModal succeed={signupSucceed} open={modalState.signup} onClose={() => setModalState({...modalState, signup: false})}/>
      <EmailConfirmationModal open={modalState.emailConfirmation} onClose={() => setModalState({...modalState, emailConfirmation: false})} ></EmailConfirmationModal>
    </div>
  );
}

export default hot(module)(App);

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`
