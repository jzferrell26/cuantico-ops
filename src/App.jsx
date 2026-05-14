// src/App.jsx

import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Deployments from './pages/Deployments.jsx'
import Tickets from './pages/Tickets.jsx'
import PendingWork from './pages/PendingWork.jsx'
import Events from './pages/Events.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/deployments" element={<Deployments />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/pending" element={<PendingWork />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </main>
    </div>
  )
}
