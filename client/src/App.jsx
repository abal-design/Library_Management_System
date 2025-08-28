import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Auth/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import Book from "./pages/User/Book";
import AboutUs from './pages/User/AboutUs'
import ManageBook from "./pages/Admin/ManageBook";
import ManageUser from './pages/Admin/ManageUser'
import Report from './pages/Admin/Report'
import AddBook from './pages/Admin/AddBook'
import UpdateBook from './pages/Admin/UpdateBook'
import EditUser from "./pages/Admin/edit-user";
import DeleteBook from './pages/Admin/DeleteBook'
import BorrowRequestPage from "./pages/Admin/BorrowRequestPage";
import axios from 'axios';
import ContactUs from './pages/User/Contact'
import BorrowerBook from './pages/User/BorrowerBook'
import ProfilePage from './pages/User/Profile'
import ResetPassword from "./pages/Auth/ResetPassword";



function App() {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/user/borrower" element={<BorrowerBook/>}/>
        <Route path="/user/contact" element={<ContactUs/>}/>
        <Route path="/admin/borrow-page" element={<BorrowRequestPage/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/manage-book" element={<ManageBook/>}/>
        <Route path="/admin/manage-user" element={<ManageUser/>}/>
        <Route path="/admin/edit-user/:userId" element={<EditUser />} />
        <Route path="/admin/reports" element={<Report/>}/>
        <Route path="/user/dashboard" element={<UserDashboard/>}/>
        <Route path="/user/book" element={<Book/>}/>
        <Route path="/user/aboutus" element={<AboutUs/>}/>
        <Route path="/user/profile" element={<ProfilePage/>}/>
        <Route path="/admin/add-book" element={<AddBook/>}/>
        <Route path="/admin/reset-password" element={<ResetPassword/>}/>
        <Route path="/admin/delete-book" element={<DeleteBook/>}/>
        <Route path="/admin/update-book" element={<UpdateBook/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
