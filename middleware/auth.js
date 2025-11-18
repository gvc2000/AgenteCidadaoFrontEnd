const db = require('../db');

// Middleware para verificar se usuário está autenticado
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Não autenticado',
      message: 'Faça login para acessar este recurso'
    });
  }
  next();
};

// Middleware para verificar se usuário é administrador
const requireAdmin = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Não autenticado',
      message: 'Faça login para acessar este recurso'
    });
  }

  try {
    const result = await db.query(
      'SELECT role FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        message: 'Sua sessão é inválida'
      });
    }

    if (result.rows[0].role !== 'Administrador') {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você não tem permissão para acessar este recurso'
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar permissão de admin:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao verificar permissões'
    });
  }
};

// Middleware para verificar modo de acesso restrito
const checkRestrictedAccess = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT value FROM system_settings WHERE key = 'restricted_access'"
    );

    const isRestricted = result.rows[0]?.value === 'true';

    // Se o acesso é restrito e o usuário não está autenticado
    if (isRestricted && (!req.session || !req.session.userId)) {
      // Redirecionar para login
      return res.redirect('/login');
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar modo restrito:', error);
    // Em caso de erro, permitir acesso (fail-open)
    next();
  }
};

// Middleware para adicionar informações do usuário à requisição
const loadUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const result = await db.query(
        'SELECT id, name, email, role, status FROM users WHERE id = $1',
        [req.session.userId]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  checkRestrictedAccess,
  loadUser
};
