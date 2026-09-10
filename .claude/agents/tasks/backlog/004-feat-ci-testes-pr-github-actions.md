# 004 - feat - Workflow de GitHub Actions para rodar testes em Pull Request

## Contexto

O projeto possui testes unitários com Jest em `tests/unit/controllers/versao.test.js` e
`tests/unit/controllers/tarefas.test.js`, executados pelo script `"test": "jest tests/unit"`
definido em `package.json`. Hoje não existe nenhum workflow em `.github/workflows/` — este
será o primeiro workflow de GitHub Actions do repositório.

## Fronteira importante: isto NÃO é o "pipeline" do projeto

A rule `.kiro/agents/rules/pipeline.md` define "pipeline", neste projeto, como a combinação de
**AWS CodePipeline + AWS CodeBuild** (Source no GitHub, Build/Deploy via CodeBuild para ECS,
conforme `buildspec.yml`). O workflow de GitHub Actions desta tarefa **não substitui, não
integra e não altera** esse pipeline. Ele é um **gate de testes em Pull Request**, complementar,
que roda inteiramente dentro do GitHub Actions e não interage com ECR/ECS/CodeBuild.

- O `buildspec.yml` atual não tem etapa de testes — isso permanece assim; não é objetivo desta
  tarefa alterar o `buildspec.yml` nem o pipeline de deploy.
- Nenhuma credencial AWS deve ser usada ou referenciada neste workflow.

## Objetivo

Criar um workflow de GitHub Actions que rode os testes automatizados (Jest) toda vez que uma
Pull Request for aberta ou atualizada, servindo como gate de qualidade antes do merge.

## Escopo sugerido

- Novo arquivo em `.github/workflows/` (ex: `.github/workflows/pr-tests.yml`).
- Trigger: evento `pull_request`, com a branch base `ia-main` (branch principal do projeto —
  nunca `main`), acionando tanto na abertura da PR quanto em novos commits/pushes na mesma PR
  (tipos padrão do evento `pull_request`: `opened`, `synchronize`, `reopened`).
- Etapas do job:
  1. Checkout do código (`actions/checkout`).
  2. Setup do Node.js (`actions/setup-node`) na versão **24.x** — decisão explícita desta spec,
     pois `package.json` não declara `engines`. Versão 24.x escolhida por ser a mesma usada na
     EC2 de desenvolvimento (`bia-dev`), conforme `.kiro/agents/rules/infraestrutura.md`, para
     manter consistência entre ambiente de dev e CI.
  3. Instalação de dependências: `npm ci` (preferencial, por ser determinístico com
     `package-lock.json`; usar `npm install` apenas se `npm ci` não for viável no repositório).
  4. Execução dos testes: `npm test` (que já roda `jest tests/unit`).
- Manter o workflow simples e direto — um único job, sem matriz de versões, sem cache
  avançado além do suporte nativo do `actions/setup-node` (uso de `cache: npm` é aceitável por
  ser simples e nativo da action), sem steps de deploy, build de imagem Docker ou publicação de
  artefatos. Público-alvo são alunos em aprendizado (filosofia de simplicidade do projeto).

## Critérios de aceite

1. Ao abrir uma nova Pull Request contra a branch `ia-main`, o workflow é acionado
   automaticamente e executa `npm test`.
2. Ao enviar novos commits para uma PR já aberta contra `ia-main`, o workflow roda novamente.
3. O job falha (status vermelho no PR) se algum teste Jest falhar; passa (verde) se todos os
   testes passarem.
4. O workflow não faz login em nenhum serviço AWS, não usa segredos/credenciais AWS, e não
   interage com ECR, ECS ou CodeBuild.
5. `buildspec.yml` permanece inalterado.

## Fora de escopo

- Qualquer alteração no `buildspec.yml` ou no pipeline AWS CodePipeline/CodeBuild.
- Deploy, build de imagem Docker, ou publicação de artefatos a partir deste workflow.
- Rodar o workflow em outros eventos além de `pull_request` (ex: `push` direto em branch,
  agendamento via `schedule`).
- Testes de integração com banco de dados real (os testes atuais são unitários).

## Observação

Esta especificação não deve ser implementada pelo agente de PO. A implementação cabe ao agente
`devops`, por se tratar de infraestrutura de CI (GitHub Actions), com validação do agente `qa`.
