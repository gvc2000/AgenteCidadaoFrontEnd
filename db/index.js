const { Pool } = require('pg');

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testar conexão
pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro no pool PostgreSQL:', err);
});

// Função helper para queries
const query = (text, params) => pool.query(text, params);

// Função para inicializar o banco de dados
const initDatabase = async () => {
  try {
    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Usuário',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Criar tabela de configurações do sistema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Criar tabela de sessões
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (sid)
      )
    `);

    // Criar índice para expiração de sessões
    await pool.query(`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire)
    `);

    // Inserir configuração inicial se não existir
    await pool.query(`
      INSERT INTO system_settings (key, value)
      VALUES ('restricted_access', 'false')
      ON CONFLICT (key) DO NOTHING
    `);

    console.log('Banco de dados inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Verificar se existe admin, criar se não existir
const ensureAdminExists = async (bcrypt) => {
  try {
    const result = await pool.query(
      "SELECT id FROM users WHERE role = 'Administrador' LIMIT 1"
    );

    if (result.rows.length === 0) {
      // Criar admin padrão
      const defaultPassword = 'admin123'; // Senha inicial
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, status)
         VALUES ($1, $2, $3, $4, $5)`,
        ['Admin Sistema', 'admin@agentecidadao.gov.br', passwordHash, 'Administrador', 'active']
      );

      console.log('Admin padrão criado: admin@agentecidadao.gov.br / admin123');
      console.log('IMPORTANTE: Altere a senha do admin após o primeiro login!');
    }
  } catch (error) {
    console.error('Erro ao verificar/criar admin:', error);
  }
};

module.exports = {
  pool,
  query,
  initDatabase,
  ensureAdminExists
};
