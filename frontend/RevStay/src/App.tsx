import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Filter from './components/filter/Filter'
import GuestBookings from './components/guestBookings/GuestBookings'
import ModifyListings from './components/modifyListings/ModifyListings'
import Search from './components/search/Search'
import ViewHotels from './components/viewHotels/ViewHotels'
import React, {createContext, useState} from "react"

function App() {
  
  return (
    <>
    <Header/>
    <Filter/>
    <GuestBookings/>
    <ModifyListings/>
    <Search/>
    <ViewHotels/>
    <Footer/>
    </>
  
  )
}

export default App
