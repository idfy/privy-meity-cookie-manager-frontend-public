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

export const TableConfig = {
  consentLogs: {
    columnNames: ['Data Principal Id', 'IP Address', 'Status', 'Created On'],
    paginationEnabled: true
  },
  domains: {
    columnNames: ['S.No.', 'Domain', 'Added on'],
    paginationEnabled: true
  },
  scanHistory: {
    columnNames: ['S.No.', 'Scan ID', 'Domain', 'Scanned On', 'Status', 'Action'],
    archivedColumnNames: ['S.No.', 'Scan ID', 'Domain', 'Deleted At', 'Status', 'Action'],
    paginationEnabled: true
  },
  individualScanResult: {
    columnNames: [' ', 'S.No.', 'Name', 'Category', 'Description', 'Host', 'Expiry', 'Action'],
    paginationEnabled: false
  },
  templates: {
    columnNames: ['S.No.', 'Template ID', 'Template Name', 'Status', 'Created On', 'Action'],
    archivedColumnNames: ['S.No.', 'Template ID', 'Template Name', 'Status', 'Deleted At', 'Action'],
    paginationEnabled: true
  },
  banners: {
    columnNames: ['S.No.', 'Script ID', 'Script Name', 'Scan ID', 'Template ID', 'Created On', 'Action'],
    archivedColumnNames: ['S.No.', 'Script ID', 'Script Name', 'Scan ID', 'Template ID', 'Deleted At', 'Action'],
    paginationEnabled: true
  }
}
