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
 * Pauses execution for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A Promise that resolves after the specified time.
 */
async function customSleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export { customSleep }
