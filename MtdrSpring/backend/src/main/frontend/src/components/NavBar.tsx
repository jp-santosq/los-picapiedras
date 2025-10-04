import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "../pages/Dashboard.tsx";
import axios from "axios";
import "../styles/components/navbar.css";


function NavBar() {

  

  const HomePage = () => {

    return <h1>Hola</h1>

  };

  function About() {
    return <h1>About Page</h1>;
  }

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
              <Link to={"/"}>Home Page</Link>
              <Link to={"/Dashboard"}>Board</Link>
              <Link to={"/About-page"}>About Page</Link>
              <Link to={"/Contact"}>Contact Page</Link>
            </nav>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/About-page" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default NavBar;
