import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';

function App() {
  return (
    <div>
       <Router>
         <Routes>
           <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
           <Route path="/otp" element={<OTPVerification />} />
           <Route path="/" element={<Navigate to="/login" replace />} />
         </Routes>
       </Router>
    </div>
  )
}

export default App;
