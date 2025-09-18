import Layout from './components/Layout/Layout';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Layout>
      {/* O Outlet é onde o React Router vai renderizar a página da rota atual */}
      <Outlet />
    </Layout>
  )
}

export default App;