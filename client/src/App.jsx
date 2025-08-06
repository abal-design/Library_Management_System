import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Auth/Register";
import Forgot from "./pages/Auth/Forgot";
import Otp from "./pages/Auth/Otp";
import ResetPassword from "./pages/Auth/ResetPassword"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot" element={<Forgot/>}/>
        <Route path="/otp" element={<Otp/>}/>
        <Route path="/resetpassword" element={<ResetPassword/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
