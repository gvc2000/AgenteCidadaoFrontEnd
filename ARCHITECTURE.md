# Arquitetura do Agente Cidadao

## Diagrama de Alto Nivel

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    USUARIO      │────▶│   FRONTEND       │────▶│   EXPRESS       │
│  (Navegador)    │◀────│   (React/CDN)    │◀────│   (server.js)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │                        │
                                │ POST                   │
                                ▼                        ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │   WEBHOOK        │     │   RAILWAY       │
                        │   (Railway)      │     │   (Deploy)      │
                        └──────────────────┘     └─────────────────┘
                                │
                                ▼ (Futuro)
                        ┌──────────────────┐
                        │   LLM + MCP      │
                        │   (Claude)       │
                        └──────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │   APIs Oficiais  │
                        │   (Camara, etc)  │
                        └──────────────────┘
```

## Fluxo de Dados

### 1. Envio de Mensagem

```
Usuario digita → handleSend() → setMessages([...prev, userMsg])
                           ↓
                    setIsLoading(true)
                           ↓
                    fetch(webhookUrl, POST)
                           ↓
                    setTimeout(1500ms)
                           ↓
                    simulateResponse()
                           ↓
                    setMessages([...prev, assistantMsg])
                           ↓
                    setIsLoading(false)
```

### 2. Renderizacao

```
messages.map() → MessageBubble
                    ├── Avatar (user/assistant)
                    ├── Content (texto ou markdown)
                    ├── Timestamp
                    └── SourceBadge[] (se houver)
```

## Estrutura de Componentes

### Hierarquia Completa

```
AgenteCidadao
│
├── Header
│   ├── GovBar (Brasil, Governo Federal)
│   ├── AppHeader
│   │   ├── Logo (emoji)
│   │   ├── Title
│   │   └── LanguageSelector (PT/ES)
│   └── InfoBanner (100% Dados Abertos)
│
├── MainContainer (CSS Grid 3 colunas)
│   │
│   ├── SidebarExamples (coluna 1)
│   │   ├── SectionTitle
│   │   └── ExampleCard[] (onClick → setInputValue)
│   │
│   ├── ChatContainer (coluna 2)
│   │   ├── ChatHeader (titulo)
│   │   ├── ChatMessages (scroll)
│   │   │   ├── EmptyState (se messages.length === 0)
│   │   │   ├── MessageBubble[] (map messages)
│   │   │   └── LoadingMessage (se isLoading)
│   │   └── ChatInputArea
│   │       ├── Textarea (ref, auto-resize)
│   │       └── SendButton
│   │
│   └── SidebarDataSources (coluna 3)
│       ├── SectionTitle
│       └── DataSourceCard[]
│           ├── Icon
│           ├── Name
│           ├── Status (Ativo/Em breve)
│           └── Link (documentacao)
│
└── Footer (opcional)
```

### Props e Callbacks

```javascript
// ChatInput
<ChatInput
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onSend={handleSend}
  onKeyDown={handleKeyDown}
  disabled={isLoading}
  inputRef={inputRef}
/>

// MessageBubble
<MessageBubble
  message={{
    id: '123',
    role: 'assistant',
    content: 'Texto...',
    sources: [{url: '...', tipoDado: '...'}]
  }}
/>

// ExampleCard
<ExampleCard
  text="Gastos do deputado Boulos?"
  onClick={() => setInputValue(text)}
/>
```

## Estado da Aplicacao

### Estado Local (Atual)

```javascript
// Estados principais
const [messages, setMessages] = useState([]);
const [inputValue, setInputValue] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [language, setLanguage] = useState('pt');

// Refs
const messagesEndRef = useRef(null);
const inputRef = useRef(null);
```

### Estado Global (Futuro - Zustand)

```javascript
const useChatStore = create((set, get) => ({
  // Estado
  messages: [],
  isLoading: false,
  language: 'pt',
  history: [],

  // Actions
  addMessage: (msg) => set(state => ({
    messages: [...state.messages, msg]
  })),

  clearMessages: () => set({ messages: [] }),
  setLoading: (val) => set({ isLoading: val }),
  setLanguage: (lang) => set({ language: lang }),

  // Selectors
  getLastMessage: () => get().messages.slice(-1)[0],
  getUserMessages: () => get().messages.filter(m => m.role === 'user')
}));
```

## Comunicacao com APIs

### Estrutura de Requisicao

```javascript
// Webhook POST
{
  "question": "string",          // Pergunta do usuario
  "timestamp": "ISO 8601",       // Momento do envio
  "messageId": "string",         // ID unico
  "language": "pt|es",           // Idioma (opcional)
  "sessionId": "string"          // Sessao (futuro)
}
```

### Estrutura de Resposta (Esperada)

```javascript
{
  "success": true,
  "data": {
    "content": "string",         // Resposta em markdown
    "sources": [
      {
        "url": "string",
        "tipoDado": "string",
        "timestamp": "ISO 8601"
      }
    ],
    "rawDataId": "string",       // ID para dados brutos
    "confidence": 0.95           // Confianca (opcional)
  },
  "metadata": {
    "processingTime": 1234,      // ms
    "tokensUsed": 500
  }
}
```

## Sistema de Estilos

### CSS Custom Properties

```css
:root {
  /* Cores principais */
  --verde-primario: #00AA4D;
  --verde-escuro: #006636;
  --verde-claro: #00d65e;
  --dourado: #E3AD6D;

  /* Neutros */
  --background: #F5F7FA;
  --branco: #FFFFFF;
  --texto-primario: #1F2933;
  --texto-secundario: #6B7280;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

  /* Espacamento */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Layout Grid

```css
/* Desktop */
.main-container {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 1.25rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Tablet */
@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .chat-input-wrapper {
    flex-direction: column;
  }
}
```

## Acessibilidade

### Implementado

- Semantica HTML (header, main, nav, button)
- Contraste WCAG 2.1 AA (maioria)
- Navegacao por teclado (Tab, Enter, Shift+Enter)
- Focus visible em inputs
- Alt text em imagens/emojis

### Pendente

- ARIA labels completos
- Skip links
- Anuncios de screen reader
- Modo alto contraste
- Reducao de movimento

## Seguranca

### Atual

- CORS habilitado (cors middleware)
- Sem auth real (credenciais hardcoded)
- Sem sanitizacao de input (XSS risk)

### Recomendado

- [ ] Sanitizar input com DOMPurify
- [ ] Implementar CSP headers
- [ ] Auth real (OAuth/JWT)
- [ ] Rate limiting
- [ ] HTTPS only
- [ ] Validacao de webhook

## Performance

### Metricas Alvo

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- TTI: < 3.5s

### Otimizacoes Futuras

- [ ] Code splitting (React lazy)
- [ ] Preload fonts
- [ ] Image optimization
- [ ] Service worker (PWA)
- [ ] CDN para assets
- [ ] Gzip/Brotli compression

## Testes (Futuro)

### Unit Tests

```javascript
// Vitest + Testing Library
describe('ChatInput', () => {
  it('calls onSend when Enter pressed', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} value="test" />);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalled();
  });
});
```

### E2E Tests

```javascript
// Playwright
test('send message flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('textarea', 'Teste');
  await page.click('button[type="submit"]');
  await expect(page.locator('.message.user')).toBeVisible();
  await expect(page.locator('.message.assistant')).toBeVisible();
});
```

## Extensibilidade

### Adicionar Nova Fonte de Dados

1. Adicionar card em `SidebarDataSources`
2. Atualizar `simulateResponse()` com novos patterns
3. Adicionar badge type em `SourceTag`
4. Documentar em ESPECIFICACAO_FRONTEND.md

### Adicionar Novo Idioma

1. Adicionar botao em `LanguageSelector`
2. Criar objeto de traducoes
3. Atualizar condicoes `language === 'xx'`
4. Testar todos os textos

### Migrar para Build System

1. `npm create vite@latest -- --template react-ts`
2. Mover componentes para arquivos .tsx
3. Configurar Tailwind CSS
4. Mover CSS para modulos
5. Configurar env vars
6. Atualizar Railway config

## Decisoes de Arquitetura

### Por que React via CDN?

- **Prototipagem rapida**: Sem setup de build
- **Iteracao facil**: Editar HTML direto
- **Deploy simples**: Apenas arquivos estaticos
- **Desvantagem**: Sem code splitting, bundle grande

### Por que CSS inline?

- **Co-localizacao**: Estilos junto com componentes
- **Sem conflitos**: Escopo no arquivo
- **Desvantagem**: Duplicacao entre arquivos

### Por que Express simples?

- **Minimalista**: Apenas serve arquivos
- **Flexivel**: Facil adicionar rotas
- **Railway ready**: Health check integrado

## Roadmap Tecnico

### Fase Atual (MVP)

- [x] Chat funcional
- [x] Sidebars informativas
- [x] Responsividade
- [x] Webhook integration

### Proxima Fase

- [ ] Historico localStorage
- [ ] Markdown rendering (Marked.js)
- [ ] Dark mode
- [ ] Export (JSON/CSV)

### Fase Futura

- [ ] Migrar para Vite + TypeScript
- [ ] Zustand para estado
- [ ] React Query para cache
- [ ] PWA com Service Worker
- [ ] Auth real
- [ ] MCP integration
