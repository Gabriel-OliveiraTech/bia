# 002 - test - Validar responsividade do VersionInfo.jsx

## Contexto

Na tarefa 001 (melhoria visual da rota `/versao` e do componente `VersionInfo.jsx`), o
agente `qa` não conseguiu redimensionar a janela no ambiente de teste (`resize_window`
não foi aplicado), então os breakpoints 320px, 480px e 640px do card/tooltip de versão
seguem sem verificação visual.

## Objetivo

Validar que o componente `client/src/components/VersionInfo.jsx` permanece legível e
utilizável nos breakpoints abaixo, sem quebra de layout, texto cortado ou sobreposição
de elementos:

- 320px (mobile pequeno)
- 480px (mobile)
- 640px (tablet pequeno)

## Escopo sugerido

- Redimensionar a janela do navegador (ou usar modo de dispositivo) nos três breakpoints
  acima e capturar evidência visual (screenshot).
- Caso algum problema de layout seja identificado, registrar como nova tarefa de correção
  (não corrigir dentro desta tarefa de validação).

## Critérios de aceite

1. Evidência visual (screenshot) do componente nos três breakpoints listados.
2. Nenhuma quebra de layout, sobreposição ou corte de texto relatado nos três breakpoints,
   ou problemas encontrados documentados e reportados como nova tarefa.

## Fora de escopo

- Correção de eventuais problemas de responsividade encontrados (deve virar nova tarefa
  de tipo `fix`).

## Observação

Esta especificação não deve ser implementada pelo agente de PO. A validação cabe ao
agente `qa`.
