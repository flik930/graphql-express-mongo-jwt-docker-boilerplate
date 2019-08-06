import React, {useState, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import MemberService from '../services/memberService';
import * as Yup from 'yup';
import ErrorMsg from './common/ErrorMsg';
import { useQuery, useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($profile: ProfileInput!) {
    updateProfile(profile: $profile) {
      displayName: name
      introduction
    }
  }
`

const GET_PROFILE = gql`
{
  profile {
    displayName: name
    introduction
    gender
  }
}
`

const Profile = (props) => {
  const [values, setValues] = useState({
    displayName: '',
    introduction: '',
    gender: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { data, loading, refetch } = useQuery(GET_PROFILE)

  useEffect(() => {
    refetch()
  }, [props.history.length])

  useEffect(() => {
    if (data && data.profile) {
      setValues(data.profile);
    }
  }, [data])


  const [updateProfile, mutationResponse] = useMutation(UPDATE_PROFILE, {
    variables: {profile: {
      name: values.displayName,
      introduction: values.introduction
    }}
  })

  useEffect(() => {
    if (mutationResponse && mutationResponse.data) {
      setValues(mutationResponse.data.updateProfile);
    }
  }, [mutationResponse])

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState({});

  const handleSubmit = () => {
    schema.validate(values, {abortEarly: false}).then((valid) => {
      valid && updateProfile();
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
        label="Display Name"
        value={values.displayName}
        onChange={handleChange('displayName')}
        error={errors.displayName}
        helperText={errors.displayName && errors.displayName.message}
        margin="dense"
        variant="outlined"
      />
      <TextField
        label="Introduction"
        value={values.introduction}
        onChange={handleChange('introduction')}
        error={errors.introduction && errors.introduction.message}
        helperText={errors.introduction && errors.introduction.message}
        multiline={true}
        rows={4}
        margin="dense"
        variant="outlined"
      />
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