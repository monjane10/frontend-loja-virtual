import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Cadastro';
import ManageProducts from './components/pages/Gestao-productos';
import ManageProvinces from './components/pages/Gestao-provincias';
import Dashboard from './components/pages/Dasboard'; // Corrigido para o caminho correto
import Layout from './components/layout';
import ManageCities from './components/pages/Gestao-cidades';
import ManageCategories from './components/pages/Categorias';
import ManageMarcas from './components/pages/Marca';
import ManagePeople from './components/pages/Pessoas';
import ManagePermissions from './components/pages/Permissao';

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas sem layout (isoladas) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Páginas com layout (navegação principal) */}
        <Route path="/" element={<Layout />}>
          <Route path="/productos" element={<ManageProducts />} />
          <Route path="/provincias" element={<ManageProvinces />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cidades" element={<ManageCities />} />
          <Route path="/categorias" element={<ManageCategories />} />
          <Route path="/marcas" element={<ManageMarcas />} />
          <Route path="/pessoas" element={<ManagePeople />} />
          <Route path="/permissoes" element={<ManagePermissions />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
