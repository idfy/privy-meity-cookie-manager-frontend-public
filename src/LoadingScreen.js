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

import React from 'react'
import './styles/LoadingScreen.css'
function LoadingScreen({ text }) {
  return (
    <div className='loading-screen'>
      <div className='spinner' />
      <p>{text}</p>
    </div>
  )
}

export default LoadingScreen
