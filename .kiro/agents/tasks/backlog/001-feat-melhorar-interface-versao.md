# 001 - feat - Melhorar Interface /versao

## Descrição
A rota `/api/versao` atualmente retorna apenas uma string de texto simples (ex: `Bia 4.3.0`). A interface visual que a consome (`VersionInfo.jsx`) usa um tooltip discreto no header com informações técnicas. O objetivo é melhorar a experiência visual da página/endpoint `/api/versao`, alinhando-a ao design system já utilizado pela aplicação React.

## Problema Atual
- A resposta de `/api/versao` é texto puro, sem formatação ou estrutura visual
- O componente `VersionInfo.jsx` exibe as informações de versão apenas como um tooltip pequeno no cabeçalho
- Não existe uma rota dedicada no frontend React que exiba as informações de versão de forma rica e consistente com o restante da aplicação

## Objetivo
Criar uma **página dedicada de versão** no frontend React (`/versao`) que:
- Utilize os mesmos estilos, variáveis CSS e componentes da aplicação (ex: `index.css`, Header, Footer)
- Suporte os temas **light/dark** já implementados
- Seja responsiva e consistente com a identidade visual da app
- Exiba as informações de versão de forma clara e elegante

## Critérios de Aceite

### Backend
- [ ] A rota `/api/versao` deve retornar JSON estruturado:
  ```json
  {
    "versao": "4.3.0",
    "nome": "Bia",
    "status": "ok"
  }
  ```
- [ ] Manter compatibilidade retroativa (resposta deve funcionar tanto para clientes JSON quanto texto)

### Frontend
- [ ] Criar rota `/versao` no React Router (`App.jsx`)
- [ ] Criar componente `Versao.jsx` em `client/src/components/`
- [ ] O componente deve:
  - Exibir o nome e versão da aplicação em destaque
  - Mostrar o status da API (online/offline) com indicadores visuais
  - Mostrar o ambiente de execução (local, IP direto, ALB, produção)
  - Mostrar informações de cache, quando disponível
  - Ter botão para atualizar/recarregar as informações
  - Usar as variáveis CSS do `index.css` (`--bg-card`, `--text-primary`, `--accent-primary`, etc.)
  - Respeitar o tema light/dark via `data-theme`
  - Incluir link de volta para a página principal (`/`)
- [ ] O visual deve seguir o padrão das demais páginas: cards com bordas, tipografia Inter, bordas arredondadas

### Testes
- [ ] Verificar que a rota `/versao` carrega corretamente
- [ ] Verificar que o tema dark/light é aplicado corretamente
- [ ] Verificar que o status da API é exibido corretamente (online/offline)
- [ ] Verificar que a rota `/api/versao` retorna o JSON esperado

## Referências Técnicas

### Estilos a reutilizar (index.css)
- Classes: `.about-page`, `.feature-card`, `.feature-card.highlight`, `.about-hero`, `.back-button`
- Variáveis: `--bg-card`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--accent-primary`, `--accent-success`, `--accent-danger`, `--border-color`, `--shadow`

### Componentes de referência
- `About.jsx` — estrutura de página com conteúdo + footer com botão voltar
- `VersionInfo.jsx` — lógica de chamada à API, detecção de ambiente e status
- `Header.jsx` + `Footer.jsx` — wrapper padrão das páginas

### Endpoint de referência
- `api/controllers/versao.js` — controller a ser atualizado para retornar JSON
- `api/routes/versao.js` — rota existente GET `/api/versao`

## Arquivos a Modificar / Criar

| Ação | Arquivo |
|------|---------|
| Modificar | `api/controllers/versao.js` |
| Criar | `client/src/components/Versao.jsx` |
| Modificar | `client/src/App.jsx` (adicionar rota `/versao`) |

## Notas
- Não criar novos estilos CSS desnecessários — reutilizar os existentes em `index.css`
- Não usar multi-stage build ou alterar o Dockerfile
- Manter a filosofia de simplicidade do projeto
