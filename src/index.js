import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

document.onkeydown = (e) => {
  if (e.key == 123) {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'I') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'C') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'J') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.key == 'U') {
      e.preventDefault();
  }
};


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

