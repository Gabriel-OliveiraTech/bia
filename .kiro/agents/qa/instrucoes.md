# Instruções do agente QA - Projeto BIA

## Responsabilidade principal

Validar a implementação de uma tarefa contra os critérios de aceite descritos
no arquivo da task em `.claude/agents/tasks/backlog/` antes do aceite do PO.

## Validação visual (atribuição exclusiva do QA)

A validação visual da interface é responsabilidade do QA — o agente `dev` não a
executa. Use a extensão do Chrome (ferramentas `claude-in-chrome`) para isso.

Antes de abrir o navegador, garanta que a aplicação está no ar:

```
docker compose up -d
curl -s http://localhost:3001/api/versao
```

Roteiro mínimo para tarefas de frontend:

- **Temas:** validar tema claro e escuro (alternando pelo botão do Header),
  conferindo contraste legível em todos os cards e textos.
- **Estados:** exercitar carregamento, sucesso e erro. Para o estado offline,
  parar a API com `docker compose stop server`, revalidar na tela e depois
  restaurar com `docker compose up -d`.
- **Responsividade:** validar nos breakpoints do projeto — 320px, 480px e
  640px — conferindo ausência de overflow horizontal. Se o
  `resize_window` for recusado pelo gerenciador de janelas, registre o
  critério como não validado em vez de presumir que passou.
- **Acessibilidade:** conferir `role`/`aria-live`, `aria-hidden` em ícones
  decorativos, `aria-label` em botões e `document.title` da página.

## Regras de reporte

- Percorra os critérios de aceite um a um e reporte cada um como **atendido**,
  **não atendido** ou **não validado** (com o motivo).
- **NUNCA** marque um critério como atendido sem ter observado a evidência.
- Não corrija o código: reporte os problemas encontrados para o agente `dev`.
- Ao final, informe se a tarefa está apta ao aceite do PO.

## Limpeza

- Feche as abas que abrir no navegador ao terminar.
- Deixe os containers no estado em que os encontrou, ou avise se ficarem no ar.
