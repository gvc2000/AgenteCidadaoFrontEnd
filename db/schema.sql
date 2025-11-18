-- Schema do banco de dados para Agente Cidadão
-- Execute este arquivo para criar as tabelas manualmente se necessário

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Usuário',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de sessões (para express-session com connect-pg-simple)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid)
);

-- Índice para expiração de sessões
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Inserir configuração inicial
INSERT INTO system_settings (key, value)
VALUES ('restricted_access', 'false')
ON CONFLICT (key) DO NOTHING;

-- Criar usuário admin padrão (senha: admin123)
-- Hash gerado com bcrypt, custo 10
-- IMPORTANTE: Altere a senha após o primeiro login!
INSERT INTO users (name, email, password_hash, role, status)
VALUES (
    'Admin Sistema',
    'admin@agentecidadao.gov.br',
    '$2a$10$placeholder', -- Será substituído pela aplicação
    'Administrador',
    'active'
)
ON CONFLICT (email) DO NOTHING;

-- Comentários sobre índices adicionais (adicionar conforme necessidade)
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_status ON users(status);
-- CREATE INDEX idx_users_role ON users(role);
