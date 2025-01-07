import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router'
import Navbar from './components/navbar/Navbar.tsx'
import Notifications from './views/notification/Notifications.tsx'

function App() {
  return (
    <div id='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path='/notifications' element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
