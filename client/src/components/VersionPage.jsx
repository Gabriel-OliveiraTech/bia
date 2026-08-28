import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VersionPage = () => {
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [apiVersion, setApiVersion] = useState(null);
  const [cacheConfig, setCacheConfig] = useState(null);

  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    if (window.location.port === '8080') {
      return window.location.origin;
    }
    return 'http://localhost:8080';
  };

  const checkApiHealth = async () => {
    setApiStatus('checking');
    try {
      const apiUrl = getApiUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${apiUrl}/api/versao`, {
        signal: controller.signal,
        method: 'GET',
        cache: 'no-cache',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const versionText = await response.text();
        setApiVersion(versionText);
        setApiStatus('online');

        // Buscar config do cache
        try {
          const cacheRes = await fetch(`${apiUrl}/api/cache-config`, { cache: 'no-cache' });
          if (cacheRes.ok) {
            setCacheConfig(await cacheRes.json());
          }
        } catch {
          // cache-config não disponível — não é erro crítico
        }
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      console.warn('API Health Check falhou:', error.message);
      setApiStatus('offline');
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  const getEnvironmentInfo = () => {
    const { protocol, hostname, port } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return {
        type: 'local',
        icon: '🏠',
        label: 'Local',
        description: `${hostname}${port ? ':' + port : ''}`,
        color: '#3b82f6',
      };
    }

    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) && protocol === 'http:') {
      return {
        type: 'ip-http',
        icon: '🌐',
        label: 'IP Direto',
        description: `${hostname}${port ? ':' + port : ''}`,
        color: '#f59e0b',
      };
    }

    if (protocol === 'http:' && hostname.includes('.elb.')) {
      return {
        type: 'alb-http',
        icon: '⚖️',
        label: 'ALB HTTP',
        description: hostname,
        color: '#ef4444',
      };
    }

    if (protocol === 'https:') {
      return {
        type: 'domain-https',
        icon: '🔒',
        label: 'Produção',
        description: hostname,
        color: '#22c55e',
      };
    }

    return {
      type: 'other',
      icon: '❓',
      label: 'Outro',
      description: `${hostname}${port ? ':' + port : ''}`,
      color: '#6b7280',
    };
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'online':   return '🟢';
      case 'offline':  return '🔴';
      case 'checking': return '🟡';
      default:         return '⚪';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'online':   return 'Online';
      case 'offline':  return 'Offline';
      case 'checking': return 'Verificando...';
      default:         return 'Desconhecido';
    }
  };

  const env = getEnvironmentInfo();
  const apiUrl = getApiUrl();

  return (
    <div className="about-page">
      <div className="about-content">

        {/* Hero card */}
        <div className="about-hero">
          <h2>Versão da API</h2>
          <p className="about-subtitle">
            {apiStatus === 'checking'
              ? 'Verificando conexão com a API...'
              : apiStatus === 'online'
              ? apiVersion
              : 'Não foi possível conectar à API'}
          </p>
        </div>

        <div className="feature-grid">

          {/* Status da API */}
          <div className="feature-card highlight">
            <h3>Status da API</h3>
            <h4 style={{
              color: apiStatus === 'online'
                ? 'var(--accent-success)'
                : apiStatus === 'offline'
                ? 'var(--accent-danger)'
                : '#f59e0b',
            }}>
              {getStatusIcon()} {getStatusText()}
            </h4>
            <p>{apiUrl}/api/versao</p>
          </div>

          {/* Ambiente */}
          <div className="feature-card">
            <h3>Ambiente</h3>
            <h4 style={{ color: env.color }}>
              {env.icon} {env.label}
            </h4>
            <p>{env.description}</p>
          </div>

          {/* Cache */}
          <div className="feature-card">
            <h3>Cache</h3>
            {cacheConfig ? (
              cacheConfig.enabled ? (
                <>
                  <h4 style={{ color: 'var(--accent-success)' }}>✅ Ativado</h4>
                  <p>
                    {cacheConfig.endpoint}:{cacheConfig.port}
                    {cacheConfig.ttl ? ` — TTL: ${cacheConfig.ttl}s` : ''}
                  </p>
                </>
              ) : (
                <>
                  <h4 style={{ color: 'var(--text-secondary)' }}>⚪ Desativado</h4>
                  <p>Cache não está em uso</p>
                </>
              )
            ) : (
              <>
                <h4 style={{ color: 'var(--text-secondary)' }}>—</h4>
                <p>Informação não disponível</p>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Ações */}
      <div className="about-footer">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to="/" className="back-button">
            ← Voltar
          </Link>
          <button
            className="btn"
            onClick={checkApiHealth}
            disabled={apiStatus === 'checking'}
            title="Re-checar status da API"
          >
            🔄 {apiStatus === 'checking' ? 'Verificando...' : 'Atualizar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VersionPage;
