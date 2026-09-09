# 001 - feat - Criar página /versao com UI/UX refinada

## Descrição

Hoje a única forma de consultar o status da API pelo frontend é o botão de bolinha colorida no `Header` (`client/src/components/VersionInfo.jsx`), que abre um tooltip pequeno com versão, status, ambiente, URL da API e configuração de cache. Não existe uma página dedicada: `client/src/App.jsx` registra apenas as rotas `/` e `/about`, e o `Footer.jsx` só tem o link "Sobre a BIA".

Esta tarefa cria a página `/versao` **do zero**, já no padrão de qualidade correto: CSS próprio no `client/src/index.css`, uso exclusivo das variáveis de tema, estados visuais de carregamento e erro, acessibilidade e responsividade. Não é um refinamento posterior — criação e refinamento são a mesma entrega.

O ponto de atenção principal é **não repetir o atalho** de reaproveitar as classes da página About (`.about-page`, `.about-hero`, `.about-footer`) com estilos inline e cores hardcoded por cima. A página precisa nascer com classes semânticas próprias e sem nenhum `style={{ ... }}` inline.

## Objetivo

Entregar uma página `/versao` acessível pelo rodapé que mostre, de forma clara e visualmente consistente com o tema da aplicação, o status da API, a versão retornada por `GET /api/versao`, o ambiente detectado e a configuração de cache — com estados visuais adequados, atualização manual e automática, e suporte pleno a tema claro/escuro e telas estreitas.

## Critérios de Aceite

### Roteamento e navegação
- [ ] Criado o componente `client/src/components/VersionPage.jsx`
- [ ] Rota `/versao` registrada em `client/src/App.jsx` dentro do `<Routes>` existente, ao lado de `/` e `/about`
- [ ] `client/src/components/Footer.jsx` ganha um link "Versão da API" apontando para `/versao`, usando a classe `footer-link` já existente (o link "Sobre a BIA" permanece)
- [ ] A página oferece um botão/link "← Voltar" para `/`, reutilizando a classe `.back-button` já existente no CSS

### Conteúdo da página
- [ ] Exibe a versão retornada por `GET /api/versao` (texto simples, ex.: "Bia 4.3.0")
- [ ] Exibe o status da API com os três estados: `checking`, `online` e `offline`
- [ ] Exibe o ambiente detectado a partir de `window.location` (local, IP direto, ALB HTTP, produção HTTPS, outro), com ícone, label e descrição — mesma lógica de classificação já usada em `VersionInfo.jsx`
- [ ] Exibe a URL da API efetivamente utilizada (resultado de `getApiUrl()`)
- [ ] Exibe a configuração de cache quando `GET /api/cache-config` responder com `enabled: true` (endpoint, porta e TTL); quando desabilitado ou indisponível, exibe estado neutro sem quebrar a página
- [ ] Exibe o horário da última verificação bem-sucedida (ex.: "Atualizado às 14:32:10")
- [ ] Exibe o tempo de resposta da chamada a `/api/versao` em milissegundos, medido com `performance.now()`

### Sistema de estilo e tema
- [ ] Nenhum atributo `style={{ ... }}` inline no `VersionPage.jsx` — toda a estilização vem de classes CSS
- [ ] Criado um bloco de CSS dedicado no fim de `client/src/index.css` com classes próprias (ex.: `.version-page`, `.version-hero`, `.version-grid`, `.version-card`, `.version-status`, `.version-actions`)
- [ ] A página **não** reutiliza `.about-page` / `.about-hero` / `.about-content` / `.about-footer`; pode espelhar o padrão visual dessas classes, mas com nomes semânticos próprios (exceção permitida: `.back-button` e `.footer-link`, que são componentes genéricos)
- [ ] Nenhuma cor hexadecimal hardcoded no JSX ou nas novas regras CSS: usar `--accent-primary`, `--accent-success`, `--accent-danger`, `--text-secondary`, `--bg-card`, `--bg-secondary`, `--border-color`, `--shadow`
- [ ] Criada a variável de tema `--accent-warning` declarada em `:root` (`#f59e0b`) **e** em `[data-theme="dark"]` (`#fbbf24`) no `client/src/index.css` — hoje não existe variável de aviso, e o estado `checking` e o ambiente "IP Direto" precisam dela
- [ ] A página é validada nos dois temas (claro e escuro), via `ThemeContext`, com contraste legível em todos os cards

### Estados visuais
- [ ] Estado `checking` exibe indicador de carregamento visual (skeleton ou pulse via CSS), não apenas texto
- [ ] O indicador de status tem animação sutil de pulse enquanto `apiStatus === 'checking'`
- [ ] Estado `offline` exibe um card de erro com mensagem acionável — incluindo a URL tentada e a sugestão de verificar se a API está no ar — em vez de mensagem genérica
- [ ] O botão "Atualizar" mantém dimensões estáveis entre estados (sem "pulo" de layout quando o texto vira "Verificando...")

### Interação
- [ ] Botão "Atualizar" que dispara nova verificação e fica `disabled` durante o estado `checking`
- [ ] Ação para abrir `GET /api/versao` em nova aba, equivalente ao `openVersionEndpoint` já existente no `VersionInfo.jsx`
- [ ] Re-checagem automática a cada 30s com `clearInterval` no cleanup do `useEffect` — mesmo intervalo já usado pelo `VersionInfo.jsx`
- [ ] A chamada a `/api/versao` usa `AbortController` com timeout de 5s, como já feito em `VersionInfo.jsx`

### Acessibilidade e responsividade
- [ ] O bloco de status usa `role="status"` e `aria-live="polite"` para anunciar mudanças de estado
- [ ] Ícones emoji decorativos usam `aria-hidden="true"`, com o significado disponível em texto
- [ ] O botão "Atualizar" tem `aria-label` descritivo e estado `disabled` visualmente evidente
- [ ] `document.title` é atualizado para "Versão da API - BIA" ao entrar na página
- [ ] Layout validado em 320px, 480px e 640px, respeitando os breakpoints existentes (`@media (max-width: 640px)` e `@media (max-width: 480px)`) e o `max-width: 480px` do `.container`
- [ ] A área de ações (Voltar + Atualizar + abrir endpoint) quebra corretamente em telas estreitas, sem overflow horizontal

### Manutenção (desejável, sem quebrar comportamento)
- [ ] A lógica compartilhada com `VersionInfo.jsx` (`getApiUrl`, `checkApiHealth`, `getEnvironmentInfo`, `getStatusIcon`, `getStatusText`) é extraída para um hook `client/src/hooks/useApiStatus.js` em vez de duplicada
- [ ] Após a extração, `VersionInfo.jsx` continua funcionando exatamente como hoje (tooltip no Header, mesma aparência e comportamento)

## Contexto Técnico

### Stack
- **Frontend:** React 17 com Vite
- **Roteamento:** React Router DOM (`BrowserRouter`), rotas atuais em `client/src/App.jsx`: `/` e `/about`
- **Estilo:** CSS único em `client/src/index.css`, com variáveis de tema em `:root` e `[data-theme="dark"]`
- **Tema:** `client/src/contexts/ThemeContext.jsx`

### Arquivos Relevantes
- `client/src/components/VersionPage.jsx` — **a criar** (alvo principal)
- `client/src/index.css` — onde entram as novas classes e a variável `--accent-warning`
- `client/src/App.jsx` — registrar a rota `/versao`
- `client/src/components/Footer.jsx` — adicionar o link "Versão da API"
- `client/src/components/VersionInfo.jsx` — fonte da lógica de status/ambiente a ser reaproveitada via hook
- `client/src/components/About.jsx` — referência de estrutura de página (conteúdo + rodapé com `.back-button`)
- `client/src/hooks/useApiStatus.js` — **a criar** (opcional, item de manutenção)
- `api/routes/versao.js` / `api/controllers/versao.js` — backend (não alterar)
- `api/routes/cache-config.js` / `api/controllers/cache-config.js` — backend (não alterar)

### Variáveis de tema disponíveis hoje
```
--bg-primary  --bg-secondary  --bg-card
--text-primary  --text-secondary  --border-color
--accent-primary  --accent-success  --accent-danger
--shadow
```
Não existe variável de aviso/warning — daí a necessidade de criar `--accent-warning`.

### Resolução da URL da API (comportamento a preservar)
1. `import.meta.env.VITE_API_URL`, se definido
2. `window.location.origin`, se a porta for `8080`
3. `http://localhost:8080` como fallback de desenvolvimento

### Contratos de API (inalterados)
```
GET /api/versao        → "Bia 4.3.0"  (texto simples)
GET /api/cache-config  → { enabled: bool, endpoint: string, port: number, ttl: number }
```

## O que NÃO fazer
- ❌ Não alterar os endpoints `GET /api/versao` e `GET /api/cache-config` do backend
- ❌ Não remover nem alterar o `VersionInfo` do `Header.jsx` (a página é complementar ao tooltip, não substituta)
- ❌ Não remover o link "Sobre a BIA" do `Footer.jsx`
- ❌ Não usar estilos inline nem cores hexadecimais no JSX
- ❌ Não introduzir bibliotecas de UI/CSS-in-JS (Tailwind, styled-components, MUI) — manter CSS puro com variáveis
- ❌ Não trocar a versão do React nem do React Router
- ❌ Não redesenhar as páginas Home e About; o escopo é apenas `/versao`
- ❌ Não alterar `Dockerfile`, `buildspec.yml` ou qualquer configuração de infraestrutura

## Sugestão de Implementação

1. Criar `client/src/hooks/useApiStatus.js` com `getApiUrl`, `checkApiHealth` (com `AbortController` + `performance.now()`), `getEnvironmentInfo`, `getStatusIcon` e `getStatusText`; expor `{ apiStatus, apiVersion, cacheConfig, env, lastCheck, responseTime, apiUrl, refresh }`.
2. Refatorar `VersionInfo.jsx` para consumir o hook, mantendo comportamento idêntico ao atual.
3. Adicionar `--accent-warning` em `:root` (`#f59e0b`) e em `[data-theme="dark"]` (`#fbbf24`) no topo de `client/src/index.css`.
4. Criar o bloco `/* Página /versao */` no fim de `client/src/index.css` com `.version-page`, `.version-hero`, `.version-grid`, `.version-card`, `.version-status`, `.version-status--online|--offline|--checking`, `.version-skeleton`, `.version-actions` e o keyframe de pulse.
5. Criar `VersionPage.jsx` consumindo o hook, montando hero + grid de cards (Status, Versão, Ambiente, API URL, Cache) + rodapé de ações, com os atributos de acessibilidade.
6. Registrar a rota `/versao` em `App.jsx` e adicionar o link no `Footer.jsx`.
7. Atualizar `document.title` em um `useEffect` da página.
8. Adicionar o `setInterval(refresh, 30000)` com cleanup no `useEffect`.
9. Validar manualmente: tema claro e escuro, API online, API offline (parar o backend), cache habilitado e desabilitado, e larguras 320/480/640px.

## Estimativa
**Complexidade:** Média
**Tipo:** feat (nova página com UI/UX refinada)

---
