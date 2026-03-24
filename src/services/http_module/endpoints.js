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

import { COOKIE_MANAGER_BACKEND_URL, LOGOUT_URL } from 'static/staticVariables'

const AUTH_ENDPOINTS = {
  logout: {
    url: `${LOGOUT_URL}/logout`,
    method: 'post'
  }
}

const DOMAIN_ENDPOINTS = {
  addDomain: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/domain/add`,
    method: 'post'
  },
  showAllDomains: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/domains`,
    method: 'get'
  }
}

const SCANNER_ENDPOINTS = {
  initiateScan: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/scan-cookies`,
    method: 'post'
  },
  getScanHistory: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/scans`,
    method: 'get'
  },
  getIndividualScanResult: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/scan`,
    method: 'get'
  },
  updateScanResult: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookies/update`,
    method: 'patch'
  },
  archiveScan: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/scan/archive`,
    method: 'patch'
  },
  unArchiveScan: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/scan/unarchive`,
    method: 'patch'
  }
}

const BANNER_ENDPOINTS = {
  createBannerLink: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookie-banner/create`,
    method: 'post'
  },
  getAllBanners: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookie-banners`,
    method: 'get'
  },
  changeBannerStatus: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookie-banner/change-status`,
    method: 'patch'
  },
  archiveBanner: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookie-banner/archive`,
    method: 'patch'
  },
  unArchiveBanner: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookie-banner/unarchive`,
    method: 'patch'
  }
}

const TEMPLATE_ENDPOINTS = {
  getAllTemplates: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/templates`,
    method: 'get'
  },
  addTemplate: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/template/add`,
    method: 'post'
  },
  editTemplate: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/template/update`,
    method: 'put'
  },
  getTemplate: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/template`,
    method: 'get'
  },
  getBaseTemplate: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/template/base`,
    method: 'get'
  },
  archiveTemplate: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/template/archive`,
    method: 'patch'
  },
  unArchiveTemplate: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/template/unarchive`,
    method: 'patch'
  }
}

const CONSENT_LOGS_ENDPOINTS = {
  getConsentlogs: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/consent-logs`,
    method: 'get'
  }
}

const TRANSLATION_ENDPOINTS = {
  initiateScanTranslation: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/translate/scan`,
    method: 'post'
  },
  initiateTemplateTranslation: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/translate/template`,
    method: 'post'
  }
}

const COOKIE_ENDPOINTS = {
  addCookie: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookies/add`,
    method: 'post'
  },
  uploadCSV: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookies/upload-csv`,
    method: 'post'
  },
  deleteCookie: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookies/delete`,
    method: 'patch'
  },

  updateManualCookie: {
    url: `${COOKIE_MANAGER_BACKEND_URL}/cookies/update-manual-cookie`,
    method: 'patch'
  }
}

export {
  AUTH_ENDPOINTS,
  BANNER_ENDPOINTS,
  CONSENT_LOGS_ENDPOINTS,
  COOKIE_ENDPOINTS,
  DOMAIN_ENDPOINTS,
  SCANNER_ENDPOINTS,
  TEMPLATE_ENDPOINTS,
  TRANSLATION_ENDPOINTS
}
