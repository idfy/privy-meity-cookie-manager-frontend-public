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

import { useErrorCode } from 'contexts/ErrorContext'
import Templates from 'components/Templates/Templates'
import Tabs from 'components/Layout/Tabs'
import ErrorComponent from 'components/Common/ErrorComponent'

const TemplatesPage = () => {
  const { errorCode } = useErrorCode()
  if (errorCode) return <ErrorComponent />

  return (
    <div className='user-activity-container'>
      <Tabs />
      <Templates />
    </div>
  )
}

export default TemplatesPage
