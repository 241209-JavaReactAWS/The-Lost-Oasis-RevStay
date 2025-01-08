import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Navbar from './components/navbar/Navbar.tsx'
import Notifications from './views/notification/Notifications.tsx'
import Rooms from './components/rooms/Rooms.tsx'
import AdminHotelList from './views/admin-hotels/AdminHotelList.tsx'

function App() {
  return (
    <div id='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/notifications' element={<Notifications />} />
          <Route path='admin/hotels/:hotelId/rooms' element={<Rooms />} />
          <Route path='/admin/hotels' element={<AdminHotelList />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
