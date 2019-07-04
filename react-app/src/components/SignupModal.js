import React from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import MemberService from '../services/memberService';
import * as Yup from 'yup';

const SignupModal = (props) => {

  const [values, setValues] = React.useState({
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const [errors, setErrors] = React.useState({});

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    schema.validate(values, {abortEarly: false}).then((valid) => {
      valid && MemberService.signup(values);
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
        <br/>
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
        <Button style={{float: 'right', marginTop: '10px'}} onClick={handleSubmit}>Signup</Button>
      </StyledPaper>
    </Modal>
  )
}

export default SignupModal;

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