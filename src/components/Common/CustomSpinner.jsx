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

const CustomSpinner = ({ size = 'w-5 h-5', colorClass = 'border-blue-500' }) => (
  <div className={`inline-block ${size} border-2 border-t-transparent ${colorClass} rounded-full animate-spin`} />
)

export default CustomSpinner
