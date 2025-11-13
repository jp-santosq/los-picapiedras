import { useEffect } from "react";
import "../styles/components/profile.css";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";


function Profile() {
  const { user } = useAuth();

  const getProyectName = async() =>{
    const response = await axios.get("/proyecto/all")

    const data = response.data
    console.log(typeof data)
    if (typeof data == "object"){
      console.log(data)
    }else{
      throw new Error("No se recivio lo esperado")
    }
  }

  useEffect(()=>{
    getProyectName()
  },[])

  return (
    <>
      <div className="container">
        <div className="profile">
          <Avatar
            src={user?.image || undefined}
            alt={user?.name}
            sx={{ bgcolor: user?.image ? "transparent" : "#1976d2" }}
            style={{width:100,height:100}}
          >
            {!user?.image && user?.name?.[0]?.toUpperCase()}
          </Avatar>

          <p>{user?.name}</p>
          <p>{user?.email}</p>
          <p>{user?.rol}</p>
        </div>

        <div className="proyect">

        </div>
      </div>
    </>
  );
}

export default Profile;
