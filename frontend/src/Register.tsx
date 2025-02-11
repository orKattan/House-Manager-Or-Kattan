import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
    Box,
    Typography,
    Stack,
    Snackbar,
    Alert
} from "@mui/material";
import logo from './assets/logo.png'; // Update the logo image path

function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Registration failed");
            }
            setSuccessOpen(true);
            setTimeout(() => navigate("/login"), 1500); // go to login page
        } catch (err) {
            setErrorOpen(true);
            setErrorMsg((err as Error).message);
        }
    };

    return (
        <Box
            sx={{
                position: "absolute",  // Position the box absolutely
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "white",  // White background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundSize: "cover",  // Ensure background fits the whole page
                backgroundPosition: "center",
            }}
        >
            <Box
                sx={{
                    maxWidth: 400,
                    p: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    backgroundColor: "white",
                    textAlign: "center",
                    color: "black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img src={logo} alt="Logo" style={{ width: 100, marginBottom: '1rem' }} /> {/* Add logo image */}
                <Typography variant="h5" mb={3} textAlign="center" color="black">
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <Stack spacing={3}>
                        <TextField
                            label="First Name"
                            type="text"
                            variant="outlined"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            InputLabelProps={{ style: { color: 'black' } }}
                            InputProps={{ style: { color: 'black' } }}
                        />
                        <TextField
                            label="Last Name"
                            type="text"
                            variant="outlined"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            InputLabelProps={{ style: { color: 'black' } }}
                            InputProps={{ style: { color: 'black' } }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            InputLabelProps={{ style: { color: 'black' } }}
                            InputProps={{ style: { color: 'black' } }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputLabelProps={{ style: { color: 'black' } }}
                            InputProps={{ style: { color: 'black' } }}
                        />
                        <Button variant="contained" type="submit">
                            Sign Up
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </Stack>
                </form>

                {/* Success Snackbar */}
                <Snackbar
                    open={successOpen}
                    autoHideDuration={3000}
                    onClose={() => setSuccessOpen(false)}
                >
                    <Alert onClose={() => setSuccessOpen(false)} severity="success">
                        Registered successfully!
                    </Alert>
                </Snackbar>

                {/* Error Snackbar */}
                <Snackbar
                    open={errorOpen}
                    autoHideDuration={3000}
                    onClose={() => setErrorOpen(false)}
                >
                    <Alert onClose={() => setErrorOpen(false)} severity="error">
                        {errorMsg}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}

export default Register;
