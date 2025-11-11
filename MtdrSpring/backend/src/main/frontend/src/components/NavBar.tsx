import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "../pages/Dashboard.tsx";
import Sprints from "../pages/Sprints.tsx";
import Tasks from "../pages/Tasks.tsx";
import KPIs from "../pages/KPIs.tsx";
import "../styles/components/navbar.css";
import Profile from "../pages/Profile.tsx";


function NavBar() {



  function Contact() {
    return <h1>Contact Page</h1>;
  }

  return (
    <>

      <BrowserRouter>
        <div className="navbar-container">
          <img src="../images/oracle.png" alt="" />
          <div>
            <nav className="navbar">
              <Link to={"/"}>Board</Link>
              <Link to={"/Sprints"}>Sprints</Link>
              <Link to={"/Tasks"}>Tasks</Link>
              <Link to={"/KPIs"}>KPIs</Link>
              <Link to={"/Profile"}>Profile</Link>
              <Link to={"/Contact"}>Contact Page</Link>
            </nav>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Sprints" element={<Sprints />} />
          <Route path="/Tasks" element={<Tasks />} />
          <Route path="/KPIs" element={<KPIs />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default NavBar;
