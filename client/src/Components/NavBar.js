import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Styles.css'

import Frame from '../Assets/Frame.png'
import { UserContext } from '../Context/User-Context'

export default function NavBar({ title}) {

  const navigate = useNavigate()

  const [state, dispatch] = useContext(UserContext)

  // Function if user logout
  const logout = () => {
    dispatch({
      type: 'LOGOUT'
    })
    navigate('/auth')
    console.log(state)
  }
  
  return (
    <div className='header'>
      <Link to='/homepage'>
        <img src={Frame} alt='logo' className='header_logo' />
      </Link>

      <div className='header_nav'>
        <Link to='/user-complain' className={title === 'Complain' ? `text-navbar-active` : `text-navbar`}>Complain</Link>
        <Link to='/profile' className={title === 'Profile' ? `text-navbar-active` : `text-navbar`}>Profile</Link>
        <a onClick={logout} className='text-navbar'>Logout</a>
        </div>
    </div>
  )
}
