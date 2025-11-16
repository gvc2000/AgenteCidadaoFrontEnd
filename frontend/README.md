# Frontend - Agente Cidadão

Interface web para o Agente Cidadão MCP - Sistema de consulta legislativa inteligente.

## 📁 Estrutura

```
frontend/
├── current/              # Versão atual em produção
│   ├── index.html       # Interface principal do Agente Cidadão (v4)
│   ├── admin-agente-cidadao.html    # Painel administrativo
│   ├── demo-agente-cidadao.html     # Demonstração
│   └── login-agente-cidadao.html    # Página de login
│
├── archive/             # Versões anteriores (histórico)
│   ├── prototipo-v1.html
│   ├── prototipo-agente-cidadao-v2.html
│   └── prototipo-agente-cidadao-v3.html
│
├── ESPECIFICACAO_FRONTEND.md   # Especificação técnica
├── PROTOTIPO_README.md         # Documentação dos protótipos
└── README.md                   # Este arquivo
```

## 🚀 Versão Atual

A versão atual em produção é a **v4** (`current/index.html`), que inclui:

- Interface moderna em React (via CDN)
- Design responsivo com Tailwind CSS
- Integração com MCP Server
- Análise de dados legislativos
- Exportação de relatórios

## 🛠️ Tecnologias

- **React 18** (via CDN + Babel)
- **Tailwind CSS** (via CDN)
- **Lucide Icons** (iconografia)
- **Chart.js** (visualizações)
- HTML5, CSS3, JavaScript ES6+

## 📝 Executando Localmente

### Opção 1: Servidor HTTP Simples

```bash
# Python 3
cd frontend/current
python3 -m http.server 8000

# Node.js
npx http-server frontend/current -p 8000
```

Acesse: `http://localhost:8000`

### Opção 2: Live Server (VS Code)

1. Instale a extensão "Live Server"
2. Abra `current/index.html`
3. Clique com botão direito → "Open with Live Server"

## 🔄 Histórico de Versões

### v4 (Atual)
- Título atualizado para "Agente Cidadão"
- Layout otimizado
- Melhorias de UX

### v3
- Implementação de dashboard analítico
- Visualizações com Chart.js

### v2
- Sistema de chat aprimorado
- Integração com ferramentas MCP

### v1
- Protótipo inicial
- Interface básica de consulta

## 🎯 Próximos Passos

Para uma versão de produção completa, considere:

1. **Modularização**: Migrar para React + Vite/Webpack
2. **Build Pipeline**: Minificação e otimização
3. **Gerenciamento de Estado**: Redux ou Zustand
4. **Testes**: Jest + React Testing Library
5. **TypeScript**: Tipagem estática
6. **CI/CD**: Deploy automatizado

## 📚 Documentação Adicional

- [Especificação Frontend](./ESPECIFICACAO_FRONTEND.md) - Detalhes técnicos
- [Documentação de Protótipos](./PROTOTIPO_README.md) - Evolução dos protótipos
- [README Principal](../README.md) - Visão geral do projeto

---

**Nota**: Os arquivos atuais utilizam CDN para simplicidade de desenvolvimento. Para produção, recomenda-se build com bundler (Vite/Webpack) e otimização.
