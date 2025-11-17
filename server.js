const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Log startup information
console.log('🔧 Iniciando servidor...');
console.log(`📂 Diretório base: ${__dirname}`);
console.log(`📁 Diretório frontend: ${path.join(__dirname, 'frontend/current')}`);

// Middleware
app.use(cors());
app.use(express.json());

// Log de requisições (apenas em produção para debug)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.use(express.static(path.join(__dirname, 'frontend/current')));

// Rota principal - redireciona para a interface bilíngue
app.get('/', (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Erro ao enviar arquivo: ${filePath}`, err);
      next(err);
    }
  });
});

// Rotas específicas para cada página
app.get('/bilingual', (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html');
  res.sendFile(filePath, (err) => {
    if (err) next(err);
  });
});

app.get('/index', (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/index.html');
  res.sendFile(filePath, (err) => {
    if (err) next(err);
  });
});

app.get('/demo', (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/demo-agente-cidadao.html');
  res.sendFile(filePath, (err) => {
    if (err) next(err);
  });
});

app.get('/admin', (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/admin-agente-cidadao.html');
  res.sendFile(filePath, (err) => {
    if (err) next(err);
  });
});

app.get('/login', (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/login-agente-cidadao.html');
  res.sendFile(filePath, (err) => {
    if (err) next(err);
  });
});

// Health check para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'production' ? 'Ocorreu um erro' : err.message
  });
});

// Start server
const HOST = '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
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

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido, fechando servidor gracefully...');
  server.close(() => {
    console.log('✅ Servidor fechado');
    process.exit(0);
  });
});
