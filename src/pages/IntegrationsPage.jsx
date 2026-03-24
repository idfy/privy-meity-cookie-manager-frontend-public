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
import ScriptTagMethod from 'components/Integration/ScriptTagMethod'
import GtmMethod from 'components/Integration/GtmMethod'
import Tabs from 'components/Layout/Tabs'
import ErrorComponent from 'components/Common/ErrorComponent'

const IntegrationsPage = () => {
  const { errorCode } = useErrorCode()
  if (errorCode) return <ErrorComponent />

  const SUB_TABS = [
    { type: 'scriptTag', displayName: 'Script Tags', component: <ScriptTagMethod /> },
    { type: 'gtm', displayName: 'Google Tag Manager', component: <GtmMethod /> }
  ]

  const [activeSubTab, setActiveSubTab] = useState(SUB_TABS[0].type)

  return (
    <div className='user-activity-container' id='integration-tab'>
      <Tabs />
      <div className='current-tab flex'>
        {SUB_TABS.map((tab) => (
          <h3
            key={tab.type}
            id={`btn-${String(tab.displayName).replace(/\s+/g, '-')}`}
            className={`element text-sm px-4 py-2 my-0 cursor-pointer ${activeSubTab === tab.type ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.type)}
          >
            {tab.displayName}
          </h3>
        ))}
      </div>
      {SUB_TABS.find((tab) => tab.type === activeSubTab)?.component}
    </div>
  )
}

export default IntegrationsPage
