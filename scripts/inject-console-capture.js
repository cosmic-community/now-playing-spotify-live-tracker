const fs = require('fs');
const path = require('path');
const glob = require('glob');

const consoleScript = `
<script>
(function () {
  if (window.self === window.top) return;

  const logs = [];
  const MAX_LOGS = 500;

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };

  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');

    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };

    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }

    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) { }
  }

  console.log = function(...args) { captureLog('log', args); originalConsole.log.apply(console, args); };
  console.warn = function(...args) { captureLog('warn', args); originalConsole.warn.apply(console, args); };
  console.error = function(...args) { captureLog('error', args); originalConsole.error.apply(console, args); };
  console.info = function(...args) { captureLog('info', args); originalConsole.info.apply(console, args); };
  console.debug = function(...args) { captureLog('debug', args); originalConsole.debug.apply(console, args); };

  window.addEventListener('error', function(event) {
    captureLog('error', [\`Unhandled Error: \${event.message}\`, \`at \${event.filename}:\${event.lineno}:\${event.colno}\`]);
  });

  window.addEventListener('unhandledrejection', function(event) {
    captureLog('error', [\`Unhandled Promise Rejection: \${event.reason}\`]);
  });

  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) { }
  }

  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) { }
  }

  if (document.readyState === 'complete') {
    setTimeout(() => { sendReady(); sendRouteChange(); }, 200);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => { sendReady(); sendRouteChange(); }, 200);
    });
  }

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function(...args) { originalPushState.apply(history, args); setTimeout(sendRouteChange, 0); };
  history.replaceState = function(...args) { originalReplaceState.apply(history, args); setTimeout(sendRouteChange, 0); };
  window.addEventListener('popstate', sendRouteChange);
  window.addEventListener('hashchange', sendRouteChange);
})();
</script>`;

function injectConsoleScript() {
  try {
    const outDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(outDir)) {
      console.log('No .next directory found. Skipping console capture injection.');
      return;
    }

    // Find all HTML files in .next directory
    const htmlFiles = glob.sync('**/*.html', { cwd: outDir });
    
    let injectedCount = 0;
    
    htmlFiles.forEach(file => {
      const filePath = path.join(outDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Only inject if not already present and there's a head tag
      if (!content.includes('console-capture-ready') && content.includes('<head>')) {
        content = content.replace('</head>', `${consoleScript}</head>`);
        fs.writeFileSync(filePath, content);
        injectedCount++;
      }
    });
    
    console.log(`Console capture script injected into ${injectedCount} HTML files.`);
  } catch (error) {
    console.error('Error injecting console capture script:', error);
  }
}

injectConsoleScript();