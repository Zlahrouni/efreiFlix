import React, { Suspense } from 'react';
import Breadcrumb from 'breadcrumb/Breadcrumb';
import Catalogue from 'catalogue/Catalogue';

const Header = React.lazy(() => import('header/Header'));
const Skeleton = React.lazy(() => import('skeleton/Skeleton'));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Chargement du header...</div>}>
        <Header />
      </Suspense>

      <Suspense fallback={<div>Chargement du breadcrumb...</div>}>
        <Breadcrumb />
      </Suspense>

      <main style={{ padding: '2rem' }}>
        <h2>Bienvenue sur Efreiflix</h2>
        <p> Contenu principal de l'application...</p>

        <Suspense fallback={<div>Chargement du catalogue...</div>}>
          <Catalogue />
        </Suspense>

        <Suspense fallback={<div>Chargement du skeleton...</div>}>
          <Skeleton />
        </Suspense>
      </main>
    </div>
  );
};

export default App;