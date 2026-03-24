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

import { Route, Routes } from 'react-router-dom'
import PreviewImageProvider from 'contexts/PreviewImageContext'
import IndividualScanResult from 'components/Scans/IndividualScanResult'
import CustomizationPage from 'pages/CustomizationPage'
import TemplatesPage from 'pages/TemplatesPage'
import ScansPage from 'pages/ScansPage'
import ScreenLayout from './ScreenLayout'
import IntegrationsPage from 'pages/IntegrationsPage'
import HomePage from 'pages/HomePage'
import ConsentLogsPage from 'pages/ConsentLogsPage'
import NotFoundPage from 'pages/404'

const AllRoutes = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path='/cms/cookie-manager/dashboard'
        element={
          <ScreenLayout>
            <HomePage />
          </ScreenLayout>
        }
      />
      <Route
        path='/cms/cookie-manager/dashboard/scans/:domainId'
        element={
          <ScreenLayout>
            <ScansPage />
          </ScreenLayout>
        }
      />
      <Route
        path='/cms/cookie-manager/dashboard/templates/:domainId'
        element={
          <PreviewImageProvider>
            <ScreenLayout>
              <TemplatesPage />
            </ScreenLayout>
          </PreviewImageProvider>
        }
      />
      <Route
        path='/cms/cookie-manager/dashboard/integration/:domainId'
        element={
          <PreviewImageProvider>
            <ScreenLayout>
              <IntegrationsPage />
            </ScreenLayout>
          </PreviewImageProvider>
        }
      />
      <Route
        path='/cms/cookie-manager/dashboard/scan-result/:domainId/:scanId'
        element={
          <ScreenLayout>
            <IndividualScanResult />
          </ScreenLayout>
        }
      />
      <Route
        path='/cms/cookie-manager/dashboard/edit-template/:domainId/:templateId'
        element={
          <PreviewImageProvider>
            <ScreenLayout>
              <CustomizationPage />
            </ScreenLayout>
          </PreviewImageProvider>
        }
      />
      <Route
        path='/cms/cookie-manager/dashboard/create-template/:domainId'
        element={
          <PreviewImageProvider>
            <ScreenLayout>
              <CustomizationPage />
            </ScreenLayout>
          </PreviewImageProvider>
        }
      />
      <Route
        path='/cms/cookie-manager/dashboard/consent-logs/:domainId'
        element={
          <ScreenLayout>
            <ConsentLogsPage />
          </ScreenLayout>
        }
      />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default AllRoutes
