# 001 - feat - Criar página /versao com UI/UX refinada

## Descrição

Hoje a única forma de consultar o status da API pelo frontend é o botão de bolinha colorida no `Header` (`client/src/components/VersionInfo.jsx`), que abre um tooltip pequeno com versão, status, ambiente, URL da API e configuração de cache. Não existe uma página dedicada: `client/src/App.jsx` registra apenas as rotas `/` e `/about`, e o `Footer.jsx` só tem o link "Sobre a BIA".

Esta tarefa cria a página `/versao` **do zero**, já no padrão de qualidade correto: CSS próprio no `client/src/index.css`, uso exclusivo das variáveis de tema, estados visuais de carregamento e erro, acessibilidade e responsividade. Não é um refinamento posterior — criação e refinamento são a mesma entrega.

O ponto de atenção principal é **não repetir o atalho** de reaproveitar as classes da página About (`.about-page`, `.about-hero`, `.about-footer`) com estilos inline e cores hardcoded por cima. A página precisa nascer com classes semânticas próprias e sem nenhum `style={{ ... }}` inline.

## Objetivo

Entregar uma página `/versao` acessível pelo rodapé que mostre, de forma clara e visualmente consistente com o tema da aplicação, o status da API, a versão retornada por `GET /api/versao`, o ambiente detectado e a configuração de cache — com estados visuais adequados, atualização manual e automática, e suporte pleno a tema claro/escuro e telas estreitas.

## Critérios de Aceite

### Roteamento e navegação
- [x] Criado o componente `client/src/components/VersionPage.jsx`
- [x] Rota `/versao` registrada em `client/src/App.jsx` dentro do `<Routes>` existente, ao lado de `/` e `/about`
- [x] `client/src/components/Footer.jsx` ganha um link "Versão da API" apontando para `/versao`, usando a classe `footer-link` já existente (o link "Sobre a BIA" permanece)
- [x] A página oferece um botão/link "← Voltar" para `/`, reutilizando a classe `.back-button` já existente no CSS

### Conteúdo da página
- [x] Exibe a versão retornada por `GET /api/versao` (texto simples, ex.: "Bia 4.3.0")
- [x] Exibe o status da API com os três estados: `checking`, `online` e `offline`
- [x] Exibe o ambiente detectado a partir de `window.location` (local, IP direto, ALB HTTP, produção HTTPS, outro), com ícone, label e descrição — mesma lógica de classificação já usada em `VersionInfo.jsx`
- [x] Exibe a URL da API efetivamente utilizada (resultado de `getApiUrl()`)
- [x] Exibe a configuração de cache quando `GET /api/cache-config` responder com `enabled: true` (endpoint, porta e TTL); quando desabilitado ou indisponível, exibe estado neutro sem quebrar a página
- [x] Exibe o horário da última verificação bem-sucedida (ex.: "Atualizado às 14:32:10")
- [x] Exibe o tempo de resposta da chamada a `/api/versao` em milissegundos, medido com `performance.now()`

### Sistema de estilo e tema
- [x] Nenhum atributo `style={{ ... }}` inline no `VersionPage.jsx` — toda a estilização vem de classes CSS
- [x] Criado um bloco de CSS dedicado no fim de `client/src/index.css` com classes próprias (ex.: `.version-page`, `.version-hero`, `.version-grid`, `.version-card`, `.version-status`, `.version-actions`)
- [x] A página **não** reutiliza `.about-page` / `.about-hero` / `.about-content` / `.about-footer`; pode espelhar o padrão visual dessas classes, mas com nomes semânticos próprios (exceção permitida: `.back-button` e `.footer-link`, que são componentes genéricos)
- [x] Nenhuma cor hexadecimal hardcoded no JSX ou nas novas regras CSS: usar `--accent-primary`, `--accent-success`, `--accent-danger`, `--text-secondary`, `--bg-card`, `--bg-secondary`, `--border-color`, `--shadow`
- [x] Criada a variável de tema `--accent-warning` declarada em `:root` (`#f59e0b`) **e** em `[data-theme="dark"]` (`#fbbf24`) no `client/src/index.css` — hoje não existe variável de aviso, e o estado `checking` e o ambiente "IP Direto" precisam dela
- [x] A página é validada nos dois temas (claro e escuro), via `ThemeContext`, com contraste legível em todos os cards

### Estados visuais
- [x] Estado `checking` exibe indicador de carregamento visual (skeleton ou pulse via CSS), não apenas texto
- [x] O indicador de status tem animação sutil de pulse enquanto `apiStatus === 'checking'`
- [x] Estado `offline` exibe um card de erro com mensagem acionável — incluindo a URL tentada e a sugestão de verificar se a API está no ar — em vez de mensagem genérica
- [x] O botão "Atualizar" mantém dimensões estáveis entre estados (sem "pulo" de layout quando o texto vira "Verificando...")

### Interação
- [x] Botão "Atualizar" que dispara nova verificação e fica `disabled` durante o estado `checking`
- [x] Ação para abrir `GET /api/versao` em nova aba, equivalente ao `openVersionEndpoint` já existente no `VersionInfo.jsx`
- [x] Re-checagem automática a cada 30s com `clearInterval` no cleanup do `useEffect` — mesmo intervalo já usado pelo `VersionInfo.jsx`
- [x] A chamada a `/api/versao` usa `AbortController` com timeout de 5s, como já feito em `VersionInfo.jsx`

### Acessibilidade e responsividade
- [x] O bloco de status usa `role="status"` e `aria-live="polite"` para anunciar mudanças de estado
- [x] Ícones emoji decorativos usam `aria-hidden="true"`, com o significado disponível em texto
- [x] O botão "Atualizar" tem `aria-label` descritivo e estado `disabled` visualmente evidente
- [x] `document.title` é atualizado para "Versão da API - BIA" ao entrar na página
- [x] Layout validado em 320px, 480px e 640px, respeitando os breakpoints existentes (`@media (max-width: 640px)` e `@media (max-width: 480px)`) e o `max-width: 480px` do `.container`
- [x] A área de ações (Voltar + Atualizar + abrir endpoint) quebra corretamente em telas estreitas, sem overflow horizontal

### Manutenção (desejável, sem quebrar comportamento)
- [x] A lógica compartilhada com `VersionInfo.jsx` (`getApiUrl`, `checkApiHealth`, `getEnvironmentInfo`, `getStatusIcon`, `getStatusText`) é extraída para um hook `client/src/hooks/useApiStatus.js` em vez de duplicada
- [x] Após a extração, `VersionInfo.jsx` continua funcionando exatamente como hoje (tooltip no Header, mesma aparência e comportamento)

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

## Aceite do PO

**Data:** 2026-09-09
**Status:** ACEITA — todos os 33 critérios de aceite atendidos
**Branch:** `feature/001-feat-criar-pagina-versao`

### Commits da entrega
- `541eb5b` — feat: criar página /versao com UI/UX refinada (VersionPage.jsx, hook useApiStatus.js, bloco CSS dedicado, variável `--accent-warning`, rota em App.jsx, link no Footer.jsx, VersionInfo.jsx refatorado para consumir o hook)
- `0b953b8` — fix(versao): estabiliza largura do rótulo do botão Atualizar (`min-width: 8.5ch` → `width: 10.5ch`), corrigindo o defeito D-1 apontado pelo QA

### Verificação do PO
Conferência independente do código-fonte, além do relato do QA:
- Rota `/versao` registrada em `App.jsx` ao lado de `/` e `/about`; link "Versão da API" no `Footer.jsx` com `footer-link`, preservando "Sobre a BIA"; botão "← Voltar" reutilizando `.back-button`.
- `VersionPage.jsx` sem nenhum `style={{ ... }}` inline e sem cor hexadecimal no JSX; nenhuma reutilização das classes `.about-*`.
- Bloco CSS `/versao` (index.css, linhas ~928–1230) sem hexadecimal hardcoded — apenas variáveis de tema; `--accent-warning` declarada em `:root` (`#f59e0b`) e em `[data-theme="dark"]` (`#fbbf24`).
- Hook `useApiStatus.js` com `AbortController` + timeout de 5s, medição via `performance.now()`, `setInterval` de 30s com `clearInterval` no cleanup.
- Acessibilidade: `role="status"` + `aria-live="polite"` no bloco de status, `role="alert"` no card de erro, `aria-hidden="true"` nos emojis, `aria-label` nos botões, `document.title` atualizado.
- `.version-actions` com `flex-wrap: wrap` e breakpoints de 640px e 480px presentes.
- Refatoração do `VersionInfo.jsx` conferida linha a linha: extração 1:1, saída renderizada e comportamento do tooltip do Header inalterados.
- `npm run build` no `client/` concluído sem erros nem warnings.
- Validações visuais (temas claro/escuro, 320/480/640px, delta zero do botão em 8 viewports) conforme relatório do QA.

### Observações do QA em aberto (não bloqueiam o aceite)
Itens fora do escopo desta task, candidatos a backlog futuro:
1. **Fallback de fonte:** a folga do botão "Atualizar" cai para 0,81px se a fonte Inter não carregar. Sugestão do QA: `min-width: 10.5ch` + `white-space: nowrap`. — *Recomendado virar task de fix.*
2. **Pollers duplicados:** duas instâncias independentes do `useApiStatus` (Header e página) geram dois ciclos de 30s e podem divergir de estado. — *Recomendado virar task de refactor (estado compartilhado via contexto).*
3. **Skeleton piscando:** o skeleton reaparece a cada recheck automático de 30s; ideal distinguir carga inicial de revalidação. — *Recomendado virar task de melhoria de UX.*
4. **Deslocamento vertical de 2,5px** no refresh, causado pela diferença de altura entre os emojis 🟢 (20px) e 🟡 (17,78px). Pré-existente, não é regressão desta entrega.
5. **2 testes falhando** em `tests/unit/controllers/versao.test.js` (teste espera `Bia 4.3.0`, controller devolve `4.2.0`). Pré-existentes e fora do escopo — a task tocou apenas `client/`. — *Recomendado virar task de fix no backend.*

### Pendências
- Abertura do Pull Request para a branch principal permanece **pendente de decisão do usuário**.
