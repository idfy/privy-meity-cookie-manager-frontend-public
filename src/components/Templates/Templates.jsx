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
import { useNavigate, useParams } from 'react-router-dom'
import { useAlert } from 'contexts/AlertContext'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import CustomTable from 'components/Common/CustomTable'
import PreviewModal from 'components/CustomModals/PreviewModal'
import ArchivalModal from 'components/CustomModals/ArchivalModal'
import TableOptionsDropdown from 'components/Common/TableOptionsDropdown'
import { archiveTemplate, getAllTemplates, unArchiveTemplate } from 'services/template'
import { isSuccessfulResponse } from 'utils/helperUtils'
import { UserInfoContext } from 'contexts/UserInfoContext'

const Templates = () => {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [archivalModalState, setArchivalModalState] = useState({
    isOpen: false,
    actionType: null,
    itemId: null,
    itemName: null,
    itemType: 'template'
  })
  const [hasAccessError, setHasAccessError] = useState(false)
  const [errorResponse, setErrorResponse] = useState('')
  const { showAlertMessage } = useAlert()
  const { allTemplates, setAllTemplates, showingArchived, setShowingArchived } = useContext(DomainInfoContext)
  const navigate = useNavigate()
  const { domainId } = useParams()
  const { setSelectedTemplate } = useContext(UserInfoContext)

  const showArchivalModal = (actionType, templateId, templateName) => {
    setArchivalModalState({
      isOpen: true,
      actionType,
      itemId: templateId,
      itemName: templateName,
      itemType: 'template'
    })
  }

  const closeArchivalModal = () => {
    setArchivalModalState(prev => ({ ...prev, isOpen: false }))
  }

  const handleTemplateArchival = async (templateId) => {
    try {
      const response = await archiveTemplate(templateId)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Template deleted successfully', 'success')
        setAllTemplates((prev) => ({ ...prev, refetchTemplates: true }))
      } else {
        showAlertMessage(response.data.message || 'Failed to delete the template', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while deleting the template', 'error')
    }
  }

  const handleTemplateRestoration = async (templateId) => {
    try {
      const response = await unArchiveTemplate(templateId)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Template restored successfully', 'success')
        setAllTemplates((prev) => ({ ...prev, refetchTemplates: true }))
      } else {
        showAlertMessage(response.data.message || 'Failed to restore the template', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while restoring the template', 'error')
    }
  }

  const handleArchivalConfirm = async (templateId) => {
    await handleTemplateArchival(templateId)
    closeArchivalModal()
  }

  const handleRowClick = async (actionType, templateMeta) => {
    try {
      setSelectedTemplate({
        id: templateMeta.template_id,
        languageCode: 'en'
      })
      if (actionType === 'preview') {
        setShowModal(true)
      } else if (actionType === 'edit') {
        navigate(`/cms/cookie-manager/dashboard/edit-template/${domainId}/${templateMeta.template_id}`)
      } else if (actionType === 'archiveTemplate') {
        showArchivalModal('archive', templateMeta.template_id, templateMeta.name)
      } else if (actionType === 'unArchiveTemplate') {
        await handleTemplateRestoration(templateMeta.template_id)
      }
    } catch (error) {
      showAlertMessage('Something went wrong', 'error')
    }
  }

  const handleCreateTemplate = async () => {
    try {
      setSelectedTemplate({
        id: null,
        languageCode: 'en'
      })
      navigate(`/cms/cookie-manager/dashboard/create-template/${domainId}`)
    } catch (error) {
      showAlertMessage('Something went wrong', 'error')
    }
  }

  const handleAddTemplate = () => {
    if (hasAccessError) {
      showAlertMessage(errorResponse, 'error')
    } else {
      handleCreateTemplate()
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedTemplate({ id: null, languageCode: 'en' })
  }

  const fetchTemplates = async (archived = false) => {
    try {
      setLoading(true)
      const response = await getAllTemplates({
        currentPage,
        pageSize,
        show: 'all',
        archived: archived ? 'true' : 'false'
      })
      if (isSuccessfulResponse(response)) {
        setHasAccessError(false)
        setAllTemplates((prev) => ({
          ...prev,
          pageSize,
          currentPage,
          templates: response.data.templates,
          totalCount: response.data.total,
          refetchTemplates: false
        }))
      } else {
        setHasAccessError(true)
        const message = response.data.message || 'Error while fetching the templates'
        setErrorResponse(message)
        showAlertMessage(message, 'error')
      }
    } catch (error) {
      showAlertMessage('Error while fetching the templates', 'error')
    } finally {
      setLoading(false) // Set loading to false after API call
    }
  }

  const handleViewDeleted = async () => {
    setShowingArchived(prev => ({ ...prev, templates: true }))
    setCurrentPage(1) // Reset to first page
    await fetchTemplates(true)
  }

  const handleViewAll = async () => {
    setShowingArchived(prev => ({ ...prev, templates: false }))
    setCurrentPage(1) // Reset to first page
    await fetchTemplates(false)
  }

  useEffect(() => {
    if (!domainId) return
    if (
      !allTemplates ||
      allTemplates.pageSize !== pageSize ||
      allTemplates.currentPage !== currentPage ||
      allTemplates.refetchTemplates
    ) {
      fetchTemplates(showingArchived.templates)
    }
  }, [currentPage, pageSize, allTemplates.refetchTemplates, showingArchived.templates])

  if (loading) {
    return <div className='h-screen'>Loading...</div>
  }

  return (
    <div className='h-screen'>
      <div className='table-container bg-white p-4' id='templates-tab'>
        <div className='flex justify-between mb-4'>
          <h3 className='m-0'>{showingArchived.templates ? 'Recently Deleted Templates' : 'List of Templates'}</h3>
          <div className='flex items-center gap-3'>
            {!showingArchived.templates && (
              <button className='scan-btn' id='btn-create-template' onClick={handleAddTemplate}>
                Create Template
              </button>
            )}
            <TableOptionsDropdown
              id='templates-options-dropdown'
              onViewDeleted={handleViewDeleted}
              onViewAll={handleViewAll}
              showingArchived={showingArchived.templates}
            />
          </div>
        </div>

        <CustomTable
          id='templates-table'
          type='templates'
          data={allTemplates.templates}
          onRowClick={handleRowClick}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalCount={allTemplates?.totalCount || 0}
          showingArchived={showingArchived.templates}
        />
        {showModal && <PreviewModal show={showModal} handleClose={handleModalClose} />}
        {archivalModalState.isOpen && (
          <ArchivalModal
            isOpen={archivalModalState.isOpen}
            handleClose={closeArchivalModal}
            onConfirm={handleArchivalConfirm}
            actionType={archivalModalState.actionType}
            itemType={archivalModalState.itemType}
            itemId={archivalModalState.itemId}
            itemName={archivalModalState.itemName}
          />
        )}
      </div>
    </div>
  )
}

export default Templates
