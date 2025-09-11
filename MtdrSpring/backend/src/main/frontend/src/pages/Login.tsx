import { useState } from "react";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext.tsx";

function Login() {
  const { login,user } = useAuth();

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = await login(mail, password);
    if (!ok) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={10} sx={{ marginTop: 5, padding: 2 }}>
        <Avatar
          sx={{
            margin: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Email"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={mail}
            onChange={(e) => {
              setMail(e.target.value);
              setError(false);
            }}
          />

          <TextField
            label="Password"
            fullWidth
            required
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />

          {error && (
            <Typography color="error">
              Usuario o contraseña incorrectos
            </Typography>
          )}
          {user && (
            <Typography color="primary">Bienvenido {user.name} </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
