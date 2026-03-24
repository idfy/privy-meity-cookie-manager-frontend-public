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

import CrossIcon from 'assets/cross.svg'

const SelectedOptions = ({ setterFunction, options }) => {
  const handleRemove = (categoryToRemove) => {
    setterFunction((prev) => prev.filter((category) => category !== categoryToRemove))
  }

  return (
    <div className='selected-categories flex flex-wrap gap-1 mt-2 overflow-x-auto mb-2'>
      {options.map((option, index) => (
        <div className='selected-category flex items-center' key={index}>
          <p className='m-0 pr-1'>{option}</p>
          <img src={CrossIcon} alt='cross-icon' className='h-4' onClick={() => handleRemove(option)} />
        </div>
      ))}
    </div>
  )
}

export default SelectedOptions
