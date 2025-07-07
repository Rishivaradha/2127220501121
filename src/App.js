import React from 'react';
import UrlShortener from './UrlShortener';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <UrlShortener />
    </div>
  );
}

export default App;

