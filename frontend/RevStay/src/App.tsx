import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Navbar from './components/navbar/Navbar.tsx'
import Notifications from './views/notification/Notifications.tsx'
import LoginPage from './views/notification/LoginPage.tsx'
import axios from './services/axiosConfig.ts'
import RegisterPage from './views/notification/RegisterPage.tsx'
import Rooms from './components/rooms/Rooms.tsx'
import AdminHotelList from './views/admin-hotels/AdminHotelList.tsx'



function App() {
  return (
    <div id='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>

            <Route path='/notifications' element={<Notifications />} />
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/register' element={<RegisterPage/>} ></Route>
            <Route path='/notifications' element={<Notifications />} />
            <Route path='admin/hotels/:hotelId/rooms' element={<Rooms />} />
            <Route path='/admin/hotels' element={<AdminHotelList />} />
            <Route path='/notifications' element={<Notifications />} />
            <Route path='/hotel/:id' element={<Hotel />} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
