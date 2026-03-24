/**
 * Open Bharat Digital Consent by IDfy
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 *
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 *
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

import 'styles/Navbar.css'
import HomeIcon from 'assets/home-icon.svg'
import { CMS_HOME_PAGE_URL } from 'static/staticVariables'

const Navbar = () => {
  const handleBackClick = () => {
    window.location.href = CMS_HOME_PAGE_URL
  }

  return (
    <div className='navbar-outer'>
      <nav className='navbar-inner'>
        <div className='header-left'>
          <h2 className='top-line'>Cookie Manager</h2>
        </div>

        <div className='header-right'>
          <button className='back-btn' onClick={handleBackClick}>
            <img src={HomeIcon} className='back-icon' alt='home-icon' />
            <span>Back to Home</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
