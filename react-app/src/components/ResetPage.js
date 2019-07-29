import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import MemberService from '../services/memberService';
import * as Yup from 'yup';
import ErrorMsg from './common/ErrorMsg';
import Utils from '../utils/utils';
import { Link } from "react-router-dom";

const ResetPage = (props) => {

  const [values, setValues] = React.useState({
    password: '',
    token: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const [errors, setErrors] = useState({});
  const [resetResponse, setResetResponse] = useState({});
  const [successMsg, setSuccessMsg] = useState();

  useEffect(() => {
    setValues({...values, token: props.match.params.token});
  }, [])

  const handleSubmit = () => {
    schema.validate(values, {abortEarly: false}).then((valid) => {
      valid && MemberService.resetPassword(values).then((response) => {
        setResetResponse(response);
        Utils.setBearerToken(response.data.token);
        setErrors({});
        setSuccessMsg(<>Your password has been successfully reset, please return to <Link to="/">Home Page</Link> and login again.</>)
      }, (err) => {
        err.response && setResetResponse(err.response.data);
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
    password: Yup.string()
      .required('Required')
  })

  return (
      <StyledPaper>
        {
          successMsg
          ?
            successMsg
          :
            <>
              <Typography variant="h6" id="modal-title">
                Reset Password
              </Typography>
              <br/>
              <TextField
                id="standard-name"
                label="Reset Password"
                type="password"
                value={values.password}
                onChange={handleChange('password')}
                margin="dense"
                variant="outlined"
              />
              <ErrorMsg>{errors.password && errors.password.message}</ErrorMsg>
              <ErrorMsg>
                {resetResponse && resetResponse.error}
              </ErrorMsg>
              <Button style={{float: 'right', marginTop: '10px'}} onClick={handleSubmit}>Reset Password</Button>
            </>
        }
      </StyledPaper>
  )
}

export default ResetPage;

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