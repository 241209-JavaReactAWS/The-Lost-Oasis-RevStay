import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from './components/navbar/Navbar.tsx'
import Notifications from './views/notification/Notifications.tsx'
import LoginPage from './views/notification/LoginPage.tsx'
import RegisterPage from './views/notification/RegisterPage.tsx'
import Rooms from './components/rooms/Rooms.tsx'
import AdminHotelList from './views/admin-hotels/AdminHotelList.tsx'
import Hotel from './views/hotel/Hotel.tsx'
import Payment from './components/payment/Payment.tsx';

function App() {
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div id='App'>
              <BrowserRouter>
                  <Navbar/>
                  <Routes>
                  <Route path='/payment' element={<Payment/>}/>
                      <Route path='/notifications' element={<Notifications/>}/>
                      <Route path='/login' element={<LoginPage/>}/>
                      <Route path='/register' element={<RegisterPage/>}></Route>
                      <Route path='/notifications' element={<Notifications/>}/>
                      <Route path='admin/hotels/:hotelId/rooms' element={<Rooms/>}/>
                      <Route path='/admin/hotels' element={<AdminHotelList/>}/>
                      <Route path='/notifications' element={<Notifications/>}/>
                      <Route path='/hotel/:id' element={<Hotel/>}/>
                  </Routes>
              </BrowserRouter>
          </div>
      </LocalizationProvider>
  )
}

export default App
