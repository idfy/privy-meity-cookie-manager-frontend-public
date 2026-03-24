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

import { useState, createContext } from 'react'

export const CustomizationContext = createContext()

const CustomizationProvider = ({ children }) => {
  const [designSettings, setDesignSettings] = useState(null)
  const [templateName, setTemplateName] = useState('')
  const [modifiedDesignFields, setModifiedDesignFields] = useState({})
  const [activeBanner, setActiveBanner] = useState('cookie-banner') // can be "cookie-banner" or "preference-banner"
  const [activeDevice, setActiveDevice] = useState('desktop') // can be "desktop" or "mobile" or "tablet"
  const [currentCustomization, setCurrentCustomization] = useState('Layout') // can be "Layout", "Content", or "Color"

  // Expansion states for content sections
  const [expandedSections, setExpandedSections] = useState({
    buttonContent: false,
    cookieBannerContent: false,
    preferencePanelContent: false,
    categoryDescriptions: false
  })

  const toggleExpansion = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const recordDesignFieldEdits = (fields) => {
    setModifiedDesignFields(prev => ({
      ...prev,
      ...fields
    }))
  }

  const clearDesignEdits = () => {
    setModifiedDesignFields({})
  }

  const getModifiedDesignValues = (designSettings) => {
    if (!designSettings) return {}
    return Object.fromEntries(
      Object.keys(modifiedDesignFields)
        .filter(key => key in designSettings)
        .map(key => [key, designSettings[key]])
    )
  }

  return (
    <CustomizationContext.Provider
      value={{
        designSettings,
        setDesignSettings,
        templateName,
        setTemplateName,
        activeBanner,
        setActiveBanner,
        activeDevice,
        setActiveDevice,
        currentCustomization,
        setCurrentCustomization,
        expandedSections,
        setExpandedSections,
        toggleExpansion,
        modifiedDesignFields,
        recordDesignFieldEdits,
        getModifiedDesignValues,
        clearDesignEdits
      }}
    >
      {children}
    </CustomizationContext.Provider>
  )
}

export default CustomizationProvider
