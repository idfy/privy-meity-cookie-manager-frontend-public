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

import Offcanvas from 'react-bootstrap/Offcanvas'
import { CrossIcon } from './SvgComponents'

function DrawerContainer({
  show,
  handleClose,
  title,
  children,
  backdrop = true,
  className = '',
  headerClass = '',
  placement = 'end'
}) {
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement={placement}
      backdrop={backdrop}
      className={className}
    >
      <Offcanvas.Header className={headerClass}>
        <Offcanvas.Title className='!text-sm'>{title}</Offcanvas.Title>
        <CrossIcon
          height={14}
          width={14}
          fillColor='#484E56'
          className='close-modal'
          onClick={handleClose}
        />
      </Offcanvas.Header>
      <Offcanvas.Body>
        {children}
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default DrawerContainer
