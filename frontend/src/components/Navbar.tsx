import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useUserContext(); // Get currentUser and logout function
  const history = useHistory(); // Use history for navigation

  return (
    <AppBar position="static">
      <Toolbar>
      {currentUser && (
          <Typography variant="h6" sx={{ mr: 2 }}>
            Welcome, {currentUser.name} {currentUser.last_name}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/create-task">
            🏠 Home
          </Button>
          <Button color="inherit" component={Link} to="/calendar">
            📅 Calendar
          </Button>
          <Button color="inherit" component={Link} to="/profile">
            👤 Profile
          </Button>
        </Box>
        <Button color="inherit" onClick={() => {
            logout();
            history.push("/"); 
          }}
        >
             Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
