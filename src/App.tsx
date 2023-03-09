import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Homepage from '../src/pages/Homepage'
import Nav from './components/Nav'
import { createClient } from '@supabase/supabase-js'
import CreateTemplatePage from './pages/CreateTemplatePage'
import EditSelectedTemplatePage from './pages/EditSelectedTemplatePage'
import CreateCampaignPage from './pages/CreateCampaignPage'
import EditCampaignPage from './pages/EditCampaignPage'
import DashboardPage from './pages/DashboardPage'

export const supabase = createClient(import.meta.env.VITE_REACT_APP_SUPABASE_PROJECT_URL, import.meta.env.VITE_REACT_APP_SUPABASE_API_KEY)
function App() {


  return (
    <div className="App">
      <Router>
        <Nav />
        <Routes>
          <Route element={<Homepage />} path='/' />
          <Route path='/dashboard' element={<DashboardPage />}>
            <Route index element={<CreateTemplatePage />} path='template' />
            <Route element={<CreateCampaignPage />} path='campaign' />
            <Route element={<EditCampaignPage />} path='campaign/:id' />
            <Route element={<EditSelectedTemplatePage />} path='template/:id' />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}


export default App
