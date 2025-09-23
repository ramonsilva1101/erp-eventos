
import Header from '../Header/Header';

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