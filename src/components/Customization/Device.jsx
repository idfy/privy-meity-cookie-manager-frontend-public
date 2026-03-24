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

import { useContext } from 'react'
import { TbDeviceDesktop } from 'react-icons/tb'
import { RxMobile } from 'react-icons/rx'
import { CustomizationContext } from 'contexts/CustomizationContext'

const Device = () => {
  const { activeDevice, setActiveDevice } = useContext(CustomizationContext)
  const devices = [
    { name: 'desktop', icon: <TbDeviceDesktop /> },
    { name: 'mobile', icon: <RxMobile /> }
  ]

  const handleActiveDevice = (device) => {
    setActiveDevice(device)
  }

  return (
    <>
      <div className='devices'>
        {devices.map((device) => (
          <div
            key={device.name}
            id={`btn-${device.name}-device`}
            className={`device ${device.name} icon ${activeDevice === device.name ? 'active' : ''}`}
            onClick={() => handleActiveDevice(device.name)}
          >
            {device.icon}
          </div>
        ))}
      </div>
    </>
  )
}

export default Device
