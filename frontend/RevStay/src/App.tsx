import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from './components/navbar/Navbar.tsx'
import Notifications from './views/notification/Notifications.tsx'
import LoginPage from './views/login/LoginPage.tsx'
import RegisterPage from './views/login/RegisterPage.tsx'
import Rooms from './components/rooms/Rooms.tsx'
import AdminHotelList from './views/admin-hotels/AdminHotelList.tsx'
import Hotel from './views/hotel/Hotel.tsx'
import Payment from './components/payment/Payment';
import {AuthProvider} from './hooks/AuthProvider.tsx'
import ManageReservations from './views/reservations/ManageReservations.tsx'
import OwnersBooking from './views/owners-booking/owners_booking.tsx';
import SearchFilter from './components/search-filter/SearchFilter.tsx';
import OwnersReview from './views/owners-reviews/owners_review.tsx';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
                <div id='App'>
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path='/payment' element={<Payment />} />
                            <Route path='/notifications' element={<Notifications />} />
                            <Route path='/login' element={<LoginPage />} />
                            <Route path='/register' element={<RegisterPage />}></Route>
                            <Route path='admin/hotels/:hotelId/rooms' element={<Rooms />} />
                            <Route path='/admin/hotels/:hotelId/bookings' element={<OwnersBooking />} />
                            <Route path='/admin/hotels/:hotelId/reviews' element={<OwnersReview />} />
                            <Route path='/owner-dashboard' element={<AdminHotelList />} />
                            <Route path='/hotel/:id' element={<Hotel />} />
                            <Route path='/reservations' element={<ManageReservations />} />
                            <Route path='/' element={<SearchFilter />} />
                        </Routes>
                    </Router>
                </div>
            </AuthProvider>
        </LocalizationProvider>
    )
}

export default App
