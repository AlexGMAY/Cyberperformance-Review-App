import React from 'react';

const ResponseStatistics = ({ stats = {} }) => {
  // Provide default values for stats fields to handle undefined cases
  const { total = 0, responded = 0, breakdown = {} } = stats;
  const responseRate = total > 0 ? ((responded / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-6">      
      {/* Stats Row */}
      <div className="flex justify-between  space-x-8">
        {/* Total Reviews */}
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Total Reviews</h4>
          <p className="text-3xl text-indigo-600 font-bold">{total}</p>
        </div>

        {/* Response Rate with Colorful Circular Progress Bar */}
        <div className="relative text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Response Rate</h4>
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-full h-full text-gray-200" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" /> {/* Green */}
                  <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
                  <stop offset="100%" stopColor="#F472B6" /> {/* Pink */}
                </linearGradient>
              </defs>
              <path
                className="stroke-current text-gray-200"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="stroke-[url(#gradient)]"
                strokeDasharray={`${responseRate}, 100`}
                strokeWidth="4"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-500">
              {responseRate}%
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Rating Breakdown</h4>
          <div className="space-y-1 text-gray-600">
            {[5, 4, 3, 2, 1].map((rating) => (
              <p key={rating} className="flex justify-between">
                <span>{rating}★</span>
                <span className="font-medium">{breakdown[rating] || 0}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseStatistics;
