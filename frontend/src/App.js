import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import CandidateDashboard from "./components/Candidate/Dashboard";
import CompanyDashboard from "./components/Company/Dashboard";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/candidate" element={user?.role === "candidate" ? <CandidateDashboard /> : <Navigate to="/login" />} />
        <Route path="/company" element={user?.role === "company" ? <CompanyDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
