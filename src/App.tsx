import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Homepage from '../src/pages/Homepage'
import Nav from './components/Nav'
import { createClient } from '@supabase/supabase-js'
import CreateTemplatePage from './pages/CreateTemplatePage'
import EditSelectedTemplatePage from './pages/EditSelectedTemplatePage'
import SelectedTemplateContextProvider from './contexts/SelectedTemplateContext'
import Sidebar from './components/Sidebar'
import PageContainer from './components/PageContainer'
import CreateCampaignPage from './pages/CreateCampaignPage'
import EditCampaignPage from './pages/EditCampaignPage'
import Section from './components/Section'
import SelectedCampaignContextProvider from './contexts/SelectedCampaignContext'
import { useSession } from '@supabase/auth-helpers-react'
import TemplateList from './components/TemplateList'

export const supabase = createClient(import.meta.env.VITE_REACT_APP_SUPABASE_PROJECT_URL, import.meta.env.VITE_REACT_APP_SUPABASE_API_KEY)
function App() {

  const session = useSession()

  return (
    <div className="App">
      <Router>
        <SelectedTemplateContextProvider >
          <SelectedCampaignContextProvider>
            <Nav />
            {session?.user &&
              <Section>
                <TemplateList />
                <Routes>
                  <Route element={<Homepage />} path='/' />
                  <Route element={<CreateTemplatePage />} path='/template' />
                  <Route element={<CreateCampaignPage />} path='/campaign' />
                  <Route element={<EditCampaignPage />} path='/campaign/:id' />
                  <Route element={<EditSelectedTemplatePage />} path='/template/:id' />
                </Routes>
              </Section>
            }
          </SelectedCampaignContextProvider>
        </SelectedTemplateContextProvider>
      </Router>
    </div>
  )
}


export default App
