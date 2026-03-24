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

/**
 * Calculates the brightness of a given color.
 * Supports both hex and rgb color formats.
 *
 * @param {string} color - The color to calculate the brightness for. Can be in hex (#FFFFFF) or rgb (rgb(255, 255, 255)) format.
 * @returns {number|null} The brightness value (0-255), or `null` if the color format is unsupported.
 */

import { BRIGHTNESS_THRESHOLD } from 'static/staticVariables'

const getBrightness = (color) => {
  let r, g, b
  if (color.startsWith('#')) {
    const hex = color.substring(1)
    const bigint = parseInt(hex, 16)
    r = (bigint >> 16) & 255
    g = (bigint >> 8) & 255
    b = bigint & 255
  } else if (color.startsWith('rgb')) {
    const rgb = color.match(/\d+/g)
    r = parseInt(rgb[0])
    g = parseInt(rgb[1])
    b = parseInt(rgb[2])
  } else {
    console.warn(`Unsupported color format: ${color}`)
    return null
  }
  // Calculate brightness
  return (r * 299 + g * 587 + b * 114) / 1000
}

export const getTextColor = (backgroundColor) => {
  return getBrightness(backgroundColor) < BRIGHTNESS_THRESHOLD ? '#ffffff' : '#000000'
}

/**
 * Generates button styles for the accept button and two other buttons.
 * Genrates styles for Toggle color
 * The font color for the accept button is determined based on the brightness
 * of the background color chosen by the user. If the background color is dark,
 * the font color will be white; if light, the font color will be black.
 */
// export const getButtonStyle = (backgroundColor) => {
//     const isDarkBackground = getBrightness(backgroundColor) < 128;
//     const fontColor = isDarkBackground ? "white" : "black";

//     const acceptButtonStyle = {
//         backgroundColor,
//         border: `1px solid ${backgroundColor}`,
//         color: fontColor,
//     };

//     const buttonStyle = {
//         border: `1px solid ${backgroundColor}`,
//         color: backgroundColor,
//     };

//     const toggleStyle = {
//         backgroundColor,
//     };
//     return {
//         acceptButtonStyle,
//         buttonStyle,
//         toggleStyle,
//     };
// };

export const getDarkerShade = (color, percentage) => {
  const [r, g, b] = color.match(/\w\w/g).map((hex) => parseInt(hex, 16))
  const darken = (component) => Math.floor(component * (1 - percentage))
  return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`
}

export const getBannerStyles = (template) => {
  const {
    buttonColor,
    buttonTextColor,
    buttonBorderRadius,
    buttonFontWeight,
    headingColor,
    dropDownHeadingColor,
    dropDownHeadingFontWeight,
    dropDownContentFontSize,
    linkColor
  } = template

  return {
    acceptButtonStyle: {
      backgroundColor: buttonColor,
      border: `1px solid ${buttonColor}`,
      color: buttonTextColor,
      borderRadius: buttonBorderRadius,
      fontWeight: buttonFontWeight
    },
    buttonStyle: {
      border: `1px solid ${buttonColor}`,
      color: buttonColor,
      borderRadius: buttonBorderRadius,
      fontWeight: buttonFontWeight
    },
    toggleStyle: {
      backgroundColor: buttonColor
    },
    bannerHeading: {
      color: headingColor
    },
    dropdownHeading: {
      color: dropDownHeadingColor,
      fontWeight: dropDownHeadingFontWeight
    },
    dropdownContent: {
      fontSize: dropDownContentFontSize
    },
    link: {
      color: linkColor
    }
  }
}
