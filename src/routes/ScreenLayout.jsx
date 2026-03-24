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

import Sidebar from '../components/Layout/Sidebar'
import Navbar from 'components/Layout/Navbar'

const ScreenLayout = ({ children }) => {
  return (
    <div className='App'>
      <>
        <Navbar />
        <Sidebar />
      </>
      {children}
    </div>
  )
}

export default ScreenLayout
