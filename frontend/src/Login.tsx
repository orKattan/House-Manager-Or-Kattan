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
import logo from './assets/logo.png'; 

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append("username", email);
            params.append("password", password);

            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Login failed");
            }

            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            alert("Login successful");
            navigate("/"); // go to main page
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
                <img src={logo} alt="Logo" style={{ width: 100, marginBottom: '1rem' }} />
                <Typography variant="h5" mb={3} textAlign="center" color="black">
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <Stack spacing={3}>
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
                            Login
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/register")}>
                            Register
                        </Button>
                    </Stack>
                </form>
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

export default Login;
