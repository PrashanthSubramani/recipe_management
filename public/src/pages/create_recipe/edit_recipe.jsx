import React,{useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import basicSchema, { getSchemaForEditPage } from '../../schemas';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { editRecipe } from '../../slice/RecipeSlice'; // Import your editRecipe action
import { ToastContainer, toast } from 'react-toastify';

import Image from 'react-bootstrap/Image';


export default function Edit_recipe({ show, handleClose, editData }) { // Receive editData as a prop

  const dispatch = useDispatch();

  const schema = getSchemaForEditPage();

  const generateSuccess = (res) =>
    toast.success(res, {
      position: 'top-right',
    });

  const generateError = (res) =>
    toast.error(res, {
      position: 'top-right',
    });


  const onSubmit = async (values, actions) => {
    try {
      const response = await dispatch(editRecipe(values));

      if (response && response.payload.error === 0) {
        generateSuccess(response.payload.message);
      } else {
        console.log(response.payload.message);
      }
  } catch (error) {
      console.log(error.message);
  } finally {
      actions.resetForm();
      handleClose();
  }
  };

  const { values, handleBlur, setFieldValue, touched, isSubmitting, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      _id:editData ? editData._id : "",
      recipe_name: editData ? editData.recipe_name : "", // Populate initial values from editData if available
      short_description: editData ? editData.short_description : "",
      recipe_image: "",
      instruction: editData ? editData.instruction : "",
      user_id: localStorage.getItem('user_id')
    },
    validationSchema: schema,
    onSubmit: onSubmit,
  });


  useEffect(() => {
    if (editData) {
      setFieldValue('recipe_name', editData.name);
      setFieldValue('short_description', editData.short_description);
      setFieldValue('instruction', editData.instruction);
      setFieldValue('_id', editData._id);
    }
  }, [editData]);

  const renderImage = () => {
    if (editData) {
      return <Image src={`data:image/jpeg;base64,${editData.image}`}  thumbnail />;
    } else {
      return <div>Loading image...</div>;
    }
  };


  return (
    <>
    <Modal show={show} onHide={handleClose} className='w-100' size='xl' >
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} autoComplete="off" enctype="multipart/form-data" method="POST">
          <div className="row">
            <div className="col-md-8">

              <Form.Group className="mb-3">
                <Form.Label>Recipe Name<span className='text-danger'>*</span></Form.Label>
                <Form.Control type="text"
                  value={values.recipe_name}
                  onChange={handleChange}
                  id='recipe_name'
                  name="recipe_name"
                  placeholder="Enter recipe name"
                  onBlur={handleBlur}
                  className={errors.recipe_name && touched.recipe_name ? "input-error" : ""}
                />
                {errors.recipe_name && touched.recipe_name && <p className="text-danger">{errors.recipe_name}*</p>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Short Description<span className='text-danger'>*</span></Form.Label>
                <Form.Control type="text"
                  value={values.short_description}
                  onChange={handleChange}
                  id="short_description"
                  name="short_description"
                  onBlur={handleBlur}
                  placeholder="Enter short description"
                  className={errors.short_description && touched.short_description ? "input-error" : ""}
                />
                {errors.short_description && touched.short_description && <p className="text-danger">{errors.short_description}*</p>}
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>Recipe Instructions<span className='text-danger'>*</span></Form.Label>
                <ReactQuill
                  theme="snow"
                  value={values.instruction}
                  onChange={(content, delta, source, editor) => {
                    handleChange({
                      target: {
                        name: 'instruction',
                        value: editor.getHTML()
                      }
                    });
                  }}
                  placeholder='Enter recipe Instructions'
                  className={errors.instruction && touched.instruction ? "input-error" : ""}
                />
                {errors.instruction && touched.instruction && <p className="text-danger">{errors.instruction}*</p>}
              </Form.Group>

            </div>

            <div className='col-md-4'>
              <label htmlFor="">Current Image</label>
              {renderImage()}
            </div>
          </div>
          {/* disabled={isSubmitting}  */}
          <div className="mt-2 mb-2 float-end">
            <button type="submit" className='btn btn-primary buttonclr' >Update</button>&nbsp;

            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>

        </Form>
      </Modal.Body>
    </Modal>
    <ToastContainer></ToastContainer>
    </>
  )
}
