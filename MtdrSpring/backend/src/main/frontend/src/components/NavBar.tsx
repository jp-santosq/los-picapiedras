import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "../pages/Dashboard.tsx";
import Sprints from "../pages/Sprints.tsx";
import Tasks from "../pages/Tasks.tsx";
import KPIs from "../pages/KPIs.tsx";
import "../styles/components/navbar.css";
import imgPrueba from "../images/profilePlaceHolder.png";
import { useState } from "react";
import { useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import Profile from "../pages/Profile.tsx";


function NavBar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    window.location.reload();
    handleClose();
  };




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
              <Link to={"/KPIs"} style={{ marginRight: "50px" }}>KPIs</Link>
                <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
                  <img src={imgPrueba} alt="Info" style={{ width: "30px", marginLeft: "5px",cursor: "pointer" }} onClick={handleToggle} />
                  {open && (
                    <div style={{
                      position: "absolute",
                      top: "30px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      zIndex: 10,
                      minWidth: "120px",
                      padding: "12px 0",
                      display: "flex",           
                      flexDirection: "column",   
                      alignItems: "center",      
                      justifyContent: "center" 
                    }}>
                      <Link to="/Profile" style={{ textDecoration: "none", width: "100%" }}>
                        <button className="dropdown-btn" onClick={handleClose}>
                          Profile
                        </button>
                      </Link>
                      <button className="dropdown-btn" onClick={handleLogout}>Log out</button>
                    </div>
                  )}
                </div>
            </nav>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Sprints" element={<Sprints />} />
          <Route path="/Tasks" element={<Tasks />} />
          <Route path="/KPIs" element={<KPIs />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default NavBar;
