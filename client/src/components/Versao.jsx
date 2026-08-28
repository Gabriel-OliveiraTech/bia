import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (window.location.port === '8080') {
    return window.location.origin;
  }
  return 'http://localhost:8080';
};

const getEnvironmentInfo = () => {
  const { protocol, hostname, port } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      type: 'local',
      icon: '🏠',
      label: 'Local',
      description: `${hostname}:${port}`,
      color: 'var(--accent-primary)',
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
      color: 'var(--accent-success)',
    };
  }

  return {
    type: 'other',
    icon: '❓',
    label: 'Outro',
    description: `${hostname}${port ? ':' + port : ''}`,
    color: 'var(--text-secondary)',
  };
};

const STATUS_CONFIG = {
  online: { icon: '🟢', label: 'Online', color: 'var(--accent-success)' },
  offline: { icon: '🔴', label: 'Offline', color: 'var(--accent-danger)' },
  checking: { icon: '🟡', label: 'Verificando...', color: '#f59e0b' },
};

const Versao = () => {
  useTheme(); // garante re-render ao trocar tema
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiVersion, setApiVersion] = useState(null);
  const [cacheConfig, setCacheConfig] = useState(null);
  const [apiUrl] = useState(getApiUrl);
  const [envInfo] = useState(getEnvironmentInfo);

  const checkApiHealth = async () => {
    setApiStatus('checking');
    try {
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
        setApiVersion(versionText.trim());
        setApiStatus('online');

        try {
          const cacheRes = await fetch(`${apiUrl}/api/cache-config`, { cache: 'no-cache' });
          if (cacheRes.ok) {
            setCacheConfig(await cacheRes.json());
          }
        } catch {
          // cache config não disponível — sem problema
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

  const status = STATUS_CONFIG[apiStatus] || STATUS_CONFIG.checking;

  return (
    <div className="about-page">
      <div className="about-content">

        {/* Hero */}
        <div className="about-hero" style={{ marginBottom: '1.5rem' }}>
          <h2>Versão da API</h2>
          <p className="about-subtitle">
            Informações sobre a versão e ambiente da aplicação BIA
          </p>
        </div>

        {/* Card — Versão */}
        <div className="feature-card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Versão da API
          </h3>
          {apiVersion ? (
            <h4 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', margin: 0 }}>
              {apiVersion}
            </h4>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {apiStatus === 'checking' ? 'Carregando...' : 'Indisponível'}
            </p>
          )}
        </div>

        {/* Card — Status */}
        <div className="feature-card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Status da API
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>{status.icon}</span>
            <span style={{ fontWeight: 600, color: status.color, fontSize: '1rem' }}>
              {status.label}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', wordBreak: 'break-all' }}>
            <strong style={{ color: 'var(--text-primary)' }}>URL: </strong>
            {apiUrl}
          </div>
          <button
            className="btn"
            onClick={checkApiHealth}
            disabled={apiStatus === 'checking'}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
          >
            🔄 {apiStatus === 'checking' ? 'Verificando...' : 'Atualizar Status'}
          </button>
        </div>

        {/* Card — Ambiente */}
        <div className="feature-card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Ambiente
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>{envInfo.icon}</span>
            <span style={{ fontWeight: 600, color: envInfo.color, fontSize: '1rem' }}>
              {envInfo.label}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            {envInfo.description}
          </p>
        </div>

        {/* Card — Cache (somente quando disponível) */}
        {cacheConfig && (
          <div className="feature-card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Cache
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <InfoRow label="Status" value={cacheConfig.enabled ? '✅ Ativo' : '❌ Inativo'} />
              {cacheConfig.enabled && (
                <>
                  <InfoRow label="Endpoint" value={cacheConfig.endpoint || '—'} />
                  <InfoRow label="Porta" value={cacheConfig.port || '—'} />
                  <InfoRow label="TTL" value={cacheConfig.ttl ? `${cacheConfig.ttl}s` : '—'} />
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Rodapé com botão de voltar */}
      <div className="about-footer">
        <Link to="/" className="back-button">
          ← Voltar
        </Link>
      </div>
    </div>
  );
};

/** Linha auxiliar de informação label: value */
const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
  </div>
);

export default Versao;
