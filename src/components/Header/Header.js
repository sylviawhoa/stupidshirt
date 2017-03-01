import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>Shirt Photobooth</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Shirts
    </IndexLink>
    {' · '}
    <Link to='/photobooth' activeClassName='route--active'>
      Photobooth
    </Link>
  </div>
)

export default Header
