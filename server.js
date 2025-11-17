const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/current')));

// Rota principal - redireciona para a interface bilíngue
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html'));
});

// Rotas específicas para cada página
app.get('/bilingual', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/current/index.html'));
});

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/current/demo-agente-cidadao.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/current/admin-agente-cidadao.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/current/login-agente-cidadao.html'));
});

// Health check para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html'));
});

// Start server
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Host: ${HOST}`);

  // Mostra URL específica baseada no ambiente
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`🌍 URL pública: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  } else if (process.env.RAILWAY_STATIC_URL) {
    console.log(`🌍 URL pública: ${process.env.RAILWAY_STATIC_URL}`);
  } else {
    console.log(`📍 URL local: http://localhost:${PORT}`);
  }

  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Servidor pronto para receber requisições`);
});
