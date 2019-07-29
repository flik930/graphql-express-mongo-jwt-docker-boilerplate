import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import MemberService from '../services/memberService';
import * as Yup from 'yup';
import ErrorMsg from './common/ErrorMsg';

const Profile = (props) => {

  const [values, setValues] = React.useState({
    displayName: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const [errors, setErrors] = React.useState({});
  const [response, setResponse] = React.useState({});

  const handleSubmit = () => {
    schema.validate(values, {abortEarly: false}).then((valid) => {
      valid && MemberService.updateProfile(values).then((response) => {
        setResponse(response);
        setErrors({});
        //todo success
      }, (err) => {
        err.response && setResponse(err.response.data);
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

  })

  return (
    <StyledPaper>
      <Typography variant="h6" id="modal-title">
        Profile
      </Typography>
      <TextField
        id="standard-name"
        label="Display Name"
        value={values.email}
        onChange={handleChange('displayName')}
        margin="dense"
        variant="outlined"
      />
      <ErrorMsg>{errors.displayName && errors.displayName.message}</ErrorMsg>
      <br/>
      <ErrorMsg>
        {response && response.error}
      </ErrorMsg>
      <Button style={{float: 'right', marginTop: '10px'}} onClick={handleSubmit}>Update</Button>
    </StyledPaper>
  )
}

export default Profile;

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