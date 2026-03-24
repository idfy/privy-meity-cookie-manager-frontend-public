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

import CoverImage from 'assets/cover_page.png'
import LoginForm from 'components/Login/Login'
import 'styles/Signup.css'

const LoginPage = () => {
  return (
    <div className='signup-container'>
      <div className='signup-left-container'>
        <LoginForm />
      </div>
      <div className='signup-right-container'>
        <img src={CoverImage} alt='cover-image' className='cover-image' />
        <h3 className='tagline'>
          Eliminate Fraud, <br /> Establish Trust
        </h3>
      </div>
    </div>
  )
}

export default LoginPage
