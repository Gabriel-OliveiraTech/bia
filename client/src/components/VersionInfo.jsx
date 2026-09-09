import React, { useState } from 'react';
import useApiStatus from '../hooks/useApiStatus.js';

const VersionInfo = () => {
  const [showVersion, setShowVersion] = useState(false);
  const {
    apiStatus,
    apiVersion,
    cacheConfig,
    apiUrl,
    env,
    statusIcon,
    statusText,
    refresh,
    openVersionEndpoint
  } = useApiStatus();

  const handleVersionClick = () => {
    setShowVersion(!showVersion);
    if (!showVersion) {
      // Recheca quando abre o tooltip
      refresh();
    }
  };

  return (
    <div className="version-info">
      <button
        className={`version-trigger ${apiStatus} ${env.type}`}
        onClick={handleVersionClick}
        title={`${env.icon} ${env.label} | API: ${statusText}`}
        style={{
          borderColor: apiStatus === 'online' ? env.color :
                      apiStatus === 'offline' ? '#ef4444' :
                      '#f59e0b'
        }}
      >
        {statusIcon}
      </button>
             {showVersion && (
         <div className="version-tooltip">
           <div className="version-content">
             <strong>{apiVersion}</strong>
             <div className="version-details">
               <small>
                 <span className="status-indicator">{statusIcon}</span>
                 Status: {statusText}
               </small>
               <small>
                 <span
                   className="env-indicator"
                   style={{ color: env.color }}
                 >
                   {env.icon}
                 </span>
                 Ambiente: {env.label}
               </small>
               <small>Local: {env.description}</small>
               <small>API: {apiUrl}</small>
               {cacheConfig && cacheConfig.enabled && (
                 <small>Cache: {cacheConfig.endpoint}:{cacheConfig.port} - {cacheConfig.ttl}s</small>
               )}
               <small>
                 <button
                   className="version-link"
                   onClick={openVersionEndpoint}
                   title="Abrir endpoint de versão"
                 >
                   🔗 /api/versao
                 </button>
               </small>
               <small>
                 <button
                   className="version-link refresh-btn"
                   onClick={refresh}
                   title="Verificar status da API"
                   disabled={apiStatus === 'checking'}
                 >
                   🔄 {apiStatus === 'checking' ? 'Verificando...' : 'Atualizar'}
                 </button>
               </small>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default VersionInfo;
