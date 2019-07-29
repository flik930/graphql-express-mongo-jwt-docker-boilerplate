import React from 'react';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const GlobalMessageModal = (props) => {
  console.log(props.children)
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <StyledCard>
        <Typography>
          {props.children}
        </Typography>
      </StyledCard>
    </Modal>
  )
}

export default GlobalMessageModal;


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