import React, { Suspense } from 'react';
import './App.css';

const Header = React.lazy(() => import('header/Header'));
const Skeleton = React.lazy(() => import('skeleton/Skeleton'));
const Breadcrumb = React.lazy(() => import('breadcrumb/Breadcrumb'));
const Catalogue = React.lazy(() => import('catalogue/Catalogue'));

const App = () => {
  return (
    <div className="app-container">
      <Suspense fallback={<div className="loading">Chargement du header...</div>}>
        <Header />
      </Suspense>

      <Suspense fallback={<div className="loading">Chargement du breadcrumb...</div>}>
        <Breadcrumb />
      </Suspense>

      <main className="main-content">
        <h2 className="welcome-title">Bienvenue sur Efreiflix</h2>
        <p className="main-description">Contenu principal de l'application...</p>

        <Suspense fallback={<div className="loading">Chargement du catalogue...</div>}>
          <Catalogue />
        </Suspense>

        <Suspense fallback={<div className="loading">Chargement du skeleton...</div>}>
          <Skeleton />
        </Suspense>
      </main>
    </div>
  );
};

export default App;