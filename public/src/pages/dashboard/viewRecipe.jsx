import React from 'react';
import Modal from 'react-bootstrap/Modal';
import 'react-quill/dist/quill.snow.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactQuill from 'react-quill';

export default function viewRecipe({ show, handleClose, viewData}) {

    if (!viewData) {
        return null; 
    }

  return (
    <>
    <Modal show={show} onHide={handleClose} className='w-100' size='xl' >
      <Modal.Header closeButton>
        <Modal.Title>{viewData['name']}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Row>
        <Col sm={8}>
            <legend> Short Description</legend>
            <fieldset>
                {viewData['short_description']}
            </fieldset>
            <legend className='mt-2'> Instruction</legend>
            <ReactQuill
                value={viewData['instruction']}
                readOnly={true}
                theme={"bubble"}
                className='mt-0'
                />
        </Col>
        <Col sm={4}>
                <img src={`data:image/jpeg;base64,${viewData.image}`} className='recipe_list w-100' alt="" />
                <h4 className='mt-2 text-center'>{viewData['name']}</h4>
        </Col>
      </Row>
      </Modal.Body>
    </Modal>
    </>
  )
}
