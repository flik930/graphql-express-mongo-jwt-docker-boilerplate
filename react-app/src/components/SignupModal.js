import React from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import MemberService from '../services/memberService';
import * as Yup from 'yup';
import Utils from '../utils/utils';
import Card from '@material-ui/core/Card';

const SignupModal = (props) => {

  const [values, setValues] = React.useState({
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const [errors, setErrors] = React.useState({});

  const [signupResponse, setSignupResponse] = React.useState({});

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    schema.validate(values, {abortEarly: false}).then((valid) => {
      valid && MemberService.signup(values).then((response) => {
        setSignupResponse(response);
        Utils.setBearerToken(response.data.token);
        Utils.setUserInfo(response.data.user);
        setErrors({});
        props.succeed();
      }, (err) => {
        setSignupResponse(err.response.data);
      });
    }).catch(err => {
      let reducedErrors = err.inner.reduce(function(obj, e) {
        obj[e.path] = e;
        return obj;
      }, {});
      setErrors(reducedErrors)
    })
  }

  const schema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Required'),
    password: Yup.string()
      .required('Required'),
    passwordConfirmation: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
  })

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.onClose}
    >
      <StyledPaper>
        <TextField
          error={!!errors.email}
          id="standard-name"
          label="Email"
          value={values.email}
          onChange={handleChange('email')}
          margin="dense"
          variant="outlined"
        />
        <ErrorMsg>{errors.email && errors.email.message}</ErrorMsg>
        <TextField
          error={!!errors.password}
          id="standard-name"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          margin="dense"
          variant="outlined"
        />
        <ErrorMsg>{errors.password && errors.password.message}</ErrorMsg>
        <TextField
          error={!!errors.passwordConfirmation}
          id="standard-name"
          label="Confirm Password"
          type="password"
          value={values.passwordConfirmation}
          onChange={handleChange('passwordConfirmation')}
          margin="dense"
          variant="outlined"
        />
        <ErrorMsg>{errors.passwordConfirmation && errors.passwordConfirmation.message}</ErrorMsg>
        <ErrorMsg>
          {signupResponse && signupResponse.error}
        </ErrorMsg>
        <Button style={{float: 'right', marginTop: '10px'}} onClick={handleSubmit}>Signup</Button>
      </StyledPaper>
    </Modal>
  )
}

export default SignupModal;

const ErrorMsg = styled('div')`
  color: red;
`

const StyledPaper = styled(Card)`
  top: 50%;
  left: 50%;
  background: white;
  transform: translate(-50%, -50%);
  position: absolute;
  width: 200px;
  padding: 30px;
  outline: none;
`