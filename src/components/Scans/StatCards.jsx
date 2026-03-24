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

import { statCardFields } from 'configs/StatCardConfig'

const StatCards = ({ cookieData, scanDetails }) => {
  const cards = cookieData
    ? statCardFields.map(field => ({
      name: field.name,
      icon: field.icon,
      data: field.getData(scanDetails)
    }))
    : []

  return (
    <div className='flex gap-2'>
      {cards.map((card, index) => (
        <div className='scan-card flex px-3 py-2 items-center' key={index}>
          <card.icon className='mr-2' />
          <div
            className={`scan-card-info flex text-left ${card.name === 'Scanned On' ? 'flex-col' : ''
              }`}
          >
            <h3 className='text-sm my-0'>{card.name} :</h3>
            <h3 className='font-bold text-sm my-0'>{card.data}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatCards
