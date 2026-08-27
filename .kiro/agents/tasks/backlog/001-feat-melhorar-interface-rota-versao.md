# 001 · feat · Melhorar interface gráfica da rota de versão da API

## Descrição
A rota `/api/versao` atualmente retorna uma string de texto plano (ex: `Bia 4.3.0`).
O objetivo desta tarefa é melhorar a resposta visual dessa rota para que, quando acessada diretamente pelo navegador, exiba uma página HTML estilizada seguindo o mesmo design system da aplicação BIA (fontes, cores, variáveis CSS e tom visual).

## Contexto
- **Rota:** `GET /api/versao`
- **Arquivo do controller:** `api/controllers/versao.js`
- **Arquivo de rota:** `api/routes/versao.js`
- **Design system da app:** `client/src/index.css` (variáveis CSS, fonte Inter, tema light/dark)
- **Componente de referência visual:** `client/src/components/VersionInfo.jsx` (usa as mesmas informações: versão, status, ambiente)

## Critérios de Aceite

### Comportamento esperado
- [ ] Quando o cliente fizer `GET /api/versao` com `Accept: text/html` (acesso via navegador), retornar uma página HTML estilizada
- [ ] Quando o cliente fizer `GET /api/versao` com `Accept: application/json` ou sem header específico (acesso via código/curl), manter o comportamento atual retornando texto simples
- [ ] A página HTML deve detectar automaticamente o tema preferido do sistema operacional (via `prefers-color-scheme`)

### Conteúdo da página HTML
A página deve exibir um card centralizado com:
- [ ] Nome e versão da aplicação (ex: `Bia 4.3.0`)
- [ ] Identificação do ambiente/instância: hostname do servidor (`os.hostname()`) e variável `NODE_ENV`
- [ ] Data e hora UTC atual da resposta
- [ ] Indicador visual de status "online" (verde)
- [ ] Link/botão para voltar à aplicação principal (`/`)
- [ ] Créditos ou rodapé com o nome do projeto

### Design e estilo
- [ ] Usar a mesma fonte: **Inter** (Google Fonts)
- [ ] Respeitar as variáveis de cores do design system:
  - Background: `#ffffff` (light) / `#111827` (dark)
  - Texto primário: `#1f2937` (light) / `#f9fafb` (dark)
  - Accent (azul): `#3b82f6` (light) / `#60a5fa` (dark)
  - Sucesso (verde): `#10b981` (light) / `#34d399` (dark)
  - Border: `#e5e7eb` (light) / `#374151` (dark)
- [ ] Card centralizado com `border-radius: 8px`, `box-shadow` e `border`
- [ ] Layout responsivo, funcional em mobile e desktop
- [ ] Sem dependências externas de JS além do HTML inline mínimo necessário

## Detalhes de Implementação

### Detecção de `Accept` header
```javascript
// No controller, verificar se o cliente quer HTML
const acceptsHtml = req.headers['accept'] && req.headers['accept'].includes('text/html');

if (acceptsHtml) {
  res.setHeader('Content-Type', 'text/html');
  res.send(/* template HTML */);
} else {
  res.send(`Bia ${process.env.VERSAO_API || "4.3.0"}`);
}
```

### Informações a exibir (Node.js)
```javascript
const os = require('os');
const version = process.env.VERSAO_API || "4.3.0";
const hostname = os.hostname();
const env = process.env.NODE_ENV || 'development';
const timestamp = new Date().toISOString();
```

## O que NÃO fazer
- ❌ Não criar arquivos de template separados — o HTML deve ser inline no controller
- ❌ Não usar frameworks CSS externos (Bootstrap, Tailwind, etc.)
- ❌ Não alterar o comportamento atual para clientes não-browser (curl, fetch, etc.)
- ❌ Não adicionar rotas novas — apenas melhorar a existente

## Arquivos a modificar
- `api/controllers/versao.js` — único arquivo a ser alterado

## Testes manuais sugeridos
```bash
# Deve retornar texto simples (comportamento atual mantido)
curl http://localhost:8080/api/versao

# Deve retornar HTML estilizado
curl -H "Accept: text/html" http://localhost:8080/api/versao

# Acessar via navegador: http://localhost:8080/api/versao
```
