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

import { useParams } from 'react-router-dom'
import { generateScriptTag, handleCopy } from 'utils/helperUtils'
import { COOKIE_MANAGER_BACKEND_URL } from 'static/staticVariables'
import LightBulb from 'assets/lightbulb.svg'
import CopyIcon from 'assets/copy.svg'

const StaticLinkMethod = () => {
  const { domainId } = useParams()
  const bannerUrl = `${COOKIE_MANAGER_BACKEND_URL}/ext/cookie-banner/static/${domainId}`
  const scriptTag = generateScriptTag(bannerUrl)

  return (
    <div className='implementation-container my-5' id='static-link-container'>
      <div className='implementation-container-top mb-4'>
        <div className='implementation-text relative'>
          <div className='implementation-head absolute'>
            <img src={LightBulb} alt='bulb' />
            <div className='font-bold bg-white px-2 py-1 rounded-lg'>How to implement code ? </div>
          </div>
          Copy the script tag and insert it as the very first script within the HEAD-tag of your website. The
          script tag will show the cookie banner on your website. If you are using Google Consent Mode or run
          ads on your website make sure your embed code runs before any Google tags.
          <div className='flex justify-end mt-1'>
            <button
              className='faint-scan-btn flex items-center copy-btn'
              id='btn-copy-script-tag'
              onClick={() => handleCopy(scriptTag)}
            >
              <img src={CopyIcon} alt='copy-icon' className='mr-2' /> Copy Script Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaticLinkMethod
