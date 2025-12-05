import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Anti-debugging and obfuscation protection (production only, non-breaking)
(function() {
  'use strict';
  
  // Only apply protection in production build
  const isProduction = import.meta.env.PROD;
  
  if (!isProduction) {
    // In development, allow normal operation
    return;
  }
  
  // Decoy variables (dead code)
  const _d1 = Math.random() * 1000;
  const _d2 = [1,2,3,4,5].map(x => x*x);
  const _d3 = {a:1,b:2,c:3};
  
  // Disable right-click context menu (only in production)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, false);
  
  // Disable common developer tools shortcuts (only in production, less aggressive)
  document.addEventListener('keydown', (e) => {
    const _k = e.key;
    const _c = e.ctrlKey || e.metaKey;
    const _s = e.shiftKey;
    
    // Only block F12 and Ctrl+Shift+I (most common DevTools shortcuts)
    if (
      _k === 'F12' ||
      (_c && _s && _k === 'I')
    ) {
      e.preventDefault();
      return false;
    }
  }, false);
  
  // String obfuscation helper (encrypted)
  window._dec = function(arr) {
    if (!Array.isArray(arr)) return '';
    const _k = [107, 101, 121, 51, 51]; // "key33"
    const _key = String.fromCharCode(..._k);
    return arr.map((c, i) => {
      if (typeof c === 'number') {
        const _decoded = c ^ _key.charCodeAt(i % _key.length);
        return String.fromCharCode(_decoded);
      }
      return c;
    }).join('');
  };
  
  // Dead code injection (extensive obfuscation)
  const _dead1 = () => {
    const _x = [1,2,3,4,5,6,7,8,9,10];
    const _sum = _x.reduce((a,b) => a+b, 0);
    const _prod = _x.reduce((a,b) => a*b, 1);
    return _sum * _prod % 1000;
  };
  const _dead2 = (n) => {
    let _r = n;
    for(let i=0;i<100;i++){_r=(_r*1.01)%1000;}
    const _sqrt = Math.sqrt(_r);
    return Math.floor(_sqrt * 10);
  };
  const _dead3 = () => {
    const _a = Math.random() * 1000;
    const _b = _dead1();
    const _c = _dead2(123);
    return (_a + _b + _c) % 100;
  };
  const _dead4 = _dead3();
  const _dead5 = [1,2,3,4,5].map(x => x * _dead4);
  const _dead6 = {a: _dead1(), b: _dead2(456), c: _dead3()};
  
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



