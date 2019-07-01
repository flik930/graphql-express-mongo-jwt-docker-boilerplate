import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

const LoginModal = (props) => {

  const [values, setValues] = React.useState({
    email: '',
    password: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.onClose}
    >
      <StyledPaper>
        {/* <Typography variant="h6" id="modal-title">
          Login
        </Typography> */}
        <TextField
          id="standard-name"
          label="Email"
          value={values.email}
          onChange={handleChange('email')}
          margin="dense"
          variant="outlined"
        />
        <br/>
        <TextField
          id="standard-name"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          margin="dense"
          variant="outlined"
        />
        <Button style={{float: 'right', marginTop: '10px'}}>Login</Button>
      </StyledPaper>
    </Modal>
  )
}

export default LoginModal;

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