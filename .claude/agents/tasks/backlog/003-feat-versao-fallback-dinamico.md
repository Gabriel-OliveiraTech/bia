# 003 - feat - Tornar dinâmico o fallback de versão em versao.js

## Contexto

Em `api/controllers/versao.js`, quando a variável de ambiente `VERSAO_API` não está
definida, o controller usa um valor literal hardcoded como fallback (ex: `"4.3.0"`).
Esse literal precisa ser atualizado manualmente a cada bump de versão do projeto,
podendo ficar desatualizado (foi exatamente esse hardcode desatualizado que causou uma
falha de teste antes da tarefa 001).

## Objetivo

Fazer o fallback de versão do controller ler dinamicamente o campo `version` do
`package.json` da raiz do projeto, em vez de manter um literal fixo no código.

## Escopo sugerido

- Em `api/controllers/versao.js`, substituir o literal fixo por
  `require("../../package.json").version` (ou caminho equivalente correto a partir do
  arquivo do controller).
- Garantir que o comportamento quando `VERSAO_API` está definida não muda (ela continua
  tendo prioridade sobre o valor do `package.json`).

## Critérios de aceite

1. Quando `VERSAO_API` não está definida, a rota `/api/versao` retorna a versão presente
   em `package.json`, sem literal hardcoded no controller.
2. Quando `VERSAO_API` está definida, o comportamento permanece o mesmo de hoje (variável
   de ambiente tem prioridade).
3. Testes existentes em `tests/unit/controllers/versao.test.js` continuam passando (e,
   se necessário, são ajustados para refletir a leitura dinâmica).
4. Nenhuma dependência nova é adicionada.

## Fora de escopo

- Qualquer outra alteração de interface ou comportamento da rota `/api/versao` não
  relacionada ao fallback de versão.

## Observação

Esta especificação não deve ser implementada pelo agente de PO. A implementação cabe ao
agente `dev`, com validação do agente `qa`.
