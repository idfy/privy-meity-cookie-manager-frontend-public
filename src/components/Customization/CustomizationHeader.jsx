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

import BackArrow from 'assets/back-arrow.svg'
import FileSaveIcon from 'assets/file.svg'
import InputBox from 'components/Common/InputBox'

const CustomizationHeader = ({
  templateName,
  setTemplateName,
  handleBack,
  handleSubmitTemplate,
  isSubmitButtonDisabled
}) => (
  <div className='scan-result-header mb-4 flex justify-between items-center'>
    <div className='flex items-center'>
      <img
        src={BackArrow}
        alt='back-arrow'
        className='cursor-pointer'
        onClick={handleBack}
      />
      <h3 className='text-lg ml-2 mb-0 font-bold'>Back</h3>
    </div>

    <div className='flex items-center gap-2'>
      <div className='template-name flex items-center gap-2'>
        <h3 className='text-sm font-semibold whitespace-nowrap mb-0'>Template name :</h3>
        <InputBox
          type='text'
          name='Name'
          placeholder='Blue Template'
          className='!py-0 !border-none'
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmitTemplate}
        disabled={isSubmitButtonDisabled}
        className={`scan-btn flex items-center gap-2 h-fit ${isSubmitButtonDisabled ? 'disabled' : ''}`}
        id='btn-save-template'
      >
        Save
        <img src={FileSaveIcon} alt='save' className='w-4 h-4' />
      </button>
    </div>
  </div>
)

export default CustomizationHeader
