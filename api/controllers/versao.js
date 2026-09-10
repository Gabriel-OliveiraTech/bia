const { version: versaoPackage } = require("../../package.json");

module.exports = () => {
  const controller = {};

  // Só devolve HTML quando o cliente pediu HTML explicitamente (navegador).
  // Health checks, curl e o frontend continuam recebendo o texto plano.
  const querHtml = (req) => {
    const accept = (req && req.headers && req.headers.accept) || "";
    return accept.includes("text/html");
  };

  const paginaHtml = (versao) => `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bia ${versao}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    color: #1f2937;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem 2.5rem;
    text-align: center;
  }
  .card h1 { margin: 0 0 0.25rem; font-size: 1.5rem; }
  .versao {
    display: inline-block;
    margin-top: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: #3b82f6;
    color: #ffffff;
    font-weight: 600;
    font-size: 1.125rem;
  }
  .rota { margin: 0.75rem 0 0; color: #6b7280; font-size: 0.75rem; }
  @media (prefers-color-scheme: dark) {
    body { background: #111827; color: #f9fafb; }
    .card { background: #1f2937; border-color: #374151; }
    .rota { color: #d1d5db; }
  }
</style>
</head>
<body>
  <main class="card">
    <h1>Projeto BIA</h1>
    <div class="versao">Bia ${versao}</div>
    <p class="rota">GET /api/versao</p>
  </main>
</body>
</html>`;

  controller.get = async (req, res) => {
    const versao = process.env.VERSAO_API || versaoPackage;
    const responseString = `Bia ${versao}`;

    if (querHtml(req)) {
      res.set("Content-Type", "text/html; charset=utf-8");
      return res.send(paginaHtml(versao));
    }

    res.send(responseString);
  };

  return controller;
};
