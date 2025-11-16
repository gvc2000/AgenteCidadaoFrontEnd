# 🇧🇷 Protótipo - Agente Cidadão

Protótipo funcional da interface do **Agente Cidadão**, um assistente conversacional para consultar dados públicos da Câmara dos Deputados.

## 📋 Visão Geral

Este protótipo implementa a especificação de front-end do Agente Cidadão com:

- ✅ Interface de chat estilo conversação
- ✅ Design baseado na identidade visual da Câmara dos Deputados
- ✅ Layout responsivo (desktop, tablet, mobile)
- ✅ Componentes React funcionais
- ✅ Simulação de consultas à API de Dados Abertos
- ✅ Badges de fontes de dados
- ✅ Estados de loading e erro

## 🎨 Design System Implementado

### Paleta de Cores

- **Verde Primário:** `#00AA4D` - Botões, links, elementos principais
- **Verde Escuro:** `#006636` - Headers, hover states
- **Dourado:** `#E3AD6D` - Badges de fonte de dados
- **Background:** `#F5F7FA` - Fundo geral da página
- **Branco:** `#FFFFFF` - Cards, mensagens
- **Texto Primário:** `#1F2933`
- **Texto Secundário:** `#6B7280`

### Tipografia

- **Fonte:** Inter (Google Fonts)
- **Tamanhos:**
  - Títulos: 1.25-1.5rem (20-24px)
  - Corpo: 0.9375rem (15px)
  - Metadados: 0.75-0.8125rem (12-13px)

## 🚀 Como Visualizar

### Método 1: Abrir diretamente no navegador

1. **Duplo clique** no arquivo `prototipo-agente-cidadao.html`
2. Ou **arraste** o arquivo para o navegador (Chrome, Firefox, Safari, Edge)

### Método 2: Via linha de comando

```bash
# macOS
open prototipo-agente-cidadao.html

# Linux
xdg-open prototipo-agente-cidadao.html

# Windows
start prototipo-agente-cidadao.html
```

### Método 3: Servidor local (opcional)

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js
npx http-server

# Depois acesse: http://localhost:8000/prototipo-agente-cidadao.html
```

## 💡 Recursos Implementados

### 1. Interface de Chat

- **Mensagens do usuário:** Alinhadas à direita, fundo verde
- **Mensagens do assistente:** Alinhadas à esquerda, fundo branco com borda
- **Avatares:** Ícones diferenciados para usuário (👤) e assistente (🤖)
- **Timestamps:** Horário de cada mensagem
- **Auto-scroll:** Rola automaticamente para última mensagem

### 2. Sidebar de Contexto

- **Exemplos de perguntas:** Clicáveis, preenchem o input
- **Fontes ativas:** Lista de APIs conectadas
  - Câmara dos Deputados (ativo)
  - Outras fontes (em breve)

### 3. Input Inteligente

- **Enter:** Envia mensagem
- **Shift+Enter:** Quebra linha
- **Auto-resize:** Campo de texto se expande até limite
- **Validação:** Botão desabilitado quando vazio

### 4. Badges de Fonte

- **Design:** Fundo dourado (#E3AD6D), texto verde escuro
- **Clicáveis:** Abrem link da fonte em nova aba
- **Informações:** Nome do órgão + tipo de dado

### 5. Estados de Loading

- **Animação:** Dots pulsantes
- **Texto:** "Consultando dados oficiais..."
- **Skeleton:** Mantém layout durante carregamento

### 6. Toast de Erro

- **Posicionamento:** Canto superior direito
- **Auto-dismiss:** Desaparece após 5 segundos
- **Ação:** Botão X para fechar manualmente

### 7. Responsividade

#### Desktop (≥1024px)
- Layout em 2 colunas: Sidebar (30%) + Chat (70%)
- Navegação no header
- Mensagens ocupam 70% da largura

#### Tablet (768-1024px)
- Sidebar oculta por padrão
- Botão de menu hambúrguer
- Layout adaptado

#### Mobile (<768px)
- Chat em tela cheia
- Input empilhado verticalmente
- Sidebar em overlay
- Mensagens ocupam 90% da largura

## 🧪 Perguntas de Teste

Digite estas perguntas para ver diferentes respostas simuladas:

1. **"Quem é o deputado Guilherme Boulos?"**
   - Retorna informações detalhadas do deputado
   - Mostra fontes de dados

2. **"Como votou meu deputado na PEC X?"**
   - Informações sobre votações
   - Links para API de votações

3. **"Mostre as proposições sobre educação"**
   - Informações sobre tipos de proposições
   - Links para API de proposições

4. **"Quais foram os gastos de gabinete em 2024?"**
   - Informações sobre despesas parlamentares
   - Categorias de despesas

5. **"Olá" (ou qualquer outra pergunta genérica)**
   - Mensagem de boas-vindas
   - Lista de funcionalidades

## 📂 Estrutura do Código

### Componentes React

```
AgenteCidadao (Principal)
├── Header
│   └── Navegação + Logo
├── Sidebar
│   ├── Exemplos de perguntas
│   └── Fontes ativas
└── ChatContainer
    ├── EmptyState
    ├── MessageBubble
    │   ├── SourceBadge
    │   └── RawDataLink
    ├── LoadingMessage
    └── ChatInput

ErrorToast (Global)
```

### Lógica de Simulação

A função `simulateResponse()` detecta palavras-chave e retorna respostas apropriadas:

- **"boulos", "guilherme"** → Info do deputado
- **"votação", "votou", "pec"** → Info de votações
- **"proposição", "projeto", "pl"** → Info de proposições
- **"despesa", "gasto"** → Info de despesas
- **Outros** → Mensagem de boas-vindas

## 🔗 Integrações Futuras

Este protótipo simula as respostas. Na versão de produção, será necessário:

### Backend
- API de orquestração (`/api/consulta`)
- Integração com LLM (Claude/GPT)
- Conexão via MCP com APIs de dados abertos

### Funcionalidades Adicionais
- [ ] Histórico de conversas (localStorage)
- [ ] Exportação de dados (JSON, CSV, PDF)
- [ ] Favoritar perguntas/respostas
- [ ] Dark mode
- [ ] Compartilhamento de conversas
- [ ] Filtros avançados por período/categoria
- [ ] Gráficos e visualizações de dados
- [ ] PWA (offline-first)

## 🎯 Compatibilidade

### Navegadores Testados
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Dispositivos
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iPad, Android)
- ✅ Mobile (iOS, Android)

## 📊 Tecnologias Utilizadas

- **React 18** (via CDN)
- **Babel Standalone** (transpilação JSX)
- **CSS3** (Custom Properties, Flexbox, Grid)
- **Google Fonts** (Inter)
- **ES6+** (Arrow functions, async/await, destructuring)

### Por que React via CDN?

- ✅ Sem necessidade de build tools
- ✅ Abre diretamente no navegador
- ✅ Ideal para prototipagem rápida
- ✅ Facilita revisão e testes
- ⚠️ **Não recomendado para produção** (usar Vite/Next.js)

## 🚀 Próximos Passos (Produção)

### 1. Setup do Projeto Real
```bash
npm create vite@latest agente-cidadao -- --template react-ts
cd agente-cidadao
npm install
```

### 2. Dependências Recomendadas
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### 3. Migração dos Componentes

1. Extrair componentes para arquivos separados:
   ```
   src/
   ├── components/
   │   ├── Header.tsx
   │   ├── Sidebar.tsx
   │   ├── ChatContainer.tsx
   │   ├── MessageBubble.tsx
   │   ├── ChatInput.tsx
   │   └── ErrorToast.tsx
   ├── services/
   │   └── api.ts
   ├── types/
   │   └── index.ts
   └── App.tsx
   ```

2. Adicionar TypeScript para type safety
3. Implementar React Query para cache
4. Conectar com API real

### 4. Integração com MCP Server

```typescript
// services/api.ts
async function enviarPergunta(pergunta: string): Promise<RespostaLLM> {
  const response = await fetch('/api/consulta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta })
  });
  return response.json();
}
```

## 📝 Notas Técnicas

### Performance
- Componentes otimizados com React hooks
- Scroll suave com `scrollIntoView`
- Debounce no input (pode ser adicionado)
- Lazy loading de mensagens (futuro)

### Acessibilidade
- Semântica HTML correta
- Contraste de cores WCAG AA
- Navegação por teclado funcional
- ARIA labels (podem ser melhorados)

### SEO (para produção)
- Meta tags apropriadas
- Open Graph para compartilhamento
- Schema.org markup
- Sitemap.xml

## 🐛 Limitações do Protótipo

1. **Dados simulados** - Não consulta API real
2. **Sem persistência** - Conversas não são salvas
3. **Sem autenticação** - Não há sistema de usuários
4. **Respostas básicas** - Keyword matching simples
5. **Sem streaming** - Resposta aparece de uma vez
6. **Sem histórico** - Não guarda conversas anteriores

## 📞 Suporte

Para dúvidas ou sugestões sobre o protótipo:

1. Verifique este README
2. Teste os exemplos de perguntas
3. Inspecione o código (é todo inline no HTML)
4. Abra uma issue no repositório

## 📄 Licença

Este protótipo faz parte do projeto Agente Cidadão - MIT License

---

**Desenvolvido com ❤️ para democratizar o acesso a dados públicos**

🇧🇷 **Agente Cidadão** - Tornando a democracia mais acessível, uma conversa por vez.
