# 001 - feat - Melhorar interface gráfica da rota /versao

## Contexto

Atualmente o endpoint `GET /api/versao` (implementado em `api/controllers/versao.js`)
retorna apenas um texto simples no formato `Bia {versao}` (ex: `Bia 4.3.0`), sem
nenhuma formatação visual.

No frontend, o componente `client/src/components/VersionInfo.jsx` já consome esse
endpoint e exibe a versão em um tooltip simples (botão flutuante com status da API,
ambiente detectado e versão), mas a apresentação visual pode ser melhorada para ficar
mais clara e agradável para quem está usando/aprendendo com o projeto BIA.

## Objetivo

Melhorar a interface gráfica relacionada à exibição da versão da aplicação (rota
`/api/versao` e/ou o componente `VersionInfo.jsx` que a consome no frontend), tornando
a apresentação da informação mais visual e agradável, sem perder a simplicidade do
projeto (público-alvo são alunos em aprendizado).

## Escopo sugerido

- Avaliar se a resposta de `/api/versao` deve continuar em texto plano (para manter
  compatibilidade com health checks e demais consumidores) ou se deve ganhar uma
  versão HTML própria apenas quando acessada diretamente pelo navegador.
- Melhorar visualmente o tooltip/card exibido pelo `VersionInfo.jsx` no frontend
  (tipografia, espaçamento, cores, ícones), mantendo as informações já existentes:
    - Versão da API
    - Status da API (online/offline/verificando)
    - Ambiente detectado (local, IP, ALB, produção)
    - Link para abrir o endpoint `/api/versao`
    - Botão de atualizar/recheck
- Manter a simplicidade: nada de bibliotecas novas de UI pesadas, componentes
  complexos ou dependências adicionais desnecessárias.

## Critérios de aceite

1. A rota `/api/versao` continua funcionando corretamente e retornando a versão
   (não pode quebrar health checks existentes).
2. A exibição da versão no frontend (`VersionInfo.jsx`) fica visualmente mais clara
   e organizada, mantendo todas as informações atualmente exibidas.
3. Nenhuma dependência nova pesada é adicionada ao projeto sem necessidade.
4. Testes existentes relacionados à rota de versão (`tests/unit/controllers/versao.test.js`)
   continuam passando.

## Fora de escopo

- Alterações de infraestrutura, pipeline ou Dockerfile.
- Criação de novas rotas de negócio não relacionadas à versão da aplicação.

## Observação

Esta especificação não deve ser implementada pelo agente de PO. A implementação
cabe ao agente `dev`, com validação do agente `qa` e suporte do agente `devops`
quando necessário.

## Aceite (PO)

**Veredito:** Aceito com ressalvas.

**Critério 1 — PASSA.** `/api/versao` mantém texto plano `Bia {versao}` por padrão; HTML
só é servido quando o header `Accept` contém `text/html`. Validado no controller (5
cenários de `Accept`, incluindo ausência do header) e end-to-end via `docker compose`,
incluindo simulação de health check do ALB. Consumidores não-navegador não são afetados.

**Critério 2 — PASSA.** `VersionInfo.jsx` reestruturado como card, mantendo todas as
informações anteriores (versão, status, ambiente, link, botão de recheck). `diff` contra
a versão anterior confirma que nenhuma informação foi removida. Validado visualmente em
tema claro, escuro e estado offline.

**Critério 3 — PASSA.** Nenhuma dependência nova adicionada (`package.json` inalterado).

**Critério 4 — PASSA.** `npx jest tests/unit` → 2 suites / 16 testes passando, confirmado
de forma independente pelo PO.

**Ressalvas registradas como itens de backlog:**
- Responsividade dos breakpoints 320/480/640px não foi validada pelo QA (limitação do
  ambiente de teste, não do código) — ver `002-test-validar-responsividade-versioninfo.md`.
- Fallback de versão no controller segue como literal hardcoded (`"4.3.0"`) em vez de ler
  de `package.json` — ver `003-feat-versao-fallback-dinamico.md`.

**Aceito por:** PO (Product Owner), 2026-09-10.
