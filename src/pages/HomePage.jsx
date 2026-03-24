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
import DomainAddition from 'components/DomainAddition/DomainAddition'
import ErrorComponent from 'components/Common/ErrorComponent'

const HomePage = () => {
  const { errorCode } = useErrorCode()
  if (errorCode) return <ErrorComponent />

  return <DomainAddition />
}

export default HomePage
