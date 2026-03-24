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

import LogoutIcon from 'assets/logout-icon.svg'
import logo from 'assets/privy-logo-white.png'
import { logout } from 'services/auth'
import { CMS_HOME_PAGE_URL } from 'static/staticVariables'
import 'styles/Sidebar.css'
import { logMessage } from 'utils/helperUtils'

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await logout()

      setTimeout(() => {
        window.location.href = `${CMS_HOME_PAGE_URL}/login`
      }, 300)
    } catch (error) {
      logMessage('error logging out', error, 'error')
      // Redirect to login even if logout API fails
      setTimeout(() => {
        window.location.href = `${CMS_HOME_PAGE_URL}/login`
      }, 300)
    }
  }

  return (
    <div className='sidebar'>
      <div className='logo'>
        <a href='/cms/cookie-manager/dashboard/'>
          <img className='sidebar-logo' id='btn-logo-home' src={logo} alt='logo' />
        </a>
      </div>

      <div className='logout' onClick={handleLogout}>
        <img className='h-[40%] cursor-pointer' id='btn-logout' src={LogoutIcon} alt='logout-icon' />
      </div>
    </div>
  )
}

export default Sidebar
