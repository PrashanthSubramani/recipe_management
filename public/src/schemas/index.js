import * as yup from 'yup';

const FILE_SIZE = 16 * 1024 * 1024; 
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
];

 const basicSchema = yup.object().shape({
    recipe_name: yup.string().required("Field Required"),
    short_description: yup.string().required("Field Required"),
    recipe_image: yup
    .mixed()
    .required("A file is required"),
    instruction : yup.string().required("Field Required"),
})

export function getSchemaForEditPage() {
  return yup.object().shape({
    recipe_name: yup.string().required("Field Required"),
    short_description: yup.string().required("Field Required"),
    instruction: yup.string().required("Field Required"),
  });
}

export function getSchemaForCreatePage() {
  return basicSchema;
}

export default basicSchema;