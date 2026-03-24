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

import { useContext, useEffect } from 'react'
import { CustomizationContext } from 'contexts/CustomizationContext'
import ModalContainer from 'components/Common/ModalContainer'
import CookieBanner from 'components/Preview/CookieBanner'
import PreferenceManager from 'components/Preview/PreferenceManager'
import useScreenshotFetcher from 'hooks/useScreenshotFetcher'
import useTemplateData from 'hooks/useTemplateData'

const PreviewModal = ({ show, handleClose }) => {
  const { activeBanner, setActiveDevice, setActiveBanner } = useContext(CustomizationContext)
  useEffect(() => {
    setActiveDevice('desktop') // always show preview on desktop layout
    setActiveBanner('cookie-banner')
  }, [])
  useScreenshotFetcher()
  useTemplateData()

  return (
    <div className='modal-preview'>
      <ModalContainer
        show={show}
        handleClose={handleClose}
        dialogClass='min-w-[80vw] min-h-[80vh]'
        title='Preview Template'
        closeId='Preview-Template'
      >
        {activeBanner === 'preference-banner'
          ? <PreferenceManager classes='min-h-[80vh]' />
          : <CookieBanner classes='min-h-[80vh]' />}
      </ModalContainer>
    </div>
  )
}

export default PreviewModal
