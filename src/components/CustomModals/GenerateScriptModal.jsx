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

import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { useAlert } from 'contexts/AlertContext'
import { UserInfoContext } from 'contexts/UserInfoContext'
import CustomDropdown from 'components/Common/CustomDropdown'
import PreviewModal from 'components/CustomModals/PreviewModal'
import ModalContainer from 'components/Common/ModalContainer'
import InputBox from 'components/Common/InputBox'
import useBanners from 'hooks/useBanners'
import { createBannerLink } from 'services/banner'
import { getAllTemplates } from 'services/template'
import { getScanHistory } from 'services/scan'
import { logMessage, generateScriptTag, handleCopy, isSuccessfulResponse } from 'utils/helperUtils'
import { BANNER_TYPE_GENERAL } from 'static/staticVariables'
import LightBulb from 'assets/lightbulb.svg'
import CopyIcon from 'assets/copy.svg'

const GenerateScriptModal = ({ show, handleClose }) => {
  const [selectedScan, setSelectedScan] = useState(null)
  const [selectedTemplateMeta, setSelectedTemplateMeta] = useState(null)
  const [allTemplates, setAllTemplates] = useState()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scriptTag, setScriptTag] = useState('')
  const [apiResponseLoading, setApiResponseLoading] = useState(false)
  const [completedScans, setCompletedScans] = useState([])
  const [scriptTagName, setScriptTagName] = useState('')
  const [hasUncategorizedCookies, setHasUncategorizedCookies] = useState(false)
  const { selectedDomain } = useContext(DomainInfoContext)
  const { setSelectedTemplate } = useContext(UserInfoContext)
  const { fetchBanners } = useBanners()
  const { showAlertMessage } = useAlert()
  const navigate = useNavigate()
  const domainId = selectedDomain.domain_id

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const currentPage = 1
        const pageSize = 100
        const response = await getAllTemplates({ currentPage, pageSize })
        if (isSuccessfulResponse(response)) {
          setAllTemplates(response.data.templates)
        } else {
          showAlertMessage(response.data.message || 'Error while fetching templates', 'error')
        }
      } catch (error) {
        showAlertMessage('Error while fetching templates', 'error')
      } finally {
        setLoading(false) // Set loading to false after API call
      }
    }
    fetchTemplates()
  }, [])

  useEffect(() => {
    if (!domainId) return
    const fetchCompletedScans = async () => {
      try {
        const currentPage = 1
        const pageSize = 100
        const status = 'completed'
        const response = await getScanHistory({ domainId, currentPage, pageSize, status })
        if (isSuccessfulResponse(response)) {
          const scans = response.data.scans
          setCompletedScans(scans)
        } else {
          showAlertMessage(response.data.message || 'Failed to fetch the scan history', 'error')
        }
      } catch (error) {
        showAlertMessage('Failed to fetch the scan history', 'error')
      }
    }
    fetchCompletedScans()
  }, [domainId])

  const formattedScanResults =
    completedScans?.map((scan) => ({
      value: scan,
      label: `${scan.name} - ${new Date(scan.created_at).toLocaleString()}`
    })) || []

  const formattedTemplateResults =
    allTemplates?.map((template) => ({
      value: template,
      label: template.name
    })) || []

  const handleGenerateBannerlink = async () => {
    try {
      if (!scriptTagName.trim()) {
        showAlertMessage('Tag name is required to generate banner', 'notice')
        return
      }

      setApiResponseLoading(true)
      setHasUncategorizedCookies(false)

      const bannerType = BANNER_TYPE_GENERAL

      const response = await createBannerLink(
        selectedTemplateMeta.value.template_id,
        domainId,
        selectedScan.value.scan_id,
        scriptTagName,
        bannerType
      )

      logMessage('response after creating link', response)

      if (isSuccessfulResponse(response)) {
        const generatedScriptTag = generateScriptTag(response.data.banner_link)
        setScriptTag(generatedScriptTag)
        await fetchBanners({ domainId, currentPage: 1, pageSize: 10 })
      } else if (response.status === 422) {
        setHasUncategorizedCookies(true)
      } else {
        showAlertMessage(response.data.details || 'Something went wrong while generating banner', 'error')
      }

      setApiResponseLoading(false)
    } catch (error) {
      console.error('Error generating banner link:', error)
      showAlertMessage('Failed to generate the cookie banner', 'error')
    }
  }

  const handleShowPreview = () => {
    if (!selectedTemplateMeta) {
      showAlertMessage('Please select a template before previewing.', 'notice')
    } else {
      setSelectedTemplate({
        id: selectedTemplateMeta.value.template_id,
        languageCode: 'en'
      })
      setShowModal(true)
    }
  }

  const isButtonActive = selectedScan && selectedTemplateMeta
  useEffect(() => {
    const generateButtonElement = document.querySelector('.generate-btn')
    if (generateButtonElement) {
      if (isButtonActive && !apiResponseLoading) {
        generateButtonElement.classList.remove('inactive')
        generateButtonElement.disabled = false
      } else {
        generateButtonElement.classList.add('inactive')
        generateButtonElement.disabled = true
      }
    } else {
      logMessage('Generate button element not found', '', 'error')
    }
  }, [isButtonActive, apiResponseLoading])

  async function goToCategorization() {
    navigate(`/cms/cookie-manager/dashboard/scan-result/${domainId}/${selectedScan.value.scan_id}`)
  }

  if (loading) {
    return <div>Loading...</div> // Show loading indicator until data is fetched
  }

  return (
    <ModalContainer
      show={show}
      handleClose={handleClose}
      dialogClass='min-w-[80vw] min-h-[80vh]'
      title='Generate Script Tag'
      closeId='Generate-Script-Tag'
    >
      <div className='integration-container'>
        <div className='items-center gap-2 mb-4 w-[49%]'>
          <h3 className='text-sm font-semibold whitespace-nowrap mb-2'>Script Tag Name </h3>
          <div className='flex gap-2'>
            <InputBox
              type='text'
              name='Name'
              placeholder='Script Tag 1'
              className='h-9'
              value={scriptTagName}
              onChange={(e) => setScriptTagName(e.target.value)}
            />

          </div>
        </div>
        <div className='integration-container-top flex gap-4'>
          <div className='w-[50%]'>
            <CustomDropdown
              label='Scan Results'
              id='scan-result-dropdown'
              placeholder='Select Scan Result'
              options={formattedScanResults}
              selectedOption={selectedScan}
              onOptionSelect={setSelectedScan}
            />
          </div>
          <div className='w-[50%]'>
            <CustomDropdown
              label='Templates'
              id='template-select-dropdown'
              placeholder='Select Template'
              options={formattedTemplateResults}
              selectedOption={selectedTemplateMeta}
              onOptionSelect={setSelectedTemplateMeta}
            />
          </div>
        </div>
        <div className='text-xs text-[var(--primary-color)] font-bold text-right mt-2'>
          <p id='btn-preview-template' onClick={() => handleShowPreview()} className='inline-block cursor-pointer'>
            Preview Template
          </p>
        </div>
        <div className='text-right mt-4'>
          {isButtonActive && (
            <button
              className='faint-scan-btn'
              id='btn-clear-selection'
              disabled={!isButtonActive}
              onClick={() => {
                setSelectedScan(null)
                setSelectedTemplateMeta(null)
                setScriptTag('') // Clear script tag on reset
              }}
            >
              Clear
            </button>
          )}
          <button className='text-sm generate-btn inactive' id='btn-generate-script' onClick={handleGenerateBannerlink}>
            Generate Script Tag
          </button>
        </div>
        {hasUncategorizedCookies && (
          <div className='error-line'>
            <p>
              Some cookies are uncategorised in the selected scan, click{' '}
              <span className='redirect-url' onClick={goToCategorization}>
                here
              </span>{' '}
              to categorise.
            </p>
          </div>
        )}

        <hr className='line' />
        <div className='implementation-container mt-5'>
          <div className='implementation-container-top mb-4'>
            <div className='implementation-text relative'>
              <div className='implementation-head absolute'>
                <img src={LightBulb} alt='bulb' />
                <div className='font-bold bg-white px-2 py-1 rounded-lg'>How to implement code ? </div>
              </div>
              Copy the script tag and insert it as the very first script within the HEAD-tag of your
              website. The script tag will show the cookie banner on your website. If you are using Google
              Consent Mode or run ads on your website make sure your embed code runs before any Google
              tags.
            </div>
          </div>
          <h3 className='text-base font-bold text-left'>Script Tag</h3>
          <div className='script-link text-sm text-left'>
            {apiResponseLoading === true
              ? (
                <p className='placeholder-text'>Loading script tag for banner...</p>
              )
              : (
                scriptTag || (
                  <p className='placeholder-text'>The script tag will appear here after generation.</p>
                )
              )}
          </div>
          <div className='flex justify-end mt-4'>
            <button
              className='faint-scan-btn flex items-center copy-btn'
              id='btn-copy-script-tag'
              onClick={() => handleCopy(scriptTag)}
            >
              <img src={CopyIcon} alt='copy-icon' className='mr-2' /> Copy Script Tag
            </button>
          </div>
        </div>
        {showModal && <PreviewModal show={showModal} handleClose={() => setShowModal(false)} />}
      </div>
    </ModalContainer>
  )
}

export default GenerateScriptModal
