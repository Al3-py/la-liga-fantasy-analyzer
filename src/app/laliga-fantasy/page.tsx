export default function LaLigaFantasy() {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LaLiga Fantasy - Precios en Tiempo Real</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .header h1 {
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .header p {
            color: #666;
            font-size: 14px;
          }

          .auth-section {
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .google-signin-btn {
            background: white;
            border: 2px solid #ddd;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
          }

          .google-signin-btn:hover {
            border-color: #667eea;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          }

          .user-info {
            background: #f0f7ff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
          }

          .user-info.visible {
            display: block;
          }

          .logout-btn {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
          }

          .players-section {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .loading {
            text-align: center;
            padding: 40px;
            color: #666;
          }

          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #ddd;
          }

          td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            color: #666;
          }

          .price {
            font-weight: 600;
            color: #667eea;
          }

          .error {
            background: #ffe0e0;
            color: #c92a2a;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }

          .search-box {
            margin-bottom: 20px;
          }

          .search-box input {
            width: 100%;
            max-width: 300px;
            padding: 10px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }

          .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          }

          .stat-value {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>⚽ LaLiga Fantasy</h1>
            <p>Monitor de precios en tiempo real</p>
          </div>

          <div className="auth-section">
            <div id="authContainer">
              <h2>Inicia sesión para ver los precios</h2>
              <button className="google-signin-btn" onClick="signInWithGoogle()">
                Entrar con Google
              </button>
            </div>

            <div id="userInfo" className="user-info">
              <div>
                Sesión iniciada como: <strong id="userName"></strong>
              </div>
            </div>
          </div>

          <div id="playersContainer" style={{display: 'none'}}>
            <div className="players-section">
              <h2>📊 Jugadores y Precios</h2>
              <div id="statsContainer" className="stats"></div>
              <div className="search-box">
                <input type="text" id="searchInput" placeholder="Busca un jugador..." />
              </div>
              <div id="loadingContainer" className="loading" style={{display: 'none'}}>
                <div className="spinner"></div>
                <p>Cargando jugadores...</p>
              </div>
              <div id="errorContainer"></div>
              <table id="playersTable" style={{display: 'none'}}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Equipo</th>
                    <th>Posición</th>
                    <th>Precio</th>
                    <th>Puntos</th>
                  </tr>
                </thead>
                <tbody id="playersBody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <script>{`
          const API_URL = 'https://la-liga-fantasy-analyzerprime.vercel.app';
          let allPlayers = [];

          window.onload = function () {
            google.accounts.id.initialize({
              client_id: '990495765040-o744p3i6acb2mqhcl15qp6k05s9loqis.apps.googleusercontent.com',
              callback: handleCredentialResponse
            });
          };

          function signInWithGoogle() {
            google.accounts.id.renderButton(
              document.querySelector('.google-signin-btn'),
              { theme: 'outline', size: 'large' }
            );
            google.accounts.id.prompt();
          }

          function handleCredentialResponse(response) {
            localStorage.setItem('googleToken', response.credential);
            const decoded = parseJwt(response.credential);
            document.getElementById('userName').textContent = decoded.name;
            document.getElementById('userInfo').classList.add('visible');
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('playersContainer').style.display = 'block';
            fetchPlayers(response.credential);
          }

          function parseJwt(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
          }

          async function fetchPlayers(token) {
            const loadingContainer = document.getElementById('loadingContainer');
            const errorContainer = document.getElementById('errorContainer');
            loadingContainer.style.display = 'block';
            errorContainer.innerHTML = '';

            try {
              const response = await fetch(\`\${API_URL}/api/proxy?path=/v1/competition/1/players\`, {
                method: 'GET',
                headers: {
                  'Authorization': \`Bearer \${token}\`,
                  'Accept': 'application/json',
                  'x-lang': 'es'
                }
              });

              if (!response.ok) {
                throw new Error(\`Error \${response.status}\`);
              }

              const data = await response.json();
              displayPlayers(data);
            } catch (error) {
              errorContainer.innerHTML = \`<div class="error">⚠️ Error: \${error.message}</div>\`;
            } finally {
              loadingContainer.style.display = 'none';
            }
          }

          function displayPlayers(data) {
            const tbody = document.getElementById('playersBody');
            const table = document.getElementById('playersTable');
            allPlayers = Array.isArray(data) ? data : data.data || [];

            tbody.innerHTML = '';
            allPlayers.forEach(player => {
              const row = document.createElement('tr');
              row.innerHTML = \`
                <td>\${player.name || 'N/A'}</td>
                <td>\${player.team || 'N/A'}</td>
                <td>\${player.position || 'N/A'}</td>
                <td class="price">$\${(player.price || 0).toLocaleString()}</td>
                <td>\${player.points || 0}</td>
              \`;
              tbody.appendChild(row);
            });
            table.style.display = 'table';
          }
        `}</script>
      </body>
    </html>
  );
      }
