import React, { useEffect, useState } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';


const Sidebar = ({sendDataToParent}) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  useEffect(() => {
      handleClick();
  }, []);

  function handleClick() {
    setShow(!show);
    sendDataToParent(show);
  }

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('_token');
    navigate('/login');
  };

  return (
    <>
      <header className={`header ${show ? 'space-toggle' : null}`}>
        <div className='header-toggle' onClick={handleClick}>
          <i className={`fa fa-bars ${show ? 'fa-solid fa-xmark' : null}`}></i>
        </div>
  
          <div className="p-1">
              {/* <p>Admin</p> */}
            <Dropdown>
              <Dropdown.Toggle  variant="secondary" className='bg-light text-dark' id="dropdown-basic" >
                <span><img className="round" width="20" height="20" src="/images/user.jpg" /></span> <span className="border-right"></span>&nbsp;{localStorage.getItem('username')}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="javascript:void(0)"  onClick={logout}><i className='fa fa-sign-out nav-link-icon fs-4'></i>&nbsp;Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

        </div>
      </header>

      <aside className={`sidebar ${show ? 'shows' : null}`}>
        <nav className='nav'>
          <div>
            <Link to='/'  className='nav-logo'>
              <i className={`fa fa-cutlery nav-logo-icon`}></i>
              <span className='nav-logo-name'>Recipe System</span>
            </Link>

            <div className='nav-list'>
              <Link to='/'  onClick={() => handleMenuClick('dashboard')} className={`text-white nav-link ${activeMenu === 'dashboard' ? 'active' : null}`}>
                <i className='fa fa-tachometer nav-link-icon fs-4'></i>
                <span className='nav-link-name'>Dashboard</span>
              </Link>
              <Link to='/create_recipe'  onClick={() => handleMenuClick('create_recipe')} className={`text-white nav-link ${activeMenu === 'create_recipe' ? 'active' : null}`}>
                <i className='fa fa-plus-circle nav-link-icon fs-4'></i>
                <span className='nav-link-name'>Create</span>
              </Link>
              <Link to='/view_chart'  onClick={() => handleMenuClick('view_chart')} className={`text-white nav-link ${activeMenu === 'view_chart' ? 'active' : null}`}>
                <i className='fa fa-bar-chart nav-link-icon fs-4'></i>
                <span className='nav-link-name'>Chart</span>
              </Link>
            </div>
          </div>

          <Link to='javascript:void(0);' onClick={logout} className='text-white nav-link'>
            <i className='fa fa-sign-out nav-link-icon fs-4'></i>
            <span className='nav-link-name'>Logout</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
