import "./index.css"
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard.jsx'

const App = () => {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
       
      </Routes>
    </>

  )
}

export default App;