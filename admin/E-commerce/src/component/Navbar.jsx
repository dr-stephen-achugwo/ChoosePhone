import React from 'react'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAirFreshener, faBucket, faMobile, faRefresh, faStopwatch, faSwatchbook, faTelevision} from '@fortawesome/free-solid-svg-icons'
import {faHeadphones} from '@fortawesome/free-solid-svg-icons'
import {faTablet} from '@fortawesome/free-solid-svg-icons'
import {faLaptop} from '@fortawesome/free-solid-svg-icons'
import {faCamera} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../pages/AuthContext'; 
export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
    <div className='upperNavbar '>
    <div className="navbar bg-base-200">
  <div className="flex-1">
    {/* <Link to='/' className=" text-xl"><img src={Logo} alt="" width={"20%"} /></Link> */}
  </div>
  <div className="flex-none gap-2">
  <div className='login register'>
  {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to='/login'>Login</Link>
      )}
  </div>
  </div>
</div>
    </div>
    <div className='middleNavbar'>
    <div className="navbar bg-base-300">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2  shadow">
      <li><Link to='/'>Home</Link></li>
      <li className='bg-base-300'>
        <details >
          <summary><Link >Products</Link></summary>
          <ul className="p-4  ProductDropDown z-10">
            <li><Link to="/ProductPages"><FontAwesomeIcon icon={faMobile} />Phone</Link></li>
            <li><Link to="/TabletProductPages"><FontAwesomeIcon icon={faTablet} />Tablet</Link></li>
            <li><Link to="/LaptopProductPages"><FontAwesomeIcon icon={faLaptop} />Laptop</Link></li>
            <li><Link to="/HeadphoneProductPages"><FontAwesomeIcon icon={faHeadphones} />HeadPhone</Link></li>
            <li><Link to="/SmartwatchProductPages"><FontAwesomeIcon icon={faStopwatch} />Smartwatch</Link></li>
            <li><Link to="/TelevisionProductPages"><FontAwesomeIcon icon={faTelevision} />Television</Link></li>
            <li><Link to="/RefrigeratorProductPages"><FontAwesomeIcon icon={faRefresh} />Refrigerator</Link></li>
            <li><Link to="/washingmachineProductPages"><FontAwesomeIcon icon={faBucket} />Washingmachine</Link></li>
            <li><Link to="/CameraProductPages"><FontAwesomeIcon icon={faCamera} />Camera</Link></li>
            <li><Link to="/AirconditionerProductPages"><FontAwesomeIcon icon={faAirFreshener} />Airconditioner</Link></li>
          </ul>
        </details>
      </li>
      <li><Link to='/GuidPages'>Trends</Link></li>
      <li><Link to='/Aboutus'>About us</Link></li>
      </ul>
    </div>
    <a className="btn btn-ghost text-xl"></a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-4">
      <li><Link to='/'>Home</Link></li>
      <li className='bg-base-300'>
        <details >
          <summary><Link >Products</Link></summary>
          <ul className="p-4  ProductDropDown z-10">
            <li><Link to="/ProductPages"><FontAwesomeIcon icon={faMobile} />Phone</Link></li>
            <li><Link to="/TabletProductPages"><FontAwesomeIcon icon={faTablet} />Tablet</Link></li>
            <li><Link to="/LaptopProductPages"><FontAwesomeIcon icon={faLaptop} />Laptop</Link></li>
            <li><Link to="/HeadphoneProductPages"><FontAwesomeIcon icon={faHeadphones} />HeadPhone</Link></li>
            <li><Link to="/SmartwatchProductPages"><FontAwesomeIcon icon={faStopwatch} />Smartwatch</Link></li>
            <li><Link to="/TelevisionProductPages"><FontAwesomeIcon icon={faTelevision} />Television</Link></li>
            <li><Link to="/RefrigeratorProductPages"><FontAwesomeIcon icon={faRefresh} />Refrigerator</Link></li>
            <li><Link to="/washingmachineProductPages"><FontAwesomeIcon icon={faBucket} />Washingmachine</Link></li>
            <li><Link to="/CameraProductPages"><FontAwesomeIcon icon={faCamera} />Camera</Link></li>
            <li><Link to="/AirconditionerProductPages"><FontAwesomeIcon icon={faAirFreshener} />Airconditioner</Link></li>
          </ul>
        </details>
      </li>
      <li><Link to='/GuidPages'>Trends</Link></li>
      <li><Link to='/Aboutus'>About us</Link></li>
    </ul>
  </div>
  <div className="navbar-end">
  
  </div>
</div>
    </div>
    
    </>
  )
}
