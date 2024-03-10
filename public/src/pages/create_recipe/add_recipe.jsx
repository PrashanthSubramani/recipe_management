import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getSchemaForCreatePage } from '../../schemas';
import {useFormik} from 'formik';
import { useDispatch } from 'react-redux';
import { storeRecipe } from '../../slice/RecipeSlice';
import { ToastContainer, toast } from 'react-toastify';


function Add_recipe({ show, handleClose }) {

  const dispatch = useDispatch();

  const schema = getSchemaForCreatePage();

  const generateSuccess = (res) =>
    toast.success(res, {
        position: 'top-right',
    });

    const generateError = (res) =>
        toast.error(res, {
            position: 'top-right',
        });

  const onSubmit = async  (values, actions) => {
    try {
      const response = await dispatch(storeRecipe(values));

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
      recipe_name: "",
      short_description: "",
      recipe_image: "",
      instruction: "",
      user_id: localStorage.getItem('user_id')
    },
    validationSchema: schema,
    onSubmit: onSubmit,
  });



  return (
    <>
    <Modal show={show} onHide={handleClose} className='w-100' >
      <Modal.Header closeButton>
        <Modal.Title>Add Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} autoComplete="off" enctype="multipart/form-data" method="POST">
          <div className="row">
            <div className="col-md-12">

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
                <Form.Label>Recipe Image<span className='text-danger'>*</span></Form.Label>
                <Form.Control
                  type="file"
                  onBlur={handleBlur}
                  accept='image/*'
                  id="recipe_image"
                  name="recipe_image"
                  onChange={event => {
                    setFieldValue("recipe_image", event.currentTarget.files[0]); 
                  }}
                  className={errors.recipe_image && touched.recipe_image ? "input-error" : ""}
                />
                {errors.recipe_image && touched.recipe_image && <p className="text-danger">{errors.recipe_image}*</p>}
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
          </div>
          {/* disabled={isSubmitting}  */}
          <div className="mt-2 mb-2 float-end">
            <button type="submit" className='btn btn-primary buttonclr' >Add</button>&nbsp;

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


export default Add_recipe;