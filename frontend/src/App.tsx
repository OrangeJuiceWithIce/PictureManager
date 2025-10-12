import './App.css'
import {Routes,Route} from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import RegisterPage from './pages/Register'
import Dashboard from './pages/DashBoard'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './utils/ProtectedRoute'
import AuthRoute from './utils/AuthRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/login' element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }/>

          <Route path='/register' element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          }/>

          <Route path='/homepage' element={
              <HomePage />
          }></Route>

          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }></Route>

        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
