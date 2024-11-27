import { useState } from 'react';
import { InputText, Password, Button, Card } from 'primereact';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
  
    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
  
    const pessoaData = {
      nome: name,
      email: email,
      senha: password, 
    };
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8080/api/cliente/addClient', pessoaData);
      setSuccessMessage('Cadastro realizado com sucesso! Verifique seu e-mail para completar o processo.');
      console.log(response.data);
    } catch (error) {
      setErrorMessage('Erro ao cadastrar, tente novamente mais tarde.');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        title="Cadastro"
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
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Digite seu nome completo"
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

          <div className="p-field p-grid" style={{ marginBottom: '20px' }}>
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

          <div className="p-field p-grid" style={{ marginBottom: '30px' }}>
            <Password
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirme sua senha"
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
            label={loading ? 'Cadastrando...' : 'Cadastrar'}
            icon="pi pi-check"
            type="submit"
            className="p-button-lg p-button-block"
            style={{
              backgroundColor: '#ff4d94',
              borderColor: '#ff4d94',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            disabled={loading}
          />
        </form>

        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ marginTop: '20px' }}>
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Typography variant="body2" color="success" sx={{ marginTop: '20px' }}>
            {successMessage}
          </Typography>
        )}

        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="body2" color="textSecondary" sx={{ color: '#555' }}>
            Já tem uma conta?{' '}
            <a href="/login" style={{ color: '#ff4d94', fontWeight: 'bold' }}>
              Faça login
            </a>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Register;
