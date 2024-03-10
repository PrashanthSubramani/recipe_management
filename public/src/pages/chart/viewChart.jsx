import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import { getAllRecipe } from '../../slice/RecipeSlice';

export default function ViewChart() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(4);
  const dispatch = useDispatch();
  const google = window.google;

  useEffect(() => {
    fetchAllRecipe();
  }, []); // Empty dependency array to trigger only once when the component mounts

  useEffect(() => {
    if (data.length > 0) {
      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(drawDualX);
    }
  }, [data]); // Trigger when data changes

  const drawDualX = () => {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Recipe'],
      ['2021',  0],
      ['2022',  0],
      ['2023',  0],
      ['2024',  count],
    ]);

    var options = {
      title: 'Recipe ',
      hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  };

  const fetchAllRecipe = async () => {
    try {
      const currentUser = localStorage.getItem('user_id');
      const response = await dispatch(getAllRecipe(currentUser));
      // Update the data array to include the showMore state for each item
      const updatedData = response.payload.response.map(item => ({ ...item, showMore: false }));
      setData(updatedData);
      setCount(updatedData.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='content'>
      <Card className="shadow-sm p-3 mb-5 bg-white rounded" style={{marginTop: "80px"}}>
        <Card.Body>
          <Card.Title><h4 className="text-muted">Admin > <span><i className='fa fa-bar-chart nav-link-icon '></i></span>&nbsp;Chart</h4></Card.Title>
          <hr />

          <div id="chart_div" style={{ width: '100%', height: '500px' }}>
            {/* Chart will be rendered here */}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
