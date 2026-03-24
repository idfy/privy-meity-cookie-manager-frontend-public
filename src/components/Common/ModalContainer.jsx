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

import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/Modal'
import { CrossIcon } from './SvgComponents'
import 'styles/Modal.css'

const ModalContainer = ({ show, handleClose, children, dialogClass, title, titleClass = '', closeId = '', disableClose = false }) => {
  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName={dialogClass}>
      <div className={`modal-header ${titleClass}`}>
        <div className='w-[90%] text-center'>
          <div className='modal-title text-lg font-medium'>{title}</div>
        </div>
        <CrossIcon
          id={`btn-close-${closeId.replace(/\s+/g, '-')}`}
          fillColor='#484E56'
          className={`close-modal ${disableClose ? '!cursor-not-allowed opacity-50' : ''}`}
          onClick={disableClose ? undefined : handleClose}
        />
      </div>
      <div className='modal-inside-content'>{children}</div>
    </Modal>
  )
}

ModalContainer.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  dialogClass: PropTypes.string,
  title: PropTypes.string,
  titleClass: PropTypes.string,
  disableClose: PropTypes.bool,
  closeId: PropTypes.string
}

export default ModalContainer
