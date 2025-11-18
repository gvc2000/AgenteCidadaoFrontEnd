const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário pelo email
    const result = await db.query(
      'SELECT id, name, email, password_hash, role, status FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    const user = result.rows[0];

    // Verificar se usuário está ativo
    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Conta desativada',
        message: 'Sua conta está desativada. Entre em contato com o administrador.'
      });
    }

    // Verificar senha
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Criar sessão
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userRole = user.role;

    // Retornar dados do usuário (sem a senha)
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao processar login'
    });
  }
});

// POST /api/auth/logout - Fazer logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.status(500).json({
        error: 'Erro interno',
        message: 'Erro ao fazer logout'
      });
    }

    res.clearCookie('connect.sid');
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  });
});

// GET /api/auth/me - Obter usuário atual
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Sua sessão é inválida'
      });
    }

    res.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao obter dados do usuário'
    });
  }
});

// GET /api/auth/check - Verificar se está autenticado (sem requerer auth)
router.get('/check', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      authenticated: true,
      userId: req.session.userId,
      userRole: req.session.userRole
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});

// PUT /api/auth/password - Alterar senha
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Senha fraca',
        message: 'A nova senha deve ter pelo menos 6 caracteres'
      });
    }

    // Buscar senha atual
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const passwordValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        error: 'Senha incorreta',
        message: 'A senha atual está incorreta'
      });
    }

    // Hash da nova senha
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, req.session.userId]
    );

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao alterar senha'
    });
  }
});

module.exports = router;
