# 002 · feat · Redesign do componente VersionInfo com interface mais moderna

## Descrição
O componente `VersionInfo.jsx` exibe um pequeno botão circular no header que, ao clicar, abre um tooltip com informações da versão e status da API. A interface atual é funcional, mas pouco atrativa visualmente. O objetivo desta tarefa é modernizar esse componente, tornando-o mais sofisticado e alinhado ao design system da aplicação BIA.

## Contexto
- **Componente:** `client/src/components/VersionInfo.jsx`
- **Estilos:** `client/src/index.css` (classes `.version-info`, `.version-trigger`, `.version-tooltip`, `.version-details`)
- **Design system:** Fonte Inter, variáveis CSS (`--bg-card`, `--text-primary`, `--accent-primary`, `--accent-success`, `--border-color`, `--shadow`)
- **Tema:** Suporte a light e dark mode via variáveis CSS já existentes
- **Integração:** Componente usado dentro do `Header.jsx`

## Critérios de Aceite

### Comportamento esperado
- [ ] O botão de trigger no header deve ser visualmente mais moderno — substituir o círculo pequeno (24px) por um badge/pill com ícone de status e label de versão abreviada
- [ ] Ao clicar no trigger, abrir um painel/card flutuante (dropdown) com design modernizado — não mais um tooltip simples
- [ ] O painel deve fechar ao clicar fora dele (click outside)
- [ ] Manter toda a lógica existente: verificação de status da API, detecção de ambiente, exibição de cache config, botão de refresh e link para `/api/versao`
- [ ] Responsivo: funcionar corretamente em mobile e desktop

### Design do trigger (botão no header)
- [ ] Formato pill/badge horizontal com ícone + texto (ex: `🟢 v4.3.0`)
- [ ] Borda colorida de acordo com o status: verde (online), vermelho (offline), amarelo (verificando)
- [ ] Fundo sutil usando `var(--bg-secondary)` e borda `var(--border-color)`
- [ ] Fonte pequena (0.75rem), `font-weight: 500`
- [ ] Hover com transição suave

### Design do painel flutuante (dropdown)
- [ ] Card com `border-radius: 10px`, `box-shadow` mais pronunciado (ex: `0 8px 24px rgba(0,0,0,0.12)`)
- [ ] Largura mínima de 220px
- [ ] Header do card: título "Status da API" com ícone
- [ ] Seções bem definidas com separadores visuais (`border-top`)
- [ ] Cada linha de informação com ícone à esquerda e texto à direita, em layout flex
- [ ] Badge de status colorido (pill com cor de fundo) para o status da API (Online/Offline/Verificando)
- [ ] Badge de ambiente colorido (seguindo a lógica de cores já implementada em `getEnvironmentInfo()`)
- [ ] Botões de ação (🔗 /api/versao e 🔄 Atualizar) como botões com borda, não links sublinhados
- [ ] Animação de entrada suave (fade + slide down) ao abrir

### Sem quebrar nada
- [ ] A lógica de `checkApiHealth`, `getEnvironmentInfo`, `getApiUrl` deve permanecer inalterada
- [ ] Os intervalos de recheck (30s) devem continuar funcionando
- [ ] O estado `showVersion` continuará controlando visibilidade

## Detalhes de Implementação

### Estrutura JSX sugerida para o trigger
```jsx
<button className={`version-trigger ${apiStatus}`} onClick={handleVersionClick}>
  <span className="version-trigger-icon">{getStatusIcon()}</span>
  <span className="version-trigger-text">v{apiVersion.replace(/\D/g, '') || '?'}</span>
</button>
```

### Estrutura JSX sugerida para o painel
```jsx
{showVersion && (
  <div className="version-panel" ref={panelRef}>
    <div className="version-panel-header">
      <span>Status da API</span>
    </div>
    <div className="version-panel-body">
      <div className="version-row">
        <span className="version-row-label">Versão</span>
        <strong>{apiVersion}</strong>
      </div>
      <div className="version-row">
        <span className="version-row-label">Status</span>
        <span className={`status-badge ${apiStatus}`}>{getStatusIcon()} {getStatusText()}</span>
      </div>
      <div className="version-row">
        <span className="version-row-label">Ambiente</span>
        <span className="env-badge" style={{ color: getEnvironmentInfo().color }}>
          {getEnvironmentInfo().icon} {getEnvironmentInfo().label}
        </span>
      </div>
      {/* demais linhas... */}
    </div>
    <div className="version-panel-actions">
      <button className="version-action-btn" onClick={openVersionEndpoint}>🔗 /api/versao</button>
      <button className="version-action-btn refresh-btn" onClick={checkApiHealth} disabled={apiStatus === 'checking'}>
        🔄 {apiStatus === 'checking' ? 'Verificando...' : 'Atualizar'}
      </button>
    </div>
  </div>
)}
```

### Click outside — adicionar ao componente
```javascript
const panelRef = useRef(null);
const triggerRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      panelRef.current && !panelRef.current.contains(e.target) &&
      triggerRef.current && !triggerRef.current.contains(e.target)
    ) {
      setShowVersion(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

### Novos estilos CSS a adicionar em `index.css`

Substituir/complementar as classes `.version-trigger`, `.version-tooltip`, `.version-content`, `.version-details`, `.version-link` pelas novas abaixo:

```css
/* Version Info — redesign moderno */
.version-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 0.25rem 0.625rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.version-trigger.online  { border-color: #22c55e; color: #22c55e; }
.version-trigger.offline { border-color: #ef4444; color: #ef4444; }
.version-trigger.checking { border-color: #f59e0b; color: #f59e0b; }

.version-trigger:hover {
  background: var(--bg-primary);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.version-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 220px;
  z-index: 1000;
  animation: versionPanelIn 0.15s ease;
  overflow: hidden;
}

@keyframes versionPanelIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.version-panel-header {
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.version-panel-body {
  padding: 0.5rem 0;
}

.version-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.875rem;
  gap: 0.5rem;
}

.version-row-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.version-row strong,
.version-row span:last-child {
  font-size: 0.75rem;
  color: var(--text-primary);
  text-align: right;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-badge.online   { background: rgba(34,197,94,0.12);  color: #22c55e; }
.status-badge.offline  { background: rgba(239,68,68,0.12);   color: #ef4444; }
.status-badge.checking { background: rgba(245,158,11,0.12);  color: #f59e0b; }

.version-panel-actions {
  padding: 0.5rem 0.875rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.version-action-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.version-action-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: var(--bg-primary);
}

.version-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## O que NÃO fazer
- ❌ Não alterar a lógica de negócio (health check, detecção de ambiente, intervalos)
- ❌ Não adicionar dependências externas de CSS ou UI
- ❌ Não remover nenhuma informação já exibida atualmente
- ❌ Não alterar outros componentes além de `VersionInfo.jsx` e `index.css`

## Arquivos a modificar
- `client/src/components/VersionInfo.jsx` — estrutura JSX e inclusão de `useRef` + click outside
- `client/src/index.css` — substituir/adicionar classes do Version Info

## Testes manuais sugeridos
- Verificar se o trigger aparece como pill/badge no header
- Clicar no trigger e confirmar que o painel abre com animação
- Verificar que clicar fora do painel o fecha
- Testar em tema light e dark
- Testar em viewport mobile (< 640px)
- Confirmar que o status muda entre 🟢/🔴/🟡 conforme a API
- Confirmar que o botão 🔄 Atualizar funciona e fica desabilitado durante o check
