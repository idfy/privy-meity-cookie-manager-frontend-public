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

import { BrowserRouter as Router } from 'react-router-dom'
import CookieDataProvider from './contexts/CookieDataContext'
import DomainInfoProvider from 'contexts/DomainInfoContext'
import CustomizationProvider from 'contexts/CustomizationContext'
import { AlertProvider } from 'contexts/AlertContext'
import UserInfoProvider from 'contexts/UserInfoContext'
import { ErrorProvider } from 'contexts/ErrorContext'
import TranslationProvider from 'contexts/TranslationContext'
import AllRoutes from 'routes/AllRoutes'
import './App.css'

function App() {
  return (
    <Router>
      <ErrorProvider>
        <UserInfoProvider>
          <AlertProvider>
            <CookieDataProvider>
              <DomainInfoProvider>
                <CustomizationProvider>
                  <TranslationProvider>
                    <AllRoutes />
                  </TranslationProvider>
                </CustomizationProvider>
              </DomainInfoProvider>
            </CookieDataProvider>
          </AlertProvider>
        </UserInfoProvider>
      </ErrorProvider>
    </Router>
  )
}

export default App
