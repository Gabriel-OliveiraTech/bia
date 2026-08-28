# 002 - feat - Melhorar Interface Gráfica da Rota /versao

## Descrição
A rota `/api/versao` atualmente retorna apenas uma string de texto simples (ex: `Bia 4.3.0`). O objetivo desta tarefa é criar uma **página React** dedicada à rota `/versao` no frontend, exibindo as informações de versão da API com o mesmo padrão visual (design system, cores, tipografia, dark mode) utilizado no restante da aplicação.

## Problema Atual
- A rota `/api/versao` retorna texto puro sem nenhuma formatação visual
- Não existe uma página dedicada no frontend para exibir informações de versão de forma amigável
- O componente `VersionInfo.jsx` já consome esse endpoint, mas apenas como um tooltip/botão no header
- Não há uma rota `/versao` no React Router

## Objetivo
Criar uma página React (`/versao`) que:
1. Consuma o endpoint `/api/versao`
2. Exiba as informações com o mesmo estilo visual da aplicação (variáveis CSS, tema claro/escuro, fontes, cards, etc.)
3. Seja acessível via uma nova rota no React Router

## Critérios de Aceite

### Frontend (React)
- [ ] Criar componente `Versao.jsx` em `client/src/components/`
- [ ] Criar rota `/versao` no `App.jsx` usando React Router
- [ ] A página deve exibir:
  - Nome e versão da API (ex: "Bia 4.3.0")
  - Status da API (Online/Offline/Verificando)
  - Informações do ambiente (Local, IP Direto, ALB, Produção)
  - URL da API
  - Configuração de cache (quando disponível)
  - Botão para atualizar o status
  - Botão/link para voltar à página principal
- [ ] Usar as variáveis CSS existentes (`--bg-card`, `--text-primary`, `--accent-primary`, etc.)
- [ ] Suportar tema claro e escuro (dark mode) usando o `ThemeContext` existente
- [ ] Usar a fonte Inter e os estilos de card já definidos no `index.css`
- [ ] Adicionar link para `/versao` no Footer ou Header

### Design
- [ ] Layout consistente com o restante da aplicação (max-width: 480px, border-radius, shadow)
- [ ] Cards com as informações organizadas de forma clara
- [ ] Indicadores visuais de status (🟢 Online, 🔴 Offline, 🟡 Verificando)
- [ ] Responsivo e acessível

### Backend
- [ ] Nenhuma alteração necessária no backend (endpoint `/api/versao` já funciona)

### Testes
- [ ] Teste unitário para o componente `Versao.jsx` verificando renderização básica
- [ ] Verificar que a rota `/versao` está acessível

## Referências de Código

### Endpoint existente
```
GET /api/versao
Retorno: "Bia 4.3.0" (string de texto)
```

### Componente de referência
O componente `VersionInfo.jsx` (`client/src/components/VersionInfo.jsx`) já implementa a lógica de:
- Fetch do endpoint `/api/versao`
- Detecção de ambiente
- Check de status da API
- Fetch de configuração de cache em `/api/cache-config`

**Reutilizar a lógica desse componente** como base para o novo componente de página.

### Estilos de referência
Usar as classes e variáveis CSS já existentes em `client/src/index.css`:
- `.container` — container principal
- `.header` — estilo de cabeçalho
- `--bg-card`, `--bg-secondary`, `--border-color` — cores de background
- `--text-primary`, `--text-secondary` — cores de texto
- `--accent-primary`, `--accent-success`, `--accent-danger` — cores de destaque
- `.btn` — botões padrão

### Rotas existentes no App.jsx
```jsx
<Route path="/" element={<HomePage />} />
<Route path="/about" element={<About />} />
// Adicionar:
<Route path="/versao" element={<Versao />} />
```

## Estimativa
- **Complexidade:** Baixa
- **Tipo:** Feature (Frontend only)
- **Impacto:** Baixo (nova página, sem alteração em funcionalidades existentes)

## Notas Técnicas
- Não modificar o componente `VersionInfo.jsx` existente (ele é usado no Header)
- Manter a consistência visual com `About.jsx` como referência de estrutura de página
- O componente `Versao.jsx` deve ser independente do `VersionInfo.jsx`
