import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CadastroUsuarioCompleto from './pages/CadastroUsuarioCompleto';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUsuario} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard usuario={usuario} onLogout={logout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastro-completo"
          element={
            <PrivateRoute>
              <CadastroUsuarioCompleto />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to={usuario ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
