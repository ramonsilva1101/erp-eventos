import Header from '../Header/Header'; // Importa o cabeçalho que acabamos de criar

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;