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

import error403 from 'assets/errors/403.svg'
import error404 from 'assets/errors/404.svg'
import error500 from 'assets/errors/500.svg'

export const ROWS_PER_PAGE_IN_TABLE = 10

export const PRIVY_WEBSITE_URL = window._env_.REACT_APP_PRIVY_WEBSITE_URL
export const CMS_HOME_PAGE_URL = window._env_.REACT_APP_CMS_HOME_PAGE_URL
export const COOKIE_MANAGER_BACKEND_URL = window._env_.REACT_APP_COOKIE_MANAGER_BACKEND_URL
export const COOKIE_MANAGER_ASSETS_URL = window._env_.REACT_APP_COOKIE_MANAGER_ASSETS_URL
export const IS_DEBUG_MODE = window._env_.REACT_APP_DEBUG_MODE === 'true'
export const LOGOUT_URL = window._env_.REACT_APP_LOGOUT_URL
export const LOGOUT_COOKIE_NAME = window._env_.REACT_APP_LOGOUT_COOKIE_NAME
export const MAX_POLLING_ATTEMPTS = 120
export const POLLING_INTERVAL = 5000
export const MAX_SOURCES = 5;
export const STATUS_STYLES = {
  completed: 'status-green',
  // eslint-disable-next-line camelcase
  in_progress: 'status-orange',
  failed: 'status-red',
  // eslint-disable-next-line camelcase
  categorizing_cookies: 'status-blue'
}

export const CONSENT_STATUSES = {
  accepted: { displayName: 'Accepted', cssClass: 'status-green' },
  rejected: { displayName: 'Rejected', cssClass: 'status-red' },
  partiallyAccepted: { displayName: 'Partially Accepted', cssClass: 'status-orange' }
}

export const BRIGHTNESS_THRESHOLD = 128
export const DISMISSIBLE_ALERT_TIMEOUT = 4000

export const COOKIE_CATEGORIES = ['NECESSARY', 'MARKETING', 'ANALYTICS', 'FUNCTIONAL']

export const SOURCE_TYPE_OPTION = [
  { label: 'EMBED', value: 'embed' },
  { label: 'IFRAME', value: 'iframe' },
  { label: 'IMG', value: 'img' },
  { label: 'SCRIPT', value: 'script' }
]
export const DESKTOP_COOKIE_NOTICE_POSITIONS = {
  box: [
    { position: 'top-left', label: 'Top Left', icon: 'desktopBox' },
    { position: 'top-right', label: 'Top Right', icon: 'desktopBox' },
    { position: 'bottom-left', label: 'Bottom Left', icon: 'desktopBox' },
    { position: 'bottom-right', label: 'Bottom Right', icon: 'desktopBox' }
  ],
  banner: [
    { position: 'bottom', label: 'Bottom', icon: 'desktopBanner' },
    { position: 'top', label: 'Top', icon: 'desktopBanner' }
  ]
}

export const MOBILE_COOKIE_NOTICE_POSITIONS = {
  boxTop: [{ position: 'top', label: 'Box Top', icon: 'mobileBannerTop' }],
  boxBottom: [{ position: 'bottom', label: 'Box bottom', icon: 'mobileBannerBottom' }]
}

export const PREFERENCE_NOTICE_POSITIONS = {
  box: [
    { position: 'left', label: 'Left Side', icon: 'PreferenceManagerLeft' },
    { position: 'right', label: 'Right Side', icon: 'PreferenceManagerRight' },
    { position: 'centre', label: 'Centre', icon: 'PreferenceManagerCentre' }
  ]
}

export const ERROR_DICT = {
  400: {
    alt: '400 Bad Request',
    redirectButtonText: 'Return to Homepage',
    redirectUrl: '/cms/cookie-manager/dashboard',
    message: 'Bad request',
    description: 'The request was invalid or malformed. Please check the inputs and try again.',
    imageSource: ''
  },
  401: {
    alt: '401 Unauthorized Access',
    redirectButtonText: 'Return to Homepage',
    redirectUrl: '/login',
    message: 'Unauthorized',
    description: 'You need to be logged in to access this page. Please log in and try again.',
    imageSource: ''
  },
  403: {
    alt: '403 Forbidden Access',
    redirectButtonText: 'Return to Homepage',
    redirectUrl: '/cms/cookie-manager/dashboard',
    message: 'Access denied',
    description: 'You do not have permission to access this page or perform this action.',
    imageSource: error403
  },
  404: {
    alt: '404 Page Not Found',
    redirectButtonText: 'Return to Homepage',
    redirectUrl: '/cms/cookie-manager/dashboard',
    message: 'Page not found',
    description:
      'The page you are looking for does not exist or has been moved. Check the URL or go back to the home page.',
    imageSource: error404
  },
  409: {
    alt: '409 Conflict Error',
    redirectButtonText: 'Return to Homepage',
    redirectUrl: '/cms/cookie-manager/dashboard/templates',
    message: 'Conflict detected',
    description:
      'A conflict occurred while processing your request. The resource may already exist or was modified.',
    imageSource: ''
  },
  500: {
    alt: '500 Internal Server Error',
    redirectButtonText: 'Return to Homepage',
    redirectUrl: '/cms/cookie-manager/dashboard',
    message: 'Something went wrong',
    description:
      'The server encountered an unexpected error. Please try again later or contact support if the problem persists.',
    imageSource: error500
  }
}

export const BANNER_TYPE_GENERAL = 'general'
export const TRANSLATION_ENABLED = window._env_.REACT_APP_TRANSLATION_ENABLED

export const CHAR_LIMITS = {
  en: {
    cookieCategoryDescription: 500,
    buttonText: 25,
    bannerHeading: 50,
    initialBannerDescription: 600,
    preferenceBannerDescription: 800
  },
  others: {
    cookieCategoryDescription: 500 * 1.5,
    buttonText: 25 * 1.5,
    bannerHeading: 50 * 1.5,
    initialBannerDescription: 600 * 1.5,
    preferenceBannerDescription: 800 * 1.5
  }
}
