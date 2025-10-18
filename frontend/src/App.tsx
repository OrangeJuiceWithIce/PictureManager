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
import MyPicturePage from './pages/PictureManagePage/MyPicture'
import PictureDetail from './components/PictureManage/PictureDetail'
import World from './pages/PictureManagePage/World'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={
              <HomePage />
          }></Route>

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

          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }></Route>

          <Route path='/mypicture' element={
            <ProtectedRoute>
              <MyPicturePage />
            </ProtectedRoute>
          }></Route>

          <Route path="/picture/:id" element={
            <ProtectedRoute>
              <PictureDetail />
            </ProtectedRoute>
          }></Route>

          <Route path="/world" element={
            <ProtectedRoute>
              <World />
            </ProtectedRoute>
          }></Route>

        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
