# Agente Cidadão - Frontend

Sistema web de consulta legislativa inteligente com interface moderna e integração MCP.

## 📁 Estrutura do Projeto

```
AgenteCidadaoFrontEnd/
├── frontend/
│   ├── current/              # Versão atual em produção
│   │   ├── index.html        # Interface principal (v4)
│   │   ├── admin-agente-cidadao.html
│   │   ├── demo-agente-cidadao.html
│   │   └── login-agente-cidadao.html
│   │
│   ├── archive/              # Versões anteriores (histórico)
│   │   ├── prototipo-v1.html
│   │   ├── prototipo-agente-cidadao-v2.html
│   │   └── prototipo-agente-cidadao-v3.html
│   │
│   ├── docs/                 # Documentação técnica
│   │   ├── ESPECIFICACAO_FRONTEND.md
│   │   └── PROTOTIPO_README.md
│   │
│   └── README.md             # Documentação do frontend
│
├── .gitignore                # Arquivos ignorados pelo Git
└── README.md                 # Este arquivo
```

## 🚀 Quick Start

### Executar Versão Atual

```bash
# Usando Python
cd frontend/current
python3 -m http.server 8000

# Usando Node.js
npx http-server frontend/current -p 8000
```

Acesse: `http://localhost:8000`

## 🛠️ Tecnologias

- **React 18** (via CDN + Babel Standalone)
- **Tailwind CSS** (via CDN)
- **Lucide Icons** (iconografia)
- **Chart.js** (visualizações de dados)
- HTML5, CSS3, JavaScript ES6+

## 📚 Documentação

- **[Frontend README](./frontend/README.md)** - Documentação completa do frontend
- **[Especificação Técnica](./frontend/docs/ESPECIFICACAO_FRONTEND.md)** - Detalhes de implementação
- **[Protótipos](./frontend/docs/PROTOTIPO_README.md)** - Evolução e histórico das versões

## 🔄 Versões

- **v4** (Atual): Interface principal otimizada - `frontend/current/index.html`
- **v1-v3**: Versões anteriores arquivadas em `frontend/archive/`

## 🎯 Roadmap

1. Modularização com React + Vite
2. Migração para TypeScript
3. Gerenciamento de estado (Zustand)
4. Testes automatizados (Jest)
5. Pipeline de CI/CD
6. Build para produção otimizado

## 📝 Contribuindo

1. Versões de produção devem ir em `frontend/current/`
2. Versões antigas devem ser arquivadas em `frontend/archive/`
3. Documentação deve ser mantida atualizada

---

**Desenvolvido para o projeto Agente Cidadão MCP**
