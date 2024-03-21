import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoremPicsum from './components/LoremPicsum'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoremPicsum />} />
      </Routes>
    </Router>
  )
}