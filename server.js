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

// Log de todas as requisições para debug
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(`  📝 Content-Type: ${req.headers['content-type']}`);
  }
  next();
});

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

// Webhook endpoint para receber dados externos
app.post('/webhook/:id', (req, res) => {
  const webhookId = req.params.id;
  const timestamp = new Date().toISOString();

  console.log('📬 Webhook recebido:');
  console.log(`  ⏰ Timestamp: ${timestamp}`);
  console.log(`  🔑 ID: ${webhookId}`);
  console.log(`  📦 Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`  📄 Body:`, JSON.stringify(req.body, null, 2));

  // Responde com sucesso
  res.status(200).json({
    success: true,
    message: 'Webhook recebido com sucesso',
    webhookId: webhookId,
    timestamp: timestamp,
    receivedData: req.body
  });
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
