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

import { useContext, useState } from 'react'
import { CustomizationContext } from 'contexts/CustomizationContext'
import { getDarkerShade, getTextColor } from 'utils/styleUtils'

const Color = () => {
  const { designSettings, setDesignSettings, recordDesignFieldEdits } = useContext(CustomizationContext)
  const [inputColor, setInputColor] = useState(designSettings.buttonColor)
  const [isColorValid, setIsColorValid] = useState(true)

  const handleColorChange = (e) => {
    const color = e.target.value
    setInputColor(color)

    // Validate the color
    const isValidColor = /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(color)
    setIsColorValid(isValidColor)
    if (isValidColor) {
      const textColor = getTextColor(color)
      const hoverButtonColor = getDarkerShade(color, 0.12)
      const hoverTextColor = getTextColor(color)

      setDesignSettings((prev) => ({
        ...prev,
        buttonColor: color,
        hoverButtonColor,
        buttonTextColor: textColor,
        hoverTextColor
      }))
      recordDesignFieldEdits({
        buttonColor: true,
        hoverButtonColor: true,
        buttonTextColor: true,
        hoverTextColor: true
      })
    }
  }

  return (
    <div className='color-container p-3'>
      {/* <h3 className="section-head">Cookie Notice Theme</h3>
            <div className="theme-container">
                <div className="theme dark">
                    &nbsp;
                    <img src={darkIcon} alt="dark-theme-icon" /> &nbsp;
                </div>
                <div className="theme light">
                    &nbsp;
                    <img src={darkIcon} alt="dark-theme-icon" /> &nbsp;
                </div>
            </div> */}
      <h3 className='section-head'>Button Color</h3>
      <div>
        <div className='color-shade'>
          <div className='color-preview' onChange={handleColorChange}>
            <input
              type='color'
              id='color'
              name='color'
              value={designSettings.buttonColor}
              className='btn-color-input'
            />
          </div>
          <input
            type='text'
            name='btn-color'
            id='btn-color'
            value={inputColor}
            className='color-code'
            onChange={handleColorChange}
          />
        </div>
        {!isColorValid && <p className='error-line'>Invalid color code !</p>}
      </div>
    </div>
  )
}

export default Color
