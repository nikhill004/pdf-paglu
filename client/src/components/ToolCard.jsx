import React from 'react';

function ToolCard({ tool, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 text-center group hover:-translate-y-1"
    >
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
        {tool.icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {tool.name}
      </h3>
      <p className="text-gray-600 text-sm">
        {tool.description}
      </p>
    </div>
  );
}

export default ToolCard;
