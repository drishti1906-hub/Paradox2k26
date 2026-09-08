import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CodeEditor() {
  const [code, setCode] = useState('');
  const targetCode = `// INITIALIZING PARADOX PROTOCOL
const system = require('paradox-core');
const network = require('sub-net');

async function bypassSecurity() {
  console.log("Analyzing firewall patterns...");
  await system.connect({ 
    node: "alpha-7",
    encryption: "quantum-level-4"
  });
  
  if (network.status === 'VULNERABLE') {
    return system.injectPayload(process.env.ROOT_KEY);
  }
  
  throw new Error("Access Denied");
}

bypassSecurity().then(res => {
  console.log("We are in.");
}).catch(err => {
  console.error("Connection terminated.");
});`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setCode(targetCode.substring(0, i));
      i++;
      if (i > targetCode.length) clearInterval(interval);
    }, 20); // Fast typing effect
    return () => clearInterval(interval);
  }, [targetCode]);

  // Very basic syntax highlighting for demo purposes
  const highlightCode = (text) => {
    if (!text) return { __html: '' };
    
    // First, escape HTML to prevent XSS and broken tags
    let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Comments
    html = html.replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>');
    
    // Keywords
    html = html.replace(/\b(require|const|function|async|await|return|if|throw|new|let|var)\b/g, '<span class="text-paradox-purple">$1</span>');
    
    // Strings
    html = html.replace(/('.*?'|".*?")/g, '<span class="text-paradox-lime">$1</span>');
    
    // Basic objects/functions calling
    html = html.replace(/\b(console|system|network|process)\b/g, '<span class="text-paradox-aqua">$1</span>');

    return { __html: html };
  };

  return (
    <div className="relative font-mono text-sm leading-relaxed text-gray-300 h-full w-full whitespace-pre-wrap">
      <div className="flex">
        <div className="flex-shrink-0 w-8 flex flex-col text-right pr-4 text-gray-600 select-none">
          {targetCode.split('\n').map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <div className="flex-1">
          <span dangerouslySetInnerHTML={highlightCode(code)} />
          <motion.span 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-paradox-lime ml-1 align-middle shadow-neon-lime"
          />
        </div>
      </div>
    </div>
  );
}
