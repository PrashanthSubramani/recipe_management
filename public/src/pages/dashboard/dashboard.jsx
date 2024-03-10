import React,{useEffect, useState} from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import withAuthentication from '../../auth/withAuthentication';
import { getAllRecipe } from '../../slice/RecipeSlice';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ViewRecipe from './viewRecipe';

function Dashboard() {

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewData, setViewData] = useState(null);
  const [showModal, setShowModal] = useState(false);


  
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false)

  const fetchAllRecipe = async () => {
    try {
      const currentUser = localStorage.getItem('user_id');
      const response = await dispatch(getAllRecipe(currentUser));
      // Update the data array to include the showMore state for each item
      const updatedData = response.payload.response.map(item => ({ ...item, showMore: false }));
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllRecipe();
  }, []);

  const handleShowMoreClick = (index) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index].showMore = !newData[index].showMore;
      return newData;
    });
  }

  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const filteredData = data.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRecipe = async (rowData) => {
    try {
      setViewData(rowData);
      handleShowModal();
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const displaydata = filteredData.map((row, index) => (
    <Col xs='12' sm="12" xl="4" lg="4" key={index}>
      <Card>
        <Card.Img variant="top" className='recipe_list' src={`data:image/jpeg;base64,${row.image}`} />
        <Card.Body>
          <Card.Title>{row.name}</Card.Title>
          <Card.Text>
            <div className="show-hide-text wrapper">
              <p>
                {row.showMore ? row.short_description : `${row.short_description.substring(0, 100)}`}
                <button className="btn text-muted" onClick={() => handleShowMoreClick(index)}>
                  {row.showMore ? '...show less' : '...show more'}
                </button>
              </p>
            </div>
          </Card.Text>
          <Button variant="primary" className='buttonclr w-100' onClick={() => handleViewRecipe(row)}> <i className="fa fa-eye"></i> View</Button>
        </Card.Body>
      </Card> &nbsp;
    </Col>
  ));

  return (
        <div className='content'>
        <Card className="shadow-sm p-3 mb-5 bg-white rounded" style={{marginTop: "80px"}}>
          <Card.Body>
            <Card.Title><h4 className="text-muted">Admin > <span><i className='fa fa-tachometer nav-link-icon '></i></span>&nbsp;Dashboard</h4></Card.Title>
            <hr />

          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label><span><i className="fa fa-search text-muted"></i></span>&nbsp;Search Recipe</Form.Label>
              <Form.Control type="text" onChange={handleSearchChange} value={searchQuery} placeholder="Search" />
            </Form.Group>
          </Form>


          <Row>
              {displaydata}
          </Row>

          </Card.Body>
        </Card>

        <ViewRecipe  show={showModal} handleClose={handleCloseModal} viewData={viewData}></ViewRecipe>
        </div>
  )
}

export default withAuthentication(Dashboard);
