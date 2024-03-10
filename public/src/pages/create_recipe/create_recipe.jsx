import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Add_recipe from './add_recipe';
import Edit_recipe from './edit_recipe';
import withAuthentication from '../../auth/withAuthentication';
import { useDispatch } from 'react-redux';
import { deleteRecipe, getAllRecipe } from '../../slice/RecipeSlice';
import { toast } from 'react-toastify';

function Create_recipe() {

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    fetchAllRecipe();
  }

  const fetchAllRecipe = async () => {
    try {
      const currentUser = localStorage.getItem('user_id');
      const response = await dispatch(getAllRecipe(currentUser));
      setData(response.payload.response);
      setEditData(null);
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditRecipe = async (rowData) => {
    try {
      setEditData(rowData);
      handleShowModal();
    } catch (error) {
      console.log(error.message);
    }
  }

  const generateSuccess = (res) =>
    toast.success(res, {
      position: 'top-right',
    });

  const generateError = (res) =>
    toast.error(res, {
      position: 'top-right',
    });


  const handleDeleteRecipe = async (rowData) => {
    try {
      const response = await dispatch(deleteRecipe(rowData));

      if (response && response.payload.error === 0) {
        generateSuccess(response.payload.message);
        fetchAllRecipe();
      } else {
        generateError(response.payload.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }



  useEffect(() => {
    fetchAllRecipe();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const filteredData = data.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      Header: <b>Recipe Name</b>,
      accessor: 'name',
      Cell: row => (
        <div className='mt-2 mb-2' style={{ textAlign: 'center' }}>{row.value}</div>
      )
    }, {
      Header: <b>Description</b>,
      accessor: 'short_description',
      Cell: row => (
        <div className='mt-2 mb-2' style={{ textAlign: 'center' }}>{row.value}</div>
      )
    }, {
      Header: <b>Created at</b>,
      accessor: 'created_at',
      Cell: row => (
        <div className='mt-2 mb-2' style={{ textAlign: 'center' }}>{row.value}</div>
      )
    },
    {
      Header: <b>Action</b>,
      accessor: 'action',
      Cell: row => (
        <div className='mt-2 mb-2' style={{ textAlign: 'center' }}>
          <Button variant="primary" className="buttonclr btn-sm" onClick={() => handleEditRecipe(row.original)}>
            <i className='fa fa-pencil-square-o'></i>
          </Button>&nbsp;
          <Button variant="danger" className="btn-sm" onClick={() => handleDeleteRecipe(row.original)}>
            <i className='fa fa-trash'></i>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <Card className="shadow-sm p-3 mb-5 bg-white rounded" style={{ marginTop: "80px" }}>
        <Card.Body>
          <Card.Title><h4 className="text-muted">Admin > <span><i className='fa fa-plus-circle nav-link-icon'></i></span>&nbsp;Create Recipe</h4></Card.Title>
          <hr />
          <div className='d-flex justify-content-between'>
            <Button variant="primary mb-2" className="buttonclr" onClick={handleShowModal}><i className='fa fa-plus'></i>Add</Button>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" placeholder="Search" onChange={handleSearchChange} value={searchQuery} />
              </Form.Group>
            </Form>
          </div>
          <ReactTable
            data={filteredData}
            columns={columns}
            minRows={1}
            defaultPageSize={10}
          />
        </Card.Body>
      </Card>
      {editData === null ? (
        <Add_recipe show={showModal} handleClose={handleCloseModal} />
      ) : (
        <Edit_recipe show={showModal} handleClose={handleCloseModal} editData={editData} />
      )}

    </div>
  );
}

export default withAuthentication(Create_recipe);
