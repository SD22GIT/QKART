import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Link} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory} from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const goBackToProductPage = ()=>{
    history.push("/");
  }

  let navigationButton;

  if(hasHiddenAuthButtons==="true"){
  navigationButton =   <Button
  className="explore-button"
  startIcon={<ArrowBackIcon />}
  variant="text"
  onClick = {(e)=>{goBackToProductPage()}}
>
  Back to explore
</Button>
  }
  else
  {
    let username = localStorage.getItem("username");
    if(username)
    {
      navigationButton= <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <Avatar img src="avatar.png" alt={username}></Avatar>
      <Box sx={{pl:2,pr:1}}>{username}</Box>
      <Button variant="text" onClick={(e)=>{localStorage.clear();window.location.reload();history.push("/")}}>
      LOGOUT
     </Button>
    </Box>
    }
    else
    {
    navigationButton =  <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <Button variant="text" onClick={(e)=>{history.push("/login")}}>
      LOGIN
     </Button>
     <Button variant="contained" onClick={(e)=>{history.push("/register")}}>
      REGISTER
     </Button>
    </Box>
  }
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
      {children}
      {navigationButton}
      </Box>
    );
};

export default Header;
