import React, { useState, useEffect } from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import GlobalMessageModal from './components/GlobalMessageModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import {hot} from 'react-hot-loader';
import FacebookLogin from 'react-facebook-login';
import MemberService from './services/memberService';
import Utils from './utils/utils';
import globalStore from './stores/globalStore';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { view, store } from 'react-easy-state'
import Icon from '@material-ui/core/Icon';
import { withRouter } from "react-router-dom";
import { clearServiceInstance } from './services/baseService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  autoClose: 2000
});

function App(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const logout = () => {
    Utils.setBearerToken('');
    clearServiceInstance();
    globalStore.userInfo = null;
    globalStore.loggedIn = false;
    setAnchorEl(null);
    props.history.push(`/`);
  }

  const [modalState, setModalState] = useState({
    login: false,
    signup: false,
    globalMessage: false,
    forgotPassword: false
  });

  const [message, setMessage] = useState();

  const loginSucceed = () => {
    setModalState({...modalState, login: false});
    getUserInfo();
  }

  const signupSucceed = () => {
    setModalState({...modalState, globalMessage: true, signup: false});
    setMessage(<><Icon style={{color: 'green'}}> done-outline</Icon>Signup Succeed, Please check your email for verification! Thanks.</>)
    getUserInfo();
  }

  const forgotPasswordSucceed = () => {
    setModalState({...modalState, forgotPassword: false, globalMessage: true});
    setMessage(<>Please check your email for resting the password! Thanks.</>)
  }

  const forgotPasswordClick = () => {
    setModalState({...modalState, login: false, forgotPassword: true});
  }

  const getUserInfo = async () => {
    try {
      globalStore.loggedIn = true;
      const result = await MemberService.getUserInfo();
      globalStore.userInfo = result.data.me;
    } catch (e) {
      globalStore.loggedIn = false;
      globalStore.userInfo = null;
      console.warn(e)
    }
  }

  const responseFacebook = (response) => {
    MemberService.facebookLogin({token: response.accessToken}).then(response => {
      Utils.setBearerToken(response.data.token);
      getUserInfo();
    })
  }

  const handleProfileClick = () => {
    handleMenuClose();
    props.history.push(`/profile`)
  }

  useEffect(() => {
    if (Utils.getBearerToken()) {
      globalStore.loggedIn = true;
      getUserInfo();
    }
  }, []);

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <StyledTypography variant="h6" color="inherit">
            Logo
          </StyledTypography>
          {
            !globalStore.loggedIn ?
              <>
                <FacebookLogin
                  appId="2253032208279352"
                  autoLoad={false}
                  fields="name,email"
                  size="small"
                  callback={responseFacebook} />
                <Button color="inherit" onClick={() => setModalState({...modalState, login: true})}>Login</Button> /
                <Button color="inherit" onClick={() => setModalState({...modalState, signup: true})}>Signup</Button>
              </>
            :
              <>
                <Typography style={{marginRight: 10}}>
                  {globalStore.userInfo && (globalStore.userInfo.name || globalStore.userInfo.email)}
                </Typography>
                <Avatar src={process.env.PUBLIC_URL + (globalStore.userInfo && (globalStore.userInfo.pictureUrl || '/images/default_avatar.png'))} onClick={handleAvatarClick}/>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
          }

        </Toolbar>
      </AppBar>
      <ToastContainer />
      <LoginModal succeed={loginSucceed} open={modalState.login} onClose={() => setModalState({...modalState, login: false})} forgotPasswordClick={forgotPasswordClick}/>
      <SignupModal succeed={signupSucceed} open={modalState.signup} onClose={() => setModalState({...modalState, signup: false})}/>
      <ForgotPasswordModal succeed={forgotPasswordSucceed} open={modalState.forgotPassword} onClose={() => setModalState({...modalState, forgotPassword: false})} ></ForgotPasswordModal>
      <GlobalMessageModal open={modalState.globalMessage} onClose={() => setModalState({...modalState, globalMessage: false})}>{message}</GlobalMessageModal>
    </div>
  );
}

export default hot(module)(withRouter(view(App)));

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`
