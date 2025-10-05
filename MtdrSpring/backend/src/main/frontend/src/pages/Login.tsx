import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link
} from "@mui/material";
import { useAuth } from "../context/AuthContext.tsx";
import oracleName from "../images/oracleName.png";
import oracleLogo from "../images/oracleLogo.png";

function Login() {
  const { login, user } = useAuth();

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
    <>
      <Paper sx={{ 
          display: 'flex', 
          alignItems: 'center',
          minHeight: '8dvh',
          backgroundColor: '#312D2A',
          borderRadius: 0
        }}>
          <img
          src={oracleLogo} 
                  alt="Oracle Logo" 
                  style={{ 
                    width: '57px', 
                    height: 'auto', 
                    maxWidth:'100%',
                    marginLeft: '25px' }} 
          />
          <Typography
                variant="h5" 
                  sx={{ 
                    ml: 2,
                    fontFamily: 'Oracle Sans',
                    fontWeight: 'normal', 
                    fontSize: 20,
                    color: '#FFFFFF'
                  }}> 
                  Organizer 
            </Typography>
          </Paper>
      <Container maxWidth="sm" sx={{display: "grid", placeItems: "center", minHeight:"90dvh"}}>
        <Paper elevation={6} sx={{ alignItems: "center", display: "flex"}}>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 , px: 4, py:4, minWidth: '60dvh'}}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "left", mb: 3 }}>
              <img 
                src={oracleName} 
                alt="Oracle Logo" 
                style={{ 
                  width: 'auto', 
                  height: '25px', 
                  maxWidth:'100%',
                  marginTop: 5 }} 
                />
              <Typography
              variant="h5" 
                sx={{ 
                  ml: 1,
                  fontFamily: 'Oracle Sans',
                  fontWeight: 'normal',
                  fontSize: 30,
                  alignSelf: 'center'
                }}> 
                Organizer 
                </Typography>
            </Box>
            <Typography
              variant="h5" 
                sx={{ 
                  mb: 1,
                  fontWeight: 'light',
                  fontSize: 16,
                  alignSelf: 'center'
                }}> 
                Correo electrónico 
            </Typography>

            <TextField
              fullWidth
              required
              autoFocus
              sx = {{ '& .MuiInputBase-root': { height: '40px'},
                    '& input:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px #fff inset',
                    '-webkit-text-fill-color': '#000',
                    'box-shadow': '0 0 0 100px #fff inset',
                  } 
                }}
              value={mail}
              onChange={(e) => {
                setMail(e.target.value);
                setError(false);
              }}
            />

            <Typography
              variant="h5" 
                sx={{ 
                  mt: 2,
                  mb: 1,
                  fontWeight: 'light',
                  fontSize: 16,
                  alignSelf: 'center'
                }}> 
                Contraseña 
              </Typography>

            <TextField
              fullWidth
              required
              type="password"
              sx = {{ '& .MuiInputBase-root': { height: '40px'},
                    '& input:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px #fff inset',
                    '-webkit-text-fill-color': '#000',
                    'box-shadow': '0 0 0 100px #fff inset',
                  } 
                }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
              {error && (
                <Typography 
                  color="error"
                  sx={{
                    mt: 1,
                    fontSize: '0.875rem',
                    display: 'flex',
                    gap: 1,
                    minHeight: '24px'
                  }}
                >
                  Usuario o contraseña incorrectos
                </Typography>
              )}

            <Link
              component="button"
              variant="body2"
              onClick={() => {
                alert("Funcionalidad no implementada");
              }}
              sx={{
                mt: 1,
                fontWeight: 'normal',
                fontSize: 16,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}>
              ¿Ha olvidado la contraseña?
            </Link>
            <br></br>
            <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              mt: 2,
              width: '50%',
              textTransform: 'none',
              fontSize: 16,
              bgcolor: '#312D2A',
              borderRadius: 0,
              '&:hover': { bgcolor: '#242220ff'}
               }}>
              Conectar
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Login;
