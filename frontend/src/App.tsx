import './App.css'
import {Routes,Route,Navigate} from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import RegisterPage from './pages/Register'
import Dashboard from './pages/DashBoard'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/homepage' element={<HomePage />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
      </Route>
    </Routes>
  )
}

export default App
