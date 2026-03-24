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

import { Search } from 'components/Common/SvgComponents'
import { formatDate } from 'utils/helperUtils'

export const statCardFields = [
  {
    name: 'Scanned On',
    icon: Search,
    getData: (scanDetails) =>
      scanDetails?.created_at ? formatDate(scanDetails.created_at) : 'N/A'
  }
]
