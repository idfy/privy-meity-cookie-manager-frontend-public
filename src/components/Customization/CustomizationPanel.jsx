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

import { useContext } from 'react'
import { FiLayout } from 'react-icons/fi'
import { PiTextAlignLeft } from 'react-icons/pi'
import { MdOutlineColorLens } from 'react-icons/md'
import Layout from './Layout'
import Content from './Content'
import Color from './Color'
import TranslationModal from 'components/CustomModals/TranslationModal'
import { useTranslation } from 'contexts/TranslationContext'
import { CustomizationContext } from 'contexts/CustomizationContext'

const TABS = [
  {
    name: 'Layout',
    icon: <FiLayout className='text-[1.2rem]' />,
    component: <Layout />,
    extraClasses: 'rounded-tl-[10px]'
  },
  {
    name: 'Content',
    icon: <PiTextAlignLeft className='text-[1.2rem]' />,
    component: <Content />,
    extraClasses: ''
  },
  {
    name: 'Color',
    icon: <MdOutlineColorLens className='text-[1.2rem]' />,
    component: <Color />,
    extraClasses: ''
  }
]

const CustomizationPanel = () => {
  const { currentCustomization, setCurrentCustomization } = useContext(CustomizationContext)
  const { showTranslationModal, setShowTranslationModal } = useTranslation()
  const renderActiveTab = () => {
    const activeTab = TABS.find((tab) => tab.name === currentCustomization)
    return activeTab?.component ?? null
  }

  const handleTabClick = (tab) => {
    setCurrentCustomization(tab)
  }
  return (
    <>
      <div className='upper-container'>
        <div className='options'>
          {TABS.map((tab) => (
            <div
              key={tab.name}
              id={`btn-${String(tab.displayName).replace(/\s+/g, '-')}`}
              className={`option ${tab.extraClasses} ${currentCustomization === tab.name ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.name)}
            >
              {tab.icon}
              {tab.name}
            </div>
          ))}
        </div>
        <div className='preference-outer'>{renderActiveTab()}</div>
      </div>
      {showTranslationModal && <TranslationModal show={showTranslationModal} handleClose={() => setShowTranslationModal(false)} />}

    </>
  )
}

export default CustomizationPanel
