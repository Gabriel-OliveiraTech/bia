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
