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

import { useState } from 'react'
import { useErrorCode } from 'contexts/ErrorContext'
import ScanHistory from 'components/Scans/ScanHistory'
import Tabs from 'components/Layout/Tabs'
import ErrorComponent from 'components/Common/ErrorComponent'
import 'styles/CookieManager.css'

const ScansPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('scan history')
  const { errorCode } = useErrorCode()
  if (errorCode) return <ErrorComponent />

  return (
    <div className='h-screen'>
      <div className='scan-container-main user-activity-container'>
        <Tabs />
        <div className='current-tab flex'>
          <h3
            className={`element text-sm px-4 py-2 my-0 cursor-pointer ${activeSubTab === 'scan history' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('scan history')}
          >
            Scan History
          </h3>
        </div>
        {activeSubTab === 'scan history' ? <ScanHistory /> : ''}
      </div>
    </div>
  )
}

export default ScansPage
