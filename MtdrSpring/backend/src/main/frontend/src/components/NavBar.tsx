import { Link } from "react-router-dom";
import "../styles/components/navbar.css";
import oracle from "../images/Oracle-Logo.png";
import { useState } from "react";
import { useRef, useEffect } from "react";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import BarChartIcon from '@mui/icons-material/BarChart';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import TaskIcon from '@mui/icons-material/Task';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAuth } from "../context/AuthContext.tsx";
import { ROL } from "./enums.tsx";
import { useNavigate } from "react-router-dom";
import Profile from "../pages/Profile.tsx";

function NavBar() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDrawer = (value: boolean) => () => setDrawerOpen(value);
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/")
  };

  return (
    <>
        <div className="navbar-container">
          <img src={oracle} alt="Oracle Logo" className="oracle"/>
          <div>
            <nav className="navbar">
              <button className="navbar-boton-menu"
                type="button"
                aria-label="menu"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(prev => !prev)}
              >
                <MenuOpenIcon className="menu-open-icon" sx={{ fontSize: 35 }} />
              </button>
            </nav>
          </div>
        </div>

        {/* drawer for navigation/menu */}
        <Drawer anchor="left" open={drawerOpen} onClose={handleToggleDrawer(false)} PaperProps={{sx: {backgroundColor: '#1f2937', color: 'rgba(137, 140, 147, 1)' }}}>
          <div role="presentation" className = "drawer-container">
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/app" onClick={handleToggleDrawer(false)}>
                  <ListItemIcon>
                    <BarChartIcon className="drawer-icon" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/sprints" onClick={handleToggleDrawer(false)}>
                  <ListItemIcon>
                    <AirlineStopsIcon className="drawer-icon" />
                  </ListItemIcon>
                  <ListItemText primary="Sprints" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/tasks" onClick={handleToggleDrawer(false)}>
                  <ListItemIcon>
                    <TaskIcon className="drawer-icon" />
                  </ListItemIcon>
                  <ListItemText primary="Tareas" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/team" onClick={handleToggleDrawer(false)}>
                  <ListItemIcon>
                    <GroupsIcon className="drawer-icon" />
                  </ListItemIcon>
                  <ListItemText primary="Teams" />
                </ListItemButton>
              </ListItem>
              {(user?.rol === ROL.ADMINISTRADOR || user?.rol === ROL.SUPERADMIN) && (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/sprint" onClick={handleToggleDrawer(false)}>
                    <ListItemIcon>
                      <AutoAwesomeIcon className="drawer-icon" />
                    </ListItemIcon>
                    <ListItemText primary="Sprint Generator" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/knowledge" onClick={handleToggleDrawer(false)}>
                  <ListItemIcon>
                    <UploadFileIcon className="drawer-icon" />
                  </ListItemIcon>
                  <ListItemText primary="RAG Knowledge" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/kpis" onClick={handleToggleDrawer(false)}>
                  <ListItemIcon>
                    <QueryStatsIcon className="drawer-icon" />
                  </ListItemIcon>
                  <ListItemText primary="KPIs" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/profile" onClick={handleToggleDrawer(false)}>
                  <ListItemIcon>
                    <AccountBoxIcon className="drawer-icon" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => { handleLogout(); setDrawerOpen(false); }}>
                  <ListItemIcon>
                    <LogoutIcon className="drawer-icon logout-icon" />
                  </ListItemIcon>
                  <ListItemText primary="Log out" />
                </ListItemButton>
              </ListItem>
            </List>
          </div>
        </Drawer>
    </>
  );
}

export default NavBar;
