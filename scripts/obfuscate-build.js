import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

// Obfuscate all JS files in dist
function obfuscateFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      obfuscateFiles(filePath);
    } else if (file.endsWith('.js') && !file.includes('vendor')) {
      try {
        const code = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already obfuscated or too small
        if (code.length < 100 || code.includes('var _0x')) {
          return;
        }
        
        const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: false,
          debugProtectionInterval: 0,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: true,
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 5,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['base64'],
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 2,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 4,
          stringArrayWrappersType: 'function',
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        });
        
        fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode(), 'utf8');
        console.log(`✓ Obfuscated: ${file}`);
      } catch (error) {
        console.error(`✗ Error obfuscating ${file}:`, error.message);
      }
    }
  });
}

if (fs.existsSync(distDir)) {
  console.log('Starting obfuscation...');
  obfuscateFiles(distDir);
  console.log('Obfuscation complete!');
} else {
  console.error('Dist directory not found. Run build first.');
  process.exit(1);
}

