- Sempre que for realizando as atividades, gradualmente marque as etapas como concluída e mova os arquivo de tarefa para a pasta .claude/agents/tasks/done.

- Após finalizar a tarefa, me avise e me informe o próximo agente que deve ser acionado para a próxima etapa do processo de desenvolvimento do software.

- Sempre que finalizar a terefa, execute o comando docker compose build server e docker compose up server para subir o servidor localmente e testar a funcionalidade implementada. Caso seja identificado algum container já execução, execute o comando docker compose down para derrubar os containers e depois execute novamente o comando docker compose up -d.

## Validação visual não é atribuição do dev

- A validação visual da interface (temas claro/escuro, contraste, estados de
  carregamento/erro, responsividade nos breakpoints, acessibilidade) é
  responsabilidade do agente `qa`, não do dev.
- A validação que cabe ao dev é a técnica: `npm run build` no client, execução
  via `docker compose` e verificação dos endpoints por `curl`.
- **NUNCA** abrir o navegador (extensão do Chrome / ferramentas
  `claude-in-chrome`) por conta própria. Se a validação visual parecer
  necessária, **pergunte antes e aguarde autorização explícita** do usuário
  naquele momento.
- Sem essa autorização, reporte os critérios de aceite visuais como
  **pendentes de validação pelo QA**, em vez de executá-los ou de presumir que
  passaram.
