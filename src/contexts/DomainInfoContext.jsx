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

import { createContext, useState } from 'react'

export const DomainInfoContext = createContext()

const DomainInfoProvider = ({ children }) => {
  const [selectedDomain, setSelectedDomain] = useState('')
  const [allDomains, setAllDomains] = useState([])
  const [allScans, setAllScans] = useState([])
  const [allTemplates, setAllTemplates] = useState([])
  const [allBanners, setAllBanners] = useState([])
  const [consentLogs, setConsentLogs] = useState([])
  const [showingArchived, setShowingArchived] = useState({
    banners: false,
    templates: false,
    scans: false
  })
  return (
    <DomainInfoContext.Provider
      value={{
        selectedDomain,
        setSelectedDomain,
        allDomains,
        setAllDomains,
        allScans,
        setAllScans,
        allTemplates,
        setAllTemplates,
        allBanners,
        setAllBanners,
        consentLogs,
        setConsentLogs,
        showingArchived,
        setShowingArchived
      }}
    >
      {children}
    </DomainInfoContext.Provider>
  )
}

export default DomainInfoProvider
