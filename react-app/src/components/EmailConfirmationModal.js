import React from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

const EmailConfirmationModal = (props) => {
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.onClose}
    >
      <StyledCard>
        <Typography>
          <Icon style={{color: 'green'}}> done-outline</Icon>Signup Succeed, Please check your email for verification! Thanks.
        </Typography>
      </StyledCard>
    </Modal>
  )
}

export default EmailConfirmationModal;


const StyledCard = styled(Card)`
  top: 50%;
  left: 50%;
  background: white;
  transform: translate(-50%, -50%);
  position: absolute;
  width: 550px;
  padding: 30px;
  outline: none;
`