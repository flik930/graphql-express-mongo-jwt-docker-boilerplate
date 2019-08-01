import React from 'react';
import Button from '@material-ui/core/Button';

const EditButton = (props) => {
  const { editMode, setEditMode, style } = props;

  return (
    <>
    {
      !editMode
      ?
        <Button style={style} onClick={()=> setEditMode(true)}> Edit </Button>
      :
        <Button style={style} onClick={()=> setEditMode(false)}> Cancel </Button>
    }
    </>
  )
}

export default EditButton;