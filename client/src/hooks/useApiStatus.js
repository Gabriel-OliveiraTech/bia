import { useState, useEffect, useCallback } from 'react';

/**
 * Resolve a URL da API efetivamente utilizada pelo frontend.
 * 1. VITE_API_URL, se definido
 * 2. window.location.origin, se a porta for 8080
 * 3. http://localhost:8080 como fallback de desenvolvimento
 */
export const getApiUrl = () => {
  // Se estiver definido no ambiente (Docker/Produção)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Se estiver rodando no mesmo domínio (produção integrada)
  if (window.location.port === '8080') {
    return window.location.origin;
  }

  // Desenvolvimento local - inferir porta 8080
  return 'http://localhost:8080';
};

export const getStatusIcon = (apiStatus) => {
  switch (apiStatus) {
    case 'online': return '🟢';
    case 'offline': return '🔴';
    case 'checking': return '🟡';
    default: return '⚪';
  }
};

export const getStatusText = (apiStatus) => {
  switch (apiStatus) {
    case 'online': return 'Online';
    case 'offline': return 'Offline';
    case 'checking': return 'Verificando...';
    default: return 'Desconhecido';
  }
};

/**
 * Classifica o ambiente a partir de window.location.
 * `color` é mantido por compatibilidade com o tooltip do Header;
 * novas telas devem usar `type` para escolher a classe CSS.
 */
export const getEnvironmentInfo = () => {
  const { protocol, hostname, port } = window.location;

  // Ambiente local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      type: 'local',
      icon: '🏠',
      label: 'Local',
      description: `${hostname}:${port}`,
      color: '#3b82f6' // azul
    };
  }

  // IP direto sem HTTPS
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) && protocol === 'http:') {
    return {
      type: 'ip-http',
      icon: '🌐',
      label: 'IP Direto',
      description: `${hostname}${port ? ':' + port : ''}`,
      color: '#f59e0b' // amarelo/laranja
    };
  }

  // ALB/Load Balancer sem HTTPS
  if (protocol === 'http:' && hostname.includes('.elb.')) {
    return {
      type: 'alb-http',
      icon: '⚖️',
      label: 'ALB HTTP',
      description: hostname,
      color: '#ef4444' // vermelho
    };
  }

  // Domínio com HTTPS (produção)
  if (protocol === 'https:') {
    return {
      type: 'domain-https',
      icon: '🔒',
      label: 'Produção',
      description: hostname,
      color: '#22c55e' // verde
    };
  }

  // Outros casos
  return {
    type: 'other',
    icon: '❓',
    label: 'Outro',
    description: `${hostname}${port ? ':' + port : ''}`,
    color: '#6b7280' // cinza
  };
};

/**
 * Hook com o estado de saúde da API consumido pelo tooltip do Header
 * (VersionInfo) e pela página /versao (VersionPage).
 *
 * @param {{ autoRefreshMs?: number }} options
 */
const useApiStatus = ({ autoRefreshMs = 30000 } = {}) => {
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [apiVersion, setApiVersion] = useState('4.0.0');
  const [cacheConfig, setCacheConfig] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const apiUrl = getApiUrl();

  const checkApiHealth = useCallback(async () => {
    setApiStatus('checking');
    const url = getApiUrl();
    const startedAt = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`${url}/api/versao`, {
        signal: controller.signal,
        method: 'GET',
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const versionText = await response.text();
        setResponseTime(Math.round(performance.now() - startedAt));
        setApiVersion(versionText);
        setApiStatus('online');
        setLastCheck(new Date());

        // Buscar config do cache
        try {
          const cacheRes = await fetch(`${url}/api/cache-config`, { cache: 'no-cache' });
          if (cacheRes.ok) setCacheConfig(await cacheRes.json());
        } catch {}
      } else {
        setResponseTime(Math.round(performance.now() - startedAt));
        setApiStatus('offline');
      }
    } catch (error) {
      console.warn('API Health Check falhou:', error.message);
      setResponseTime(Math.round(performance.now() - startedAt));
      setApiStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkApiHealth();

    if (!autoRefreshMs) return undefined;

    // Recheck periódico
    const interval = setInterval(checkApiHealth, autoRefreshMs);
    return () => clearInterval(interval);
  }, [checkApiHealth, autoRefreshMs]);

  const openVersionEndpoint = useCallback(() => {
    window.open(`${getApiUrl()}/api/versao`, '_blank');
  }, []);

  return {
    apiStatus,
    apiVersion,
    cacheConfig,
    lastCheck,
    responseTime,
    apiUrl,
    env: getEnvironmentInfo(),
    statusIcon: getStatusIcon(apiStatus),
    statusText: getStatusText(apiStatus),
    refresh: checkApiHealth,
    openVersionEndpoint
  };
};

export default useApiStatus;
