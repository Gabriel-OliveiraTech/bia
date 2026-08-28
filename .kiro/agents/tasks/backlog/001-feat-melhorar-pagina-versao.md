# 001 - feat - Melhorar página /versao

## Descrição

A rota `/api/versao` atualmente retorna apenas texto simples (ex: `Bia 4.2.0`). O objetivo desta tarefa é criar uma **página visual dedicada** na rota `/versao` do frontend, que consuma essa API e exiba as informações de versão com o mesmo padrão de design da aplicação.

## Objetivo

Melhorar a experiência visual da rota `/versao` substituindo a resposta de texto puro por uma interface gráfica consistente com o restante da aplicação BIA.

## Critérios de Aceite

- [ ] Existe uma rota `/versao` no frontend (React Router) que renderiza a nova página
- [ ] A página consome o endpoint `GET /api/versao` e exibe a versão retornada
- [ ] A página utiliza as variáveis CSS existentes (`--bg-primary`, `--text-primary`, `--accent-primary`, etc.)
- [ ] A página respeita o tema claro/escuro da aplicação (ThemeContext)
- [ ] O layout segue o mesmo padrão visual das páginas `About` e `Home` (`.container`, `.header`, `.footer`)
- [ ] Exibe o status da API (online/offline/verificando) com indicador visual
- [ ] Exibe informações do ambiente (local, IP direto, ALB, produção)
- [ ] Exibe informações de cache (se disponível via `/api/cache-config`)
- [ ] Possui botão "Atualizar" para re-checar o status da API
- [ ] Possui botão "← Voltar" para retornar à página principal
- [ ] O link para `/versao` deve estar acessível a partir do Header ou Footer
- [ ] A página é responsiva e funciona corretamente em mobile

## Contexto Técnico

### Stack
- **Frontend:** React 17 com Vite
- **Roteamento:** React Router DOM (`BrowserRouter`)
- **Estilo:** CSS com variáveis de tema em `client/src/index.css`
- **Tema:** Controlado pelo `ThemeContext` em `client/src/contexts/ThemeContext.jsx`

### Arquivos Relevantes
- `client/src/App.jsx` — configuração de rotas
- `client/src/components/About.jsx` — referência de estrutura de página
- `client/src/components/VersionInfo.jsx` — lógica de consulta à API já implementada, pode ser reutilizada
- `client/src/components/Header.jsx` — para adicionar link de navegação
- `client/src/components/Footer.jsx` — alternativa para link de navegação
- `client/src/index.css` — classes e variáveis CSS existentes
- `api/controllers/versao.js` — controller backend (`GET /api/versao`)
- `api/routes/versao.js` — rota backend

### Padrão de Resposta da API
```
GET /api/versao
→ "Bia 4.3.0"  (texto simples)

GET /api/cache-config
→ { enabled: bool, endpoint: string, port: number, ttl: number }
```

### Componente VersionInfo Existente
O componente `VersionInfo.jsx` já possui toda a lógica de:
- Checagem de status da API
- Detecção de ambiente (local, IP, ALB, produção)
- Exibição de informações de cache

Essa lógica **deve ser aproveitada** para construir a nova página, seja por reuso direto ou extração de lógica compartilhada.

## O que NÃO fazer
- ❌ Não alterar o endpoint `GET /api/versao` do backend
- ❌ Não remover o componente `VersionInfo` do Header
- ❌ Não criar estilos novos que conflitem com as variáveis CSS existentes
- ❌ Não usar multi-stage builds ou otimizações de Dockerfile

## Sugestão de Implementação

1. Criar componente `client/src/components/VersionPage.jsx`
2. Reutilizar a lógica de `VersionInfo.jsx` para buscar dados da API
3. Estruturar o layout seguindo o padrão de `About.jsx`:
   - Hero card com gradiente (igual ao `about-hero`)
   - Cards de informação usando `.feature-card`
   - Botão "← Voltar" usando `.back-button`
4. Adicionar rota `/versao` em `App.jsx`
5. Adicionar link de acesso no `Footer.jsx` ou `Header.jsx`

## Estimativa
**Complexidade:** Baixa  
**Tipo:** feat (melhoria de UX/UI)
