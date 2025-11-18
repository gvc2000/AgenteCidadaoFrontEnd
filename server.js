const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Log startup information
console.log('Iniciando servidor...');
console.log(`Diretorio base: ${__dirname}`);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessão
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'agente-cidadao-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
};

// Em produção, usar PostgreSQL para armazenar sessões
if (process.env.DATABASE_URL) {
  const pgSession = require('connect-pg-simple')(session);
  const db = require('./db');

  sessionConfig.store = new pgSession({
    pool: db.pool,
    tableName: 'sessions'
  });
}

app.use(session(sessionConfig));

// Log de requisições em produção
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Importar rotas de API (apenas se DATABASE_URL estiver configurada)
let authRoutes, usersRoutes, settingsRoutes, authMiddleware;

if (process.env.DATABASE_URL) {
  authRoutes = require('./routes/auth');
  usersRoutes = require('./routes/users');
  settingsRoutes = require('./routes/settings');
  authMiddleware = require('./middleware/auth');

  // Rotas de API
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/settings', settingsRoutes);

  console.log('Rotas de API carregadas');
} else {
  console.log('DATABASE_URL nao configurada - API desabilitada');
}

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'frontend/current'), { index: false }));

// Middleware para verificar modo restrito (apenas se DB configurada)
const checkRestrictedAccess = async (req, res, next) => {
  if (!process.env.DATABASE_URL) {
    return next();
  }

  try {
    const db = require('./db');
    const result = await db.query(
      "SELECT value FROM system_settings WHERE key = 'restricted_access'"
    );

    const isRestricted = result.rows[0]?.value === 'true';

    if (isRestricted && (!req.session || !req.session.userId)) {
      return res.redirect('/login');
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar modo restrito:', error);
    next();
  }
};

// Rota principal - com verificação de modo restrito
app.get('/', checkRestrictedAccess, (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Erro ao enviar arquivo: ${filePath}`, err);
      next(err);
    }
  });
});

// Rotas específicas para cada página
app.get('/bilingual', checkRestrictedAccess, (req, res, next) => {
  const filePath = path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html');
  res.sendFile(filePath, (err) => {
    if (err) next(err);
  });
});

app.get('/index', checkRestrictedAccess, (req, res, next) => {
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
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configured' : 'not configured'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'frontend/current/agente-cidadao-bilingual.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'production' ? 'Ocorreu um erro' : err.message
  });
});

// Função para iniciar o servidor
const startServer = async () => {
  // Inicializar banco de dados se DATABASE_URL estiver configurada
  if (process.env.DATABASE_URL) {
    try {
      const db = require('./db');
      await db.initDatabase();
      await db.ensureAdminExists(bcrypt);
      console.log('Banco de dados pronto');
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      console.log('Continuando sem banco de dados...');
    }
  }

  // Start server
  const HOST = '0.0.0.0';
  const server = app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Host: ${HOST}`);

    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      console.log(`URL publica: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
    } else if (process.env.RAILWAY_STATIC_URL) {
      console.log(`URL publica: ${process.env.RAILWAY_STATIC_URL}`);
    } else {
      console.log(`URL local: http://localhost:${PORT}`);
    }

    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('Servidor pronto para receber requisicoes');
  });

  // Handle server errors
  server.on('error', (error) => {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM recebido, fechando servidor gracefully...');
    server.close(() => {
      console.log('Servidor fechado');
      process.exit(0);
    });
  });
};

// Iniciar servidor
startServer();
