import { useState } from 'react';
import { InputText, Password, Button, Card } from 'primereact';
import { Box, Typography } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Lógica de autenticação
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #83A6CE, #26415E)',
      }}
    >
      <Card 
        title="Entrar"
        style={{
          padding: '30px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          background: '#ffffff',
          textAlign: 'center',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-field p-grid" style={{ marginBottom: '20px' }}>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Digite seu email"
              className="p-inputtext-lg"
              style={{
                width: '100%',
                borderRadius: '8px',
                padding: '12px',
                boxSizing: 'border-box',
                background: '#f7f7f7',
                border: '1px solid #e0e0e0',
              }}
            />
          </div>

          <div className="p-field p-grid" style={{ marginBottom: '30px' }}>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              toggleMask
              className="p-inputtext-lg"
              style={{
                width: '100%',
                borderRadius: '8px',
                padding: '12px',
                boxSizing: 'border-box',
                background: '#f7f7f7',
                border: '1px solid #e0e0e0',
              }}
            />
          </div>

          <Button 
            label="Entrar" 
            icon="pi pi-sign-in" 
            type="submit" 
            className="p-button-lg p-button-block"
            style={{
              backgroundColor: '#ff4d94',
              borderColor: '#ff4d94',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }} 
          />

        </form>

        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="body2" color="textSecondary" sx={{ color: '#555' }}>
            Não tem uma conta?{' '}
            <a href="/register" style={{ color: '#ff4d94', fontWeight: 'bold' }}>
              Cadastre-se
            </a>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
