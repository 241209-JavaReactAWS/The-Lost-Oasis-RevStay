import './App.css'
import {BrowserRouter, Routes} from 'react-router'
import Navbar from './components/navbar/Navbar.tsx'

function App() {
  return (
    <div id='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
