# CLAUDE.md - Guia para Desenvolvimento com IA

## Visao Geral do Projeto

**Agente Cidadao** - Frontend de chat conversacional para acesso a dados abertos governamentais brasileiros (Camara dos Deputados, Senado, Portal da Transparencia).

## Stack Tecnologico

- **Frontend**: React 18 via CDN + Babel Standalone (JSX inline em HTML)
- **Backend**: Express.js (server.js) servindo arquivos estaticos
- **Deploy**: Railway (Nixpacks)
- **Estilos**: CSS puro com Custom Properties

## Estrutura de Diretorios

```
/
├── server.js                    # Servidor Express (127 linhas)
├── package.json                 # Node deps (express, cors, nodemon)
├── frontend/
│   ├── current/                 # Versao producao
│   │   ├── agente-cidadao-bilingual.html  # PRINCIPAL (49KB) - PT/ES
│   │   ├── index.html                     # Original PT-BR (38KB)
│   │   ├── login-agente-cidadao.html      # Autenticacao (12KB)
│   │   ├── admin-agente-cidadao.html      # Dashboard admin (30KB)
│   │   └── demo-agente-cidadao.html       # Demo automatica (24KB)
│   ├── archive/                 # Versoes anteriores (v1, v2, v3)
│   └── docs/                    # Specs tecnicas
├── DEPLOY.md                    # Guia Railway
└── railway.json                 # Config deploy
```

## Arquivos Principais para Editar

| Arquivo | Proposito | Quando editar |
|---------|-----------|---------------|
| `frontend/current/agente-cidadao-bilingual.html` | Interface principal | Features de chat, UI, estilos |
| `server.js` | Rotas Express | Novas rotas, middleware |
| `frontend/docs/ESPECIFICACAO_FRONTEND.md` | Spec completa | Documentar mudancas de arquitetura |

## Rotas do Servidor

```javascript
GET /           → agente-cidadao-bilingual.html (PADRAO)
GET /bilingual  → agente-cidadao-bilingual.html
GET /index      → index.html
GET /demo       → demo-agente-cidadao.html
GET /admin      → admin-agente-cidadao.html
GET /login      → login-agente-cidadao.html
GET /health     → JSON { status: 'ok' }
```

## Arquitetura do Frontend

### Padrao: React Inline em HTML

Cada arquivo HTML segue esta estrutura:
```html
<html>
  <head>
    <style>/* CSS completo */</style>
  </head>
  <body>
    <div id="root"></div>
    <script src="react@18"></script>
    <script src="react-dom@18"></script>
    <script src="babel-standalone"></script>
    <script type="text/babel">
      // Componentes React inline
      function AgenteCidadao() { ... }
      ReactDOM.createRoot(root).render(<AgenteCidadao />);
    </script>
  </body>
</html>
```

### Componentes Principais (agente-cidadao-bilingual.html)

```
AgenteCidadao (raiz)
├── Header (logo, seletor idioma PT/ES)
├── SidebarExamples (exemplos clicaveis)
├── ChatContainer
│   ├── ChatMessages
│   │   ├── EmptyState
│   │   ├── MessageBubble[] (user/assistant)
│   │   └── LoadingMessage
│   └── ChatInput (Enter=enviar, Shift+Enter=nova linha)
└── SidebarDataSources (fontes de dados)
```

### Estado (React Hooks)

```javascript
const [messages, setMessages] = useState([]);      // Array de Message
const [inputValue, setInputValue] = useState('');  // Texto input
const [isLoading, setIsLoading] = useState(false); // Loading state
const [language, setLanguage] = useState('pt');    // 'pt' | 'es'
```

### Tipo Message

```typescript
interface Message {
  id: string;                    // Date.now().toString()
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;             // ISO 8601
  sources?: SourceTag[];         // Badges de fonte
}

interface SourceTag {
  url: string;
  tipoDado: string;              // 'API de Deputados', etc.
}
```

## Sistema de Estilos

### Variaveis CSS (Paleta)

```css
--verde-primario: #00AA4D;   /* Botoes, destaques */
--verde-escuro: #006636;     /* Hover, headers */
--dourado: #E3AD6D;          /* Badges fonte */
--background: #F5F7FA;       /* Fundo geral */
--texto-primario: #1F2933;   /* Texto principal */
--texto-secundario: #6B7280; /* Subtexto */
```

### Breakpoints

- Desktop: >= 1024px (3 colunas)
- Tablet: 768-1023px (1 coluna, sidebars ocultas)
- Mobile: < 768px (1 coluna, input vertical)

## Comunicacao com Backend

### Webhook Atual (Teste)

```javascript
const webhookUrl = 'https://primary-production-8bd9b.up.railway.app/webhook-test/...';

// POST apos envio de mensagem
fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question, timestamp, messageId })
});
```

### Simulacao de Resposta

Atualmente usa `simulateResponse()` com deteccao de keywords:
- "boulos" → Info deputado com sources
- Outros → Mensagem boas-vindas

## Comandos de Desenvolvimento

```bash
# Instalar dependencias
npm install

# Desenvolvimento (hot reload)
npm run dev

# Producao
npm start

# Porta padrao
PORT=3000 (ou process.env.PORT)
```

## Deploy (Railway)

```bash
# Build: Nixpacks detecta Node.js automaticamente
# Start: npm start
# Health check: GET /health
```

## Padroes de Codigo

### Adicionar Nova Mensagem

```javascript
const newMessage = {
  id: Date.now().toString(),
  role: 'user', // ou 'assistant'
  content: texto,
  createdAt: new Date().toISOString(),
  sources: [] // opcional
};
setMessages(prev => [...prev, newMessage]);
```

### Adicionar Fonte (Badge)

```javascript
sources: [{
  url: 'https://dadosabertos.camara.leg.br/api/v2/deputados',
  tipoDado: 'API de Deputados'
}]
```

### Estilizar Componente

Usar CSS inline no `<style>` do HTML:
```css
.meu-componente {
  background: var(--branco);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}
```

## APIs de Dados (Futuro)

| API | Status | URL Base |
|-----|--------|----------|
| Camara dos Deputados | Ativo | dadosabertos.camara.leg.br/api/v2 |
| Senado Federal | Breve | legis.senado.leg.br/dadosabertos |
| Portal Transparencia | Breve | portaldatransparencia.gov.br |

## Checklist para Novas Features

- [ ] Adicionar componente no arquivo HTML principal
- [ ] Atualizar estado se necessario
- [ ] Adicionar estilos CSS inline
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Verificar acessibilidade (contraste, teclado)
- [ ] Atualizar ESPECIFICACAO_FRONTEND.md se arquitetura mudar

## Problemas Comuns

### Babel nao transpila JSX
- Verificar `type="text/babel"` no script
- Checar imports do Babel Standalone

### Estilos nao aplicam
- CSS esta no mesmo arquivo HTML
- Verificar especificidade (usar classes, nao IDs)

### Scroll nao funciona
- Verificar `messagesEndRef.current?.scrollIntoView()`
- Container precisa `overflow-y: auto`

## Links Uteis

- [API Camara](https://dadosabertos.camara.leg.br/swagger/api.html)
- [Railway Docs](https://docs.railway.app)
- [React 18 Docs](https://react.dev)

## Contexto do Projeto

O Agente Cidadao visa democratizar acesso a dados publicos brasileiros atraves de interface conversacional. Usuarios fazem perguntas em linguagem natural e recebem respostas com links diretos para fontes oficiais.

**Publico-alvo**: Cidadaos, jornalistas, pesquisadores, estudantes.

**Diferencial**: Transparencia total - cada resposta inclui badges clicaveis com URLs das APIs oficiais consultadas.
