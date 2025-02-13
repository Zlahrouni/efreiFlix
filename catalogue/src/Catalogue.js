import React from 'react';

const Catalogue = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Catalogue</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Empty list placeholder */}
        <div className="p-4 border rounded-lg bg-gray-100">
          <p className="text-gray-500">No items to display</p>
        </div>
      </div>
    </div>
  );
};

export default Catalogue; 