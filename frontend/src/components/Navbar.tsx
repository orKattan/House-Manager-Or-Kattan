import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const Navbar: React.FC = () => {
  const { logout } = useUserContext(); // Logout function
  const history = useHistory(); // Use history for navigation

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
         Icon
        </Typography>

        <Button color="inherit" component={Link} to="/HomePage">
          🏠 Home
        </Button>
        <Button color="inherit" component={Link} to="/calendar">
          📅 Calendar
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          👤 Profile
        </Button>

        <Button
          color="error"
          onClick={() => {
            logout();
            history.push("/login"); // Redirect user
          }}
        >
          🚪 Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
