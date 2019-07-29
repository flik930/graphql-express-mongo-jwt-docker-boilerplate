import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import MemberService from '../services/memberService';
import * as Yup from 'yup';
import ErrorMsg from './common/ErrorMsg';
import Utils from '../utils/utils';

const ForgotPasswordModal = (props) => {

  const [values, setValues] = React.useState({
    email: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const [errors, setErrors] = React.useState({});
  const [forgotPasswordResponse, setForgotPasswordResponse] = React.useState({});

  const handleSubmit = () => {
    schema.validate(values, {abortEarly: false}).then((valid) => {
      valid && MemberService.forgotPassword(values).then((response) => {
        setForgotPasswordResponse(response);
        Utils.setBearerToken(response.data.token);
        setErrors({});
        props.succeed();
      }, (err) => {
        err.response && setForgotPasswordResponse(err.response.data);
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
      .required('Required')
  })

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <StyledPaper>
        <Typography variant="h6" id="modal-title">
          Forgot Password
        </Typography>
        <Typography variant="caption" id="modal-title">
          We will send you a password reset link to your email.
        </Typography>
        <TextField
          id="standard-name"
          label="Email"
          value={values.email}
          onChange={handleChange('email')}
          margin="dense"
          variant="outlined"
        />
        <ErrorMsg>{errors.email && errors.email.message}</ErrorMsg>
        <br/>
        <ErrorMsg>
          {forgotPasswordResponse && forgotPasswordResponse.error}
        </ErrorMsg>
        <Button style={{float: 'right', marginTop: '10px'}} onClick={handleSubmit}>Submit</Button>
      </StyledPaper>
    </Modal>
  )
}

export default ForgotPasswordModal;

const StyledPaper = styled('div')`
  top: 50%;
  left: 50%;
  background: white;
  transform: translate(-50%, -50%);
  position: absolute;
  width: 200px;
  padding: 30px;
  outline: none;
`