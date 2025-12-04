import React, { useState } from 'react';
import Header from './components/Header';
import ToolCard from './components/ToolCard';
import ToolModal from './components/ToolModal';

const tools = [
  { id: 'split', name: 'Split PDF', icon: '✂️', description: 'Extract pages from PDF' },
  { id: 'merge', name: 'Merge PDF', icon: '🔗', description: 'Combine multiple PDFs' },
  { id: 'word-to-pdf', name: 'Word to PDF', icon: '📄', description: 'Convert DOCX to PDF' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: '📝', description: 'Convert PDF to text' },
  { id: 'page-number', name: 'Add Page Numbers', icon: '🔢', description: 'Number your pages' },
  { id: 'compress', name: 'Compress PDF', icon: '🗜️', description: 'Reduce file size' },
  { id: 'watermark', name: 'Add Watermark', icon: '💧', description: 'Protect your document' },
  { id: 'image-to-pdf', name: 'Images to PDF', icon: '🖼️', description: 'Convert images to PDF' }
];

function App() {
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Every tool you need to work with PDFs
          </h1>
          <p className="text-xl text-gray-600">
            Free, secure, and easy to use
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onClick={() => setSelectedTool(tool)} 
            />
          ))}
        </div>
      </main>

      {selectedTool && (
        <ToolModal 
          tool={selectedTool} 
          onClose={() => setSelectedTool(null)} 
        />
      )}
    </div>
  );
}

export default App;
