import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home/Home';
import SignUp from './component/SignUp/SignUp';
import SignIn from './component/SignIn/SignIn';
import Vacations from './component/vacation/Vacations';
import AdminDashboard from './component/Admin/AdminDashboard';
import AddVacation from './component/AddVacation/AddVacation';
import EditVaction from './component/EditVaction/EditVaction';
import WhatchReport from './component/WhatchReport/WhatchReport';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/vacations" element={<Vacations />} /> {/* נתיב לחופשות */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* נתיב למנהל */}
        <Route path="/add-vacation" element={< AddVacation/>} /> {/* נתיב למנהל */}
        <Route path="/edit-vacation/:id" element={< EditVaction/>} /> {/* נתיב למנהל */}
        <Route path="/whatch-report" element={< WhatchReport/>} /> {/* נתיב למנהל */}
      </Routes>
    </Router>
  );
}

export default App;