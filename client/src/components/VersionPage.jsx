import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useApiStatus from "../hooks/useApiStatus.js";

const formatTime = (date) =>
  date.toLocaleTimeString("pt-BR", { hour12: false });

const VersionPage = () => {
  const {
    apiStatus,
    apiVersion,
    cacheConfig,
    lastCheck,
    responseTime,
    apiUrl,
    env,
    statusIcon,
    statusText,
    refresh,
    openVersionEndpoint,
  } = useApiStatus();

  useEffect(() => {
    document.title = "Versão da API - BIA";
  }, []);

  const isChecking = apiStatus === "checking";
  const isOffline = apiStatus === "offline";
  const cacheEnabled = Boolean(cacheConfig && cacheConfig.enabled);

  return (
    <div className="version-page">
      <div className="version-hero">
        <h2>Versão da API</h2>
        <p className="version-hero-subtitle">
          Status, versão e ambiente da API da BIA
        </p>
      </div>

      <div
        className={`version-status version-status--${apiStatus}`}
        role="status"
        aria-live="polite"
      >
        <span className="version-status-dot" aria-hidden="true">
          {statusIcon}
        </span>
        <div className="version-status-text">
          <strong>API {statusText}</strong>
          <span className="version-status-detail">
            {isChecking
              ? "Consultando /api/versao..."
              : isOffline
              ? "Não foi possível contatar a API"
              : `Resposta em ${responseTime} ms`}
          </span>
        </div>
      </div>

      {isOffline && (
        <div className="version-error" role="alert">
          <h3>
            <span aria-hidden="true">⚠️</span> API indisponível
          </h3>
          <p>
            A requisição para <code>{apiUrl}/api/versao</code> falhou ou excedeu
            o tempo limite de 5 segundos.
          </p>
          <p>
            Verifique se a API está no ar (por exemplo,{" "}
            <code>docker compose up server</code>), se a URL acima está correta
            e se não há bloqueio de rede ou CORS. Depois, use o botão
            "Atualizar" abaixo.
          </p>
        </div>
      )}

      <div className="version-grid">
        <div className="version-card">
          <h3>Versão</h3>
          {isChecking ? (
            <div className="version-skeleton" aria-hidden="true" />
          ) : (
            <p className="version-card-value">
              {isOffline ? "Indisponível" : apiVersion}
            </p>
          )}
          <p className="version-card-hint">Retornado por GET /api/versao</p>
        </div>

        <div className={`version-card version-card--env-${env.type}`}>
          <h3>Ambiente</h3>
          <p className="version-card-value">
            <span className="version-env-icon" aria-hidden="true">
              {env.icon}
            </span>
            {env.label}
          </p>
          <p className="version-card-hint">{env.description}</p>
        </div>

        <div className="version-card">
          <h3>URL da API</h3>
          <p className="version-card-value version-card-value--mono">
            {apiUrl}
          </p>
          <p className="version-card-hint">
            Origem utilizada pelo frontend nas chamadas
          </p>
        </div>

        <div className="version-card">
          <h3>Cache</h3>
          {isChecking && !cacheConfig ? (
            <div className="version-skeleton" aria-hidden="true" />
          ) : cacheEnabled ? (
            <p className="version-card-value version-card-value--mono">
              {cacheConfig.endpoint}:{cacheConfig.port}
            </p>
          ) : (
            <p className="version-card-value version-card-value--muted">
              Desabilitado
            </p>
          )}
          <p className="version-card-hint">
            {cacheEnabled
              ? `TTL de ${cacheConfig.ttl}s`
              : "Sem configuração de cache disponível"}
          </p>
        </div>

        <div className="version-card">
          <h3>Última verificação</h3>
          {isChecking && !lastCheck ? (
            <div className="version-skeleton" aria-hidden="true" />
          ) : (
            <p className="version-card-value">
              {lastCheck
                ? `Atualizado às ${formatTime(lastCheck)}`
                : "Ainda sem verificação bem-sucedida"}
            </p>
          )}
          <p className="version-card-hint">Recheca automaticamente a cada 30s</p>
        </div>

        <div className="version-card">
          <h3>Tempo de resposta</h3>
          {isChecking ? (
            <div className="version-skeleton" aria-hidden="true" />
          ) : (
            <p className="version-card-value">
              {responseTime === null ? "—" : `${responseTime} ms`}
            </p>
          )}
          <p className="version-card-hint">Medido na chamada a /api/versao</p>
        </div>
      </div>

      <div className="version-actions">
        <Link to="/" className="back-button">
          ← Voltar
        </Link>

        <button
          type="button"
          className="version-button version-button--primary"
          onClick={refresh}
          disabled={isChecking}
          aria-label="Atualizar o status da API agora"
        >
          <span aria-hidden="true">🔄</span>
          <span className="version-button-label">
            {isChecking ? "Verificando..." : "Atualizar"}
          </span>
        </button>

        <button
          type="button"
          className="version-button"
          onClick={openVersionEndpoint}
          aria-label="Abrir o endpoint /api/versao em uma nova aba"
        >
          <span aria-hidden="true">🔗</span>
          <span className="version-button-label">Abrir /api/versao</span>
        </button>
      </div>
    </div>
  );
};

export default VersionPage;
