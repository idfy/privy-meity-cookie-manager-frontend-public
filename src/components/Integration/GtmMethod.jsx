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

import GtmLogo from 'assets/Gtm-logo.svg'
import GuideLogo from 'assets/guide-logo.svg'

const GtmMethod = () => {
  return (
    <div className='h-screen'>
      <div className='gtm-method-container' id='gtm-tab'>
        <div className='gtm-logo flex items-center'>
          <img src={GtmLogo} alt='gtm-logo' />
          <h3 className='gtm-name'>Google Tag Manager</h3>
        </div>
        <div className='flex items-center' id='gtm-guide-section'>
          <p className='m-0 text-sm'>
            Click View Guide for instructions on how to integrate with Google Tag Manager.
          </p>
          <button className='view-guide-button filter-btn ml-4' id='btn-view-gtm-guide'>
            <img src={GuideLogo} alt='guide-logo' className='h-4' />
            <a
              href='https://www.privyone.com/cookie-manager-implementation'
              target='blank'
              className='no-underline text-[var(--primary-color)]'
            >
              <h3 className='text-sm my-0 ml-2'>View Guide</h3>
            </a>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GtmMethod
