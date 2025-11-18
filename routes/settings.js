const express = require('express');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/settings - Obter todas as configurações
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT key, value, updated_at FROM system_settings ORDER BY key'
    );

    // Converter para objeto
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = {
        value: row.value,
        updated_at: row.updated_at
      };
    });

    res.json({ settings });
  } catch (error) {
    console.error('Erro ao obter configurações:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao obter configurações'
    });
  }
});

// GET /api/settings/:key - Obter configuração específica
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const result = await db.query(
      'SELECT key, value, updated_at FROM system_settings WHERE key = $1',
      [key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Configuração não encontrada'
      });
    }

    res.json({
      setting: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao obter configuração:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao obter configuração'
    });
  }
});

// PUT /api/settings/:key - Atualizar configuração específica
router.put('/:key', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Valor é obrigatório'
      });
    }

    // Upsert (inserir ou atualizar)
    const result = await db.query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
       RETURNING key, value, updated_at`,
      [key, String(value)]
    );

    res.json({
      success: true,
      message: 'Configuração atualizada com sucesso',
      setting: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao atualizar configuração'
    });
  }
});

// PUT /api/settings - Atualizar múltiplas configurações
router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'Envie um objeto com as configurações'
      });
    }

    const results = [];

    for (const [key, value] of Object.entries(settings)) {
      const result = await db.query(
        `INSERT INTO system_settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
         RETURNING key, value, updated_at`,
        [key, String(value)]
      );
      results.push(result.rows[0]);
    }

    res.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      settings: results
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao atualizar configurações'
    });
  }
});

// GET /api/settings/public/restricted-access - Verificar modo restrito (público)
router.get('/public/restricted-access', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT value FROM system_settings WHERE key = 'restricted_access'"
    );

    const isRestricted = result.rows[0]?.value === 'true';

    res.json({
      restricted_access: isRestricted
    });
  } catch (error) {
    console.error('Erro ao verificar modo restrito:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao verificar modo restrito'
    });
  }
});

module.exports = router;
