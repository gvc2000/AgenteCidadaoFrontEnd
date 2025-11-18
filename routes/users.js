const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Listar todos os usuários
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, status, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json({
      users: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao listar usuários'
    });
  }
});

// GET /api/users/:id - Obter usuário específico
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, name, email, role, status, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao obter usuário'
    });
  }
});

// POST /api/users - Criar novo usuário
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'Usuário' } = req.body;

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Senha fraca',
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se email já existe
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já cadastrado',
        message: 'Já existe um usuário com este email'
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING id, name, email, role, status, created_at`,
      [name.trim(), email.toLowerCase().trim(), passwordHash, role]
    );

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao criar usuário'
    });
  }
});

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    // Verificar se usuário existe
    const existingUser = await db.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Usuário não encontrado'
      });
    }

    // Se está alterando email, verificar se já existe
    if (email) {
      const emailExists = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email.toLowerCase().trim(), id]
      );

      if (emailExists.rows.length > 0) {
        return res.status(409).json({
          error: 'Email já cadastrado',
          message: 'Já existe outro usuário com este email'
        });
      }
    }

    // Construir query de atualização
    let query = 'UPDATE users SET updated_at = NOW()';
    const params = [];
    let paramIndex = 1;

    if (name) {
      query += `, name = $${paramIndex}`;
      params.push(name.trim());
      paramIndex++;
    }

    if (email) {
      query += `, email = $${paramIndex}`;
      params.push(email.toLowerCase().trim());
      paramIndex++;
    }

    if (role) {
      query += `, role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Senha fraca',
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      query += `, password_hash = $${paramIndex}`;
      params.push(passwordHash);
      paramIndex++;
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, name, email, role, status, updated_at`;
    params.push(id);

    const result = await db.query(query, params);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao atualizar usuário'
    });
  }
});

// DELETE /api/users/:id - Excluir usuário
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Não permitir excluir a si mesmo
    if (parseInt(id) === req.session.userId) {
      return res.status(400).json({
        error: 'Operação inválida',
        message: 'Você não pode excluir sua própria conta'
      });
    }

    // Verificar se usuário existe
    const existingUser = await db.query(
      'SELECT id, role FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Usuário não encontrado'
      });
    }

    // Excluir usuário
    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao excluir usuário'
    });
  }
});

// PATCH /api/users/:id/status - Ativar/Desativar usuário
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        error: 'Status inválido',
        message: 'Status deve ser "active" ou "inactive"'
      });
    }

    // Não permitir desativar a si mesmo
    if (parseInt(id) === req.session.userId && status === 'inactive') {
      return res.status(400).json({
        error: 'Operação inválida',
        message: 'Você não pode desativar sua própria conta'
      });
    }

    // Verificar se usuário existe
    const existingUser = await db.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Usuário não encontrado'
      });
    }

    // Atualizar status
    const result = await db.query(
      `UPDATE users
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, email, role, status`,
      [status, id]
    );

    res.json({
      success: true,
      message: `Usuário ${status === 'active' ? 'ativado' : 'desativado'} com sucesso`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao alterar status do usuário'
    });
  }
});

module.exports = router;
