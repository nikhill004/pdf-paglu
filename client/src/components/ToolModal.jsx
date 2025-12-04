import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { getApiUrl } from '../config';

function ToolModal({ tool, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => setFiles(acceptedFiles),
    accept: getAcceptTypes(),
    multiple: tool.id === 'merge' || tool.id === 'image-to-pdf'
  });

  function getAcceptTypes() {
    if (tool.id === 'image-to-pdf') return { 'image/*': ['.jpg', '.jpeg', '.png'] };
    if (tool.id === 'word-to-pdf') return { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] };
    return { 'application/pdf': ['.pdf'] };
  }

  async function handleSubmit() {
    if (files.length === 0) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      
      if (tool.id === 'merge' || tool.id === 'image-to-pdf') {
        files.forEach(file => formData.append(tool.id === 'merge' ? 'pdfs' : 'images', file));
      } else {
        formData.append(tool.id === 'word-to-pdf' ? 'file' : 'pdf', files[0]);
      }
      
      Object.keys(options).forEach(key => formData.append(key, options[key]));
      
      const endpoint = getEndpoint();
      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResult(response.data);
    } catch (error) {
      setResult({ error: error.response?.data?.error || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  function getEndpoint() {
    const endpoints = {
      'split': '/api/split',
      'merge': '/api/merge',
      'word-to-pdf': '/api/convert/word-to-pdf',
      'pdf-to-word': '/api/convert/pdf-to-word',
      'page-number': '/api/page-number',
      'compress': '/api/compress',
      'watermark': '/api/watermark',
      'image-to-pdf': '/api/image-to-pdf'
    };
    return getApiUrl(endpoints[tool.id]);
  }

  function renderOptions() {
    if (tool.id === 'split') {
      return (
        <input
          type="text"
          placeholder="e.g., 1-3,5,7-9"
          className="w-full px-4 py-2 border rounded-lg"
          onChange={e => setOptions({ ranges: e.target.value })}
        />
      );
    }
    
    if (tool.id === 'watermark') {
      return (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Watermark text"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={e => setOptions({ ...options, text: e.target.value })}
          />
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            defaultValue="0.3"
            className="w-full"
            onChange={e => setOptions({ ...options, opacity: e.target.value })}
          />
        </div>
      );
    }
    
    if (tool.id === 'page-number') {
      return (
        <div className="space-y-3">
          <select
            className="w-full px-4 py-2 border rounded-lg"
            onChange={e => setOptions({ ...options, position: e.target.value })}
          >
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
          </select>
        </div>
      );
    }
    
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{tool.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-5xl mb-4">{tool.icon}</div>
            <p className="text-lg text-gray-600">
              {isDragActive ? 'Drop files here' : 'Drag & drop or click to select'}
            </p>
            {files.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                {files.length} file(s) selected
              </div>
            )}
          </div>

          {renderOptions()}

          <button
            onClick={handleSubmit}
            disabled={loading || files.length === 0}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processing...' : `Process ${tool.name}`}
          </button>

          {result && (
            <div className={`p-4 rounded-lg ${result.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {result.error ? (
                <p>Error: {result.error}</p>
              ) : (
                <div>
                  <p className="font-semibold mb-2">Success!</p>
                  <a
                    href={getApiUrl(result.downloadUrl)}
                    download
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Download File
                  </a>
                  {result.reduction && (
                    <p className="mt-2 text-sm">Size reduced by {result.reduction}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToolModal;
