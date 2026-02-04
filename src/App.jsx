import RequestPage from './pages/RequestPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function App() {
  const path = window.location.pathname || '/'
  if (path.startsWith('/admin')) {
    return <AdminPage />
  }
  return <RequestPage />
}

export default App
