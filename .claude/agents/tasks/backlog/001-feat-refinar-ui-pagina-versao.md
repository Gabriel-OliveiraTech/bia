# 001 - feat - Refinar UI/UX da página /versao

## Descrição

Existe uma implementação inicial da página `/versao` (componente `client/src/components/VersionPage.jsx`, rota em `App.jsx` e link no `Footer.jsx`). Ela já funciona: consulta `GET /api/versao`, detecta o ambiente, mostra o cache e tem os botões "Atualizar" e "← Voltar".

Esta tarefa é um **refinamento visual** em cima dessa implementação. O código atual foi feito "aproveitando emprestado" o CSS da página `About` (`.about-page`, `.about-hero`, `.about-footer`) e resolve o resto com **estilos inline e cores hardcoded**, o que quebra a consistência de tema e dificulta manutenção.

> **Atenção (estado do repositório):** essa implementação inicial vive apenas no branch `origin/feature/001-feat-melhorar-pagina-versao` (commit `65d38ca`) e **ainda não foi integrada ao branch principal**. Antes de iniciar esta tarefa, garanta que a base de trabalho contém o `VersionPage.jsx` desse commit — caso contrário não há página para refinar.

## Objetivo

Elevar a qualidade visual e de acessibilidade da página `/versao`, eliminando estilos inline e cores fora do sistema de tema, adicionando estados visuais adequados (carregando/erro), feedback de atualização e um CSS próprio da página — sem alterar o comportamento funcional já entregue.

## Critérios de Aceite

### Sistema de estilo e tema
- [ ] Nenhum atributo `style={{ ... }}` inline permanece no `VersionPage.jsx` (hoje há 7 ocorrências: cores dos `h4` de status/ambiente/cache e o `div` de ações no rodapé)
- [ ] Foi criado um bloco de CSS dedicado em `client/src/index.css` com classes próprias (ex.: `.version-page`, `.version-hero`, `.version-card`, `.version-status`, `.version-actions`)
- [ ] A página deixa de reutilizar `.about-page` / `.about-hero` / `.about-footer` como se fosse a página About, passando a ter classes semânticas próprias (pode herdar/compor os estilos existentes, mas sem depender do nome `about-*`)
- [ ] As cores amarelas hardcoded (`#f59e0b`) são substituídas por uma nova variável de tema `--accent-warning`, declarada em `:root` **e** em `[data-theme="dark"]` no `client/src/index.css`
- [ ] As cores de ambiente hoje hardcoded em `getEnvironmentInfo()` (`#3b82f6`, `#f59e0b`, `#ef4444`, `#22c55e`, `#6b7280`) passam a usar as variáveis de tema (`--accent-primary`, `--accent-warning`, `--accent-danger`, `--accent-success`, `--text-secondary`)
- [ ] A página é validada nos dois temas (claro e escuro) com contraste legível em todos os cards

### Estados visuais
- [ ] Estado `checking` exibe um indicador de carregamento visual (skeleton ou spinner/pulse via CSS), não apenas o texto "Verificando conexão com a API..."
- [ ] O indicador de status possui animação sutil de pulse enquanto `apiStatus === 'checking'`
- [ ] Estado `offline` exibe um card de erro com mensagem acionável (ex.: URL tentada + sugestão de verificar se a API está no ar), no lugar do texto genérico atual
- [ ] O botão "Atualizar" mantém dimensões estáveis entre os estados (sem "pulo" de layout quando o texto muda para "Verificando...")

### Informação e feedback
- [ ] Exibe o horário da última verificação bem-sucedida (ex.: "Atualizado às 14:32:10")
- [ ] Exibe o tempo de resposta da chamada a `/api/versao` em milissegundos
- [ ] Adiciona re-checagem automática periódica (30s), com `clearInterval` no cleanup do `useEffect` — mesmo intervalo já usado pelo `VersionInfo.jsx`
- [ ] Adiciona ação para abrir o endpoint `/api/versao` em nova aba (equivalente ao `openVersionEndpoint` já existente no `VersionInfo.jsx`), que hoje não existe na página

### Acessibilidade e responsividade
- [ ] O bloco de status usa `role="status"` e `aria-live="polite"` para anunciar mudanças de estado
- [ ] Os ícones emoji decorativos usam `aria-hidden="true"`, com o significado disponível em texto
- [ ] O botão "Atualizar" possui `aria-label` descritivo e estado `disabled` visualmente evidente
- [ ] `document.title` é atualizado para algo como "Versão da API - BIA" ao entrar na página
- [ ] Layout validado em largura de 320px, 480px e 640px, respeitando os breakpoints existentes (`@media (max-width: 640px)` e `@media (max-width: 480px)`) e o `max-width: 480px` do `.container`
- [ ] A área de ações (Voltar + Atualizar) quebra corretamente em telas estreitas, sem overflow horizontal

### Manutenção (desejável, sem quebrar comportamento)
- [ ] A lógica duplicada entre `VersionInfo.jsx` e `VersionPage.jsx` (`getApiUrl`, `checkApiHealth`, `getEnvironmentInfo`, `getStatusIcon`, `getStatusText`) é extraída para um hook compartilhado (ex.: `client/src/hooks/useApiStatus.js`)
- [ ] Após a extração, `VersionInfo.jsx` continua funcionando exatamente como hoje (tooltip no Header)

## Contexto Técnico

### Stack
- **Frontend:** React 17 com Vite
- **Roteamento:** React Router DOM (`BrowserRouter`), rota `/versao` já registrada em `App.jsx`
- **Estilo:** CSS único em `client/src/index.css`, com variáveis de tema em `:root` e `[data-theme="dark"]`
- **Tema:** `client/src/contexts/ThemeContext.jsx`

### Arquivos Relevantes
- `client/src/components/VersionPage.jsx` — alvo principal do refinamento
- `client/src/index.css` — onde entram as novas classes e a variável `--accent-warning`
- `client/src/components/VersionInfo.jsx` — origem da lógica duplicada
- `client/src/components/About.jsx` — referência de estrutura de página
- `client/src/components/Footer.jsx` — link de acesso à página
- `client/src/App.jsx` — rota `/versao`
- `api/routes/versao.js` / `api/controllers/versao.js` — backend (não alterar)
- `api/routes/cache-config.js` — endpoint `GET /api/cache-config`

### Variáveis de tema disponíveis hoje
```
--bg-primary  --bg-secondary  --bg-card
--text-primary  --text-secondary  --border-color
--accent-primary  --accent-success  --accent-danger
--shadow
```
Não existe variável de aviso/warning — daí a necessidade de criar `--accent-warning`.

### Contratos de API (inalterados)
```
GET /api/versao        → "Bia 4.3.0"  (texto simples)
GET /api/cache-config  → { enabled: bool, endpoint: string, port: number, ttl: number }
```

## O que NÃO fazer
- ❌ Não alterar os endpoints `GET /api/versao` e `GET /api/cache-config` do backend
- ❌ Não remover a rota `/versao`, o link no `Footer.jsx` nem o `VersionInfo` do `Header.jsx`
- ❌ Não introduzir bibliotecas de UI/CSS-in-JS (Tailwind, styled-components, MUI) — manter CSS puro com variáveis
- ❌ Não trocar a versão do React nem do React Router
- ❌ Não redesenhar as páginas Home e About; o escopo é apenas `/versao`
- ❌ Não alterar `Dockerfile`, `buildspec.yml` ou qualquer configuração de infraestrutura

## Sugestão de Implementação

1. Criar `client/src/hooks/useApiStatus.js` extraindo `getApiUrl`, `checkApiHealth`, `getEnvironmentInfo`, `getStatusIcon` e `getStatusText`; expor `{ apiStatus, apiVersion, cacheConfig, env, lastCheck, responseTime, apiUrl, refresh }`.
2. Refatorar `VersionInfo.jsx` para consumir o hook (comportamento idêntico ao atual).
3. Adicionar `--accent-warning` em `:root` (`#f59e0b`) e em `[data-theme="dark"]` (`#fbbf24`).
4. Criar o bloco `/* Página /versao */` no fim de `client/src/index.css` com `.version-page`, `.version-hero`, `.version-grid`, `.version-card`, `.version-status`, `.version-status--online|--offline|--checking`, `.version-skeleton`, `.version-actions` e o keyframe de pulse.
5. Reescrever o JSX de `VersionPage.jsx` usando as novas classes, removendo todos os `style` inline e aplicando os atributos de acessibilidade.
6. Medir o tempo de resposta com `performance.now()` antes/depois do `fetch` e guardar `lastCheck` com `new Date()`.
7. Adicionar o `setInterval(refresh, 30000)` com cleanup no `useEffect`.
8. Validar manualmente: tema claro e escuro, API online, API offline (parar o backend), e larguras 320/480/640px.

## Estimativa
**Complexidade:** Média
**Tipo:** feat (refinamento de UI/UX)
