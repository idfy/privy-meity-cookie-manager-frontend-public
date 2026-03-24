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

import DomainSelector from '../Common/DomainSelector'
import { NavLink, useParams } from 'react-router-dom'
import 'styles/Tabs.css'

const TABS = [
  { name: 'Scans', path: '/cms/cookie-manager/dashboard/scans' },
  { name: 'Templates', path: '/cms/cookie-manager/dashboard/templates' },
  { name: 'Integration', path: '/cms/cookie-manager/dashboard/integration' },
  { name: 'Consent Logs', path: '/cms/cookie-manager/dashboard/consent-logs' }
]

const Tabs = () => {
  const { domainId } = useParams()
  return (
    <>
      <div className='tabs-container'>
        <ul className='tabs'>
          {TABS.map((tab) => (
            <li key={tab.name}>
              <NavLink
                id={`btn-${String(tab.name).replace(/\s+/g, '-')}`}
                to={`${tab.path}/${domainId}`}
                className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
              >
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className='domain-selection'>
          <DomainSelector />
        </div>
      </div>
    </>
  )
}

export default Tabs
