import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from './pages/About';
import InstructorLanding from './pages/InstructorLanding';
import Contact from "./pages/Contact";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorMyCourses from "./components/InstructorMyCourses";
import AddCourse from "./components/AddCourse";
import InstructorMessagesAndSupport from "./components/InstructorMessagesAndSupport";
import StudentMyCourse from "./components/StudentMycourse";
import BrowseCourses from "./pages/BrowserCourses";
import CourseDetails from "./pages/CourseDetails";
import CourseContent from "./pages/CourseContent";
import PaymentPage from "./pages/PaymentPage";
import UpdateProfile from "./pages/UpdateProfile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/instructor-landing" element={<InstructorLanding />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/landing" />} /> 
        <Route path="/dashboard" element={<InstructorDashboard />} /> 
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/instructor-my-courses" element={<InstructorMyCourses />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/instructor-messages-and-support" element={<InstructorMessagesAndSupport />} />
        <Route path="/student-my-course" element={<StudentMyCourse />} />
        <Route path="/instructor/edit-course/:courseId" element={<AddCourse />} />
        <Route path="/browse-courses" element={<BrowseCourses />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/course-content/:courseId" element={<CourseContent />} />
        <Route path="/payment/:courseId" element={<PaymentPage />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        
      </Routes>
    </Router>
  );
}

export default App;

