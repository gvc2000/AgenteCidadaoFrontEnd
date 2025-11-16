# 🇧🇷 Especificação Técnica do Frontend - Agente Cidadão

## 1. Visão Geral do Produto

### 1.1 Descrição

**Agente Cidadão** é uma interface web de chat conversacional que permite a qualquer cidadão fazer perguntas em linguagem natural sobre dados legislativos e receber respostas baseadas em dados oficiais, inicialmente da Câmara dos Deputados.

### 1.2 Objetivos do Produto

- **Democratizar o acesso** a dados públicos legislativos
- **Simplificar consultas** através de linguagem natural
- **Garantir transparência** com referências às fontes oficiais
- **Facilitar a compreensão** de informações complexas

### 1.3 Fluxo Técnico

```
┌──────────────┐
│   Cidadão    │ Pergunta em linguagem natural
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   Frontend       │ Interface de Chat
│   (React)        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  API Orquestração│ POST /api/consulta
│  (/api/consulta) │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│      LLM         │ Claude/GPT processamento
│  (Claude/GPT)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   MCP Server     │ Protocolo MCP
│  (mcp-camara-br) │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  APIs Oficiais   │ Dados Abertos Câmara
│  (Câmara, etc)   │
└──────┬───────────┘
       │
       ▼
  Resposta estruturada:
  - Texto em linguagem natural
  - Referências (links + metadados)
  - Dados estruturados (JSON/tabelas)
```

## 2. Identidade Visual

### 2.1 Paleta de Cores

#### Cores Principais

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| Verde Primário | `#00AA4D` | rgb(0, 170, 77) | Botões principais, links, CTA |
| Verde Escuro | `#006636` | rgb(0, 102, 54) | Headers, hover, destaques |
| Dourado | `#E3AD6D` | rgb(227, 173, 109) | Badges de fonte, destaques secundários |

#### Cores de Fundo

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| Background Geral | `#F5F7FA` | rgb(245, 247, 250) | Fundo da página |
| Branco | `#FFFFFF` | rgb(255, 255, 255) | Cards, mensagens, containers |

#### Cores de Texto

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| Texto Primário | `#1F2933` | rgb(31, 41, 51) | Texto principal |
| Texto Secundário | `#6B7280` | rgb(107, 114, 128) | Legendas, timestamps, metadados |

#### Estados

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| Sucesso | `#16A34A` | rgb(22, 163, 74) | Confirmações |
| Alerta | `#F59E0B` | rgb(245, 158, 11) | Avisos |
| Erro | `#DC2626` | rgb(220, 38, 38) | Erros, falhas |

### 2.2 Tipografia

#### Fonte Principal

- **Família:** Inter (Google Fonts)
- **Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Peso disponível:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

#### Hierarquia de Tamanhos

| Elemento | Tamanho | Peso | Line Height |
|----------|---------|------|-------------|
| H1 (Títulos principais) | 1.5rem (24px) | 700 | 1.3 |
| H2 (Subtítulos) | 1.25rem (20px) | 600 | 1.4 |
| H3 (Seções) | 1rem (16px) | 600 | 1.5 |
| Corpo de texto | 0.9375rem (15px) | 400 | 1.6 |
| Texto secundário | 0.875rem (14px) | 400 | 1.5 |
| Labels/Metadados | 0.8125rem (13px) | 500 | 1.4 |
| Timestamps | 0.75rem (12px) | 400 | 1.3 |

### 2.3 Componentes de UI

#### Cards
- **Border radius:** 12px
- **Padding:** 1.25-1.5rem (20-24px)
- **Shadow:** 0 4px 6px rgba(0,0,0,0.1)
- **Border:** 1px solid #E5E7EB

#### Botões
- **Border radius:** 8-10px
- **Padding:** 0.875rem 1.5rem (14px 24px)
- **Transition:** all 0.2s ease
- **Hover:** translateY(-2px) + shadow increase

#### Badges
- **Border radius:** 6px
- **Padding:** 0.375rem 0.75rem (6px 12px)
- **Font size:** 0.75rem (12px)
- **Font weight:** 500

#### Input/Textarea
- **Border radius:** 10px
- **Border:** 1px solid #E5E7EB
- **Focus:** border-color verde + shadow rgba(0,170,77,0.1)
- **Padding:** 0.875rem 1rem (14px 16px)

## 3. Estrutura de Páginas

### 3.1 Página Principal: Chat (/)

#### Header (Sticky Top)
- **Altura:** ~70px
- **Conteúdo:**
  - Logo + Subtítulo (esquerda)
  - Navegação (direita): Fontes, Como funciona, Sobre
  - Menu hambúrguer (mobile)

#### Layout Desktop (≥1024px)

```
┌─────────────────────────────────────────────────┐
│                    Header                       │
├───────────────┬─────────────────────────────────┤
│               │                                 │
│   Sidebar     │       Chat Container           │
│   (30%)       │          (70%)                 │
│               │                                 │
│ - Exemplos    │  ┌─────────────────────────┐  │
│ - Fontes      │  │   Chat Messages        │  │
│               │  │                         │  │
│               │  │   [Mensagens]          │  │
│               │  │                         │  │
│               │  └─────────────────────────┘  │
│               │  ┌─────────────────────────┐  │
│               │  │   Chat Input           │  │
│               │  └─────────────────────────┘  │
│               │                                 │
└───────────────┴─────────────────────────────────┘
```

#### Layout Mobile (<768px)

```
┌─────────────────┐
│     Header      │
│   + Menu ☰      │
├─────────────────┤
│                 │
│  Chat Full      │
│   Width         │
│                 │
│  [Mensagens]    │
│                 │
│                 │
├─────────────────┤
│  Chat Input     │
│  (stacked)      │
└─────────────────┘
```

### 3.2 Outras Páginas

#### /fontes - Fontes de Dados
- Lista de APIs conectadas
- Cards com: Logo, Nome, Descrição, Status, Link documentação

#### /como-funciona - Explicação do Sistema
- Diagrama do fluxo técnico
- Explicação do MCP
- Privacidade e limitações

#### /sobre - Sobre o Projeto
- Filosofia (cidadania, transparência, LAI)
- Links institucionais
- Informações de contato

## 4. Especificação de Componentes

### 4.1 Tipos TypeScript

#### Message
```typescript
type MessageRole = 'user' | 'assistant' | 'system';

interface SourceTag {
  orgao: string; // 'Câmara dos Deputados', 'Senado', etc.
  url: string;
  tipoDado: string; // 'votação', 'proposição', 'despesas'
}

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string; // ISO 8601
  sources?: SourceTag[];
  rawDataId?: string; // ID para puxar dados estruturados
}
```

#### Chat State
```typescript
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
```

### 4.2 Componentes React

#### ChatLayout
```typescript
interface ChatLayoutProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}
```

**Responsabilidades:**
- Layout geral do chat
- Gerenciamento de estado de mensagens
- Scroll automático para última mensagem

#### MessageBubble
```typescript
interface MessageBubbleProps {
  message: Message;
}
```

**Variantes:**
- User: alinhado à direita, fundo verde
- Assistant: alinhado à esquerda, fundo branco com borda

**Elementos:**
- Avatar (emoji ou imagem)
- Conteúdo da mensagem (suporta markdown básico)
- Lista de fontes (SourceBadge[])
- Link "Ver dados brutos" (se rawDataId presente)
- Timestamp

#### ChatInput
```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}
```

**Comportamento:**
- Enter: envia
- Shift+Enter: nova linha
- Auto-resize até máximo de 200px
- Validação: desabilita botão se vazio

#### SourceBadge
```typescript
interface SourceBadgeProps {
  source: SourceTag;
}
```

**Estilo:**
- Background: Dourado (#E3AD6D)
- Texto: Verde escuro (#006636)
- Clicável: abre link em nova aba
- Hover: elevação + sombra

#### Sidebar
```typescript
interface SidebarProps {
  examples: string[];
  onExampleClick: (question: string) => void;
}
```

**Seções:**
- Exemplos de perguntas (clicáveis)
- Fontes ativas (chips com status)

#### LoadingMessage
**Elementos:**
- Avatar do assistente
- Animação de dots (bounce)
- Texto: "Consultando dados oficiais..."

#### ErrorToast
```typescript
interface ErrorToastProps {
  message: string;
  onClose: () => void;
}
```

**Comportamento:**
- Auto-dismiss após 5 segundos
- Fechar manualmente (botão X)
- Posição: top-right (desktop), top-center (mobile)

## 5. Arquitetura Frontend

### 5.1 Stack Recomendada (Produção)

```json
{
  "framework": "React 18+",
  "buildTool": "Vite 4+",
  "language": "TypeScript 5+",
  "styling": "Tailwind CSS 3+",
  "stateManagement": {
    "local": "Zustand 4+",
    "server": "TanStack Query 5+"
  },
  "animations": "Framer Motion 10+",
  "icons": "Lucide React",
  "forms": "React Hook Form + Zod",
  "components": "Shadcn/ui ou Radix UI",
  "testing": {
    "unit": "Vitest + Testing Library",
    "e2e": "Playwright"
  }
}
```

### 5.2 Estrutura de Diretórios

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatLayout.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── LoadingMessage.tsx
│   │   └── index.ts
│   ├── shared/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SourceBadge.tsx
│   │   ├── ErrorToast.tsx
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── index.ts
├── pages/
│   ├── Index.tsx          # Chat principal
│   ├── Fontes.tsx
│   ├── ComoFunciona.tsx
│   └── Sobre.tsx
├── services/
│   ├── api.ts             # Cliente da API
│   └── types.ts           # Tipos compartilhados
├── hooks/
│   ├── useChat.ts
│   ├── useAutoScroll.ts
│   └── index.ts
├── store/
│   └── chatStore.ts       # Zustand store
├── utils/
│   ├── formatters.ts
│   └── validators.ts
└── App.tsx
```

### 5.3 Serviço de API

```typescript
// services/api.ts
interface ConsultaPayload {
  pergunta: string;
  contexto?: Record<string, any>;
}

interface RespostaLLM {
  answer: string;
  sources: SourceTag[];
  rawData?: any;
  metadata?: {
    model: string;
    tokens: number;
    latency: number;
  };
}

async function enviarPergunta(
  payload: ConsultaPayload
): Promise<RespostaLLM> {
  const response = await fetch('/api/consulta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Falha ao consultar dados');
  }

  return response.json();
}

// Suporte a streaming (SSE)
function enviarPerguntaStream(
  payload: ConsultaPayload,
  onChunk: (chunk: string) => void,
  onComplete: (sources: SourceTag[]) => void
): void {
  const eventSource = new EventSource(
    `/api/consulta/stream?q=${encodeURIComponent(payload.pergunta)}`
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'chunk') {
      onChunk(data.content);
    } else if (data.type === 'complete') {
      onComplete(data.sources);
      eventSource.close();
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
    throw new Error('Erro no streaming');
  };
}
```

## 6. Responsividade

### 6.1 Breakpoints

| Nome | Min Width | Layout |
|------|-----------|--------|
| Mobile | < 768px | Coluna única, stack vertical |
| Tablet | 768px - 1023px | Sidebar oculta, menu hambúrguer |
| Desktop | ≥ 1024px | 2 colunas (sidebar + chat) |
| Wide | ≥ 1400px | Max-width container centrado |

### 6.2 Ajustes por Breakpoint

#### Mobile (<768px)
- Sidebar: overlay/drawer ativado por menu
- Input: textarea + botão empilhados verticalmente
- Mensagens: 90% largura máxima
- Header: compacto, sem subtítulo
- Navegação: escondida, acessível via menu

#### Tablet (768-1024px)
- Sidebar: oculta por padrão, toggle
- Mensagens: 80% largura máxima
- Layout: coluna única

#### Desktop (≥1024px)
- Layout: 2 colunas (30% + 70%)
- Sidebar: sempre visível
- Mensagens: 70% largura máxima

## 7. Performance e Otimização

### 7.1 Métricas Alvo

| Métrica | Alvo |
|---------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s |
| Lighthouse Performance | > 90 |

### 7.2 Estratégias de Otimização

#### Code Splitting
```typescript
// Lazy loading de páginas
const Fontes = lazy(() => import('./pages/Fontes'));
const ComoFunciona = lazy(() => import('./pages/ComoFunciona'));
const Sobre = lazy(() => import('./pages/Sobre'));
```

#### Virtualização de Mensagens
- Usar `react-window` ou `react-virtuoso` para listas longas
- Renderizar apenas mensagens visíveis

#### Memoização
```typescript
const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  // ...
}, (prev, next) => prev.message.id === next.message.id);
```

#### Debounce no Input
```typescript
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    // Lógica de busca/sugestões
  }, 300),
  []
);
```

## 8. Acessibilidade (WCAG 2.1 AA)

### 8.1 Contraste de Cores

Todos os pares de cores atendem contraste mínimo de 4.5:1:
- Verde primário (#00AA4D) em branco: 3.9:1 ⚠️ (usar verde escuro)
- Verde escuro (#006636) em branco: 6.8:1 ✅
- Texto primário (#1F2933) em branco: 14.3:1 ✅
- Texto secundário (#6B7280) em branco: 5.7:1 ✅

### 8.2 Navegação por Teclado

| Tecla | Ação |
|-------|------|
| Tab | Navegar entre elementos focáveis |
| Enter | Enviar mensagem (no input) |
| Shift+Enter | Nova linha (no input) |
| Esc | Fechar sidebar/modais |
| ↑/↓ | Navegar histórico (futuro) |

### 8.3 ARIA Labels

```tsx
<button aria-label="Enviar mensagem" onClick={onSend}>
  Perguntar
</button>

<textarea
  aria-label="Digite sua pergunta"
  aria-required="true"
  placeholder="Faça uma pergunta..."
/>

<div role="log" aria-live="polite" aria-atomic="false">
  {/* Mensagens do chat */}
</div>
```

### 8.4 Foco Visível

```css
*:focus-visible {
  outline: 2px solid var(--verde-primario);
  outline-offset: 2px;
}
```

## 9. SEO

### 9.1 Meta Tags

```html
<head>
  <title>Agente Cidadão - Consulte dados públicos da Câmara dos Deputados</title>
  <meta name="description" content="Interface conversacional para consultar dados abertos da Câmara dos Deputados em linguagem natural. Acesse informações sobre deputados, proposições, votações e despesas." />

  <!-- Open Graph -->
  <meta property="og:title" content="Agente Cidadão" />
  <meta property="og:description" content="Seu assistente para consultar dados públicos" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://agentecidadao.gov.br" />
  <meta property="og:image" content="https://agentecidadao.gov.br/og-image.png" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Agente Cidadão" />
  <meta name="twitter:description" content="Consulte dados públicos em linguagem natural" />

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Agente Cidadão",
    "description": "Interface para consultar dados públicos legislativos",
    "url": "https://agentecidadao.gov.br",
    "applicationCategory": "GovernmentApplication",
    "operatingSystem": "Web"
  }
  </script>
</head>
```

## 10. Segurança

### 10.1 Content Security Policy

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.agentecidadao.gov.br;
```

### 10.2 Sanitização de Conteúdo

```typescript
import DOMPurify from 'dompurify';

function sanitizeMarkdown(content: string): string {
  // Processar markdown
  const html = marked(content);

  // Sanitizar HTML
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}
```

### 10.3 Rate Limiting (Client-side)

```typescript
// Prevenir spam de requisições
const useRateLimit = (maxRequests: number, windowMs: number) => {
  const requests = useRef<number[]>([]);

  const canMakeRequest = () => {
    const now = Date.now();
    requests.current = requests.current.filter(
      time => now - time < windowMs
    );

    if (requests.current.length >= maxRequests) {
      return false;
    }

    requests.current.push(now);
    return true;
  };

  return canMakeRequest;
};
```

## 11. Preparação para Múltiplas Fontes

### 11.1 Estrutura Extensível

```typescript
// Tipos para suportar múltiplas fontes
type OrgaoPublico =
  | 'Câmara dos Deputados'
  | 'Senado Federal'
  | 'Portal da Transparência'
  | 'TCU'
  | 'dados.gov.br';

interface FonteDados {
  id: string;
  nome: OrgaoPublico;
  descricao: string;
  urlDocumentacao: string;
  ativa: boolean;
  icone: string; // URL ou emoji
  categorias: string[];
}

// Configuração de fontes
const fontesDisponiveis: FonteDados[] = [
  {
    id: 'camara',
    nome: 'Câmara dos Deputados',
    descricao: 'Dados abertos sobre deputados, proposições, votações',
    urlDocumentacao: 'https://dadosabertos.camara.leg.br',
    ativa: true,
    icone: '🏛️',
    categorias: ['legislativo', 'federal']
  },
  {
    id: 'senado',
    nome: 'Senado Federal',
    descricao: 'Dados sobre senadores e legislação federal',
    urlDocumentacao: 'https://legis.senado.leg.br/dadosabertos',
    ativa: false, // Em breve
    icone: '🏛️',
    categorias: ['legislativo', 'federal']
  }
  // ... outras fontes
];
```

### 11.2 Página de Fontes

```tsx
function FontesPage() {
  const fontesAtivas = fontesDisponiveis.filter(f => f.ativa);
  const fontesEmBreve = fontesDisponiveis.filter(f => !f.ativa);

  return (
    <div>
      <h1>Fontes de Dados Conectadas</h1>

      <section>
        <h2>Ativas</h2>
        {fontesAtivas.map(fonte => (
          <FonteCard key={fonte.id} fonte={fonte} />
        ))}
      </section>

      <section>
        <h2>Em Breve</h2>
        {fontesEmBreve.map(fonte => (
          <FonteCard key={fonte.id} fonte={fonte} disabled />
        ))}
      </section>
    </div>
  );
}
```

## 12. Roadmap de Implementação

### Fase 1: MVP (4-6 semanas)

#### Sprint 1-2: Setup e Componentes Base
- [x] Setup Vite + React + TypeScript
- [x] Configuração Tailwind CSS
- [x] Componentes UI básicos (Button, Card, Input)
- [x] Header e navegação
- [x] Layout responsivo base

#### Sprint 3-4: Chat Principal
- [x] ChatLayout component
- [x] MessageBubble (user + assistant)
- [x] ChatInput com validação
- [x] Estado de loading
- [x] Sidebar com exemplos

#### Sprint 5-6: Integração e Polimento
- [ ] Integração com API backend
- [ ] Error handling e toasts
- [ ] Suporte a streaming (SSE)
- [ ] Testes unitários
- [ ] Acessibilidade

### Fase 2: Funcionalidades Avançadas (4-6 semanas)

- [ ] Histórico de conversas (localStorage)
- [ ] Exportação de dados (JSON, CSV, PDF)
- [ ] Favoritar perguntas/respostas
- [ ] Dark mode
- [ ] Gráficos e visualizações
- [ ] Filtros avançados

### Fase 3: Expansão (futuro)

- [ ] PWA (offline-first)
- [ ] Múltiplas fontes de dados
- [ ] Compartilhamento de conversas
- [ ] Autenticação de usuários
- [ ] Dashboard administrativo
- [ ] Analytics e métricas

## 13. Critérios de Aceitação

### 13.1 Funcionalidades Mínimas (MVP)

- [x] Chat funcional com input e mensagens
- [x] Envio de perguntas via Enter
- [x] Exibição de respostas do assistente
- [x] Badges de fonte clicáveis
- [x] Estados de loading e erro
- [x] Layout responsivo (mobile/desktop)
- [ ] Integração com API backend real
- [ ] Persistência de conversas

### 13.2 Qualidade

- [ ] Lighthouse Performance > 90
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Testes unitários > 80% cobertura
- [ ] Testes E2E para fluxos críticos
- [ ] Zero erros de console em produção
- [ ] Compatibilidade: Chrome 90+, Firefox 88+, Safari 14+

### 13.3 Documentação

- [x] README com instruções de setup
- [x] Comentários em componentes complexos
- [x] Storybook para componentes (opcional)
- [ ] Documentação de API
- [ ] Guia de contribuição

---

## Referências

- [Dados Abertos da Câmara dos Deputados](https://dadosabertos.camara.leg.br/)
- [Portal da Transparência](https://portaldatransparencia.gov.br/)
- [Portal Brasileiro de Dados Abertos](https://dados.gov.br/)
- [Lei de Acesso à Informação](https://www.gov.br/acessoainformacao/pt-br)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Best Practices](https://react.dev/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Versão:** 1.0.0
**Data:** 2025-11-15
**Status:** ✅ Aprovado para implementação

**🇧🇷 Agente Cidadão** - Democratizando o acesso a dados públicos
