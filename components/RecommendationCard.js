"use client";

export default function RecommendationCard({ title, icon, recommendation, description }) {
  // Map category titles to colors
  const categoryColors = {
    "Nutrition": {
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
      textColor: "text-green-800"
    },
    "Exercise": {
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      textColor: "text-blue-800"
    },
    "Self-Care": {
      bgColor: "bg-pink-100",
      borderColor: "border-pink-500",
      textColor: "text-pink-800"
    }
  };

  // Get colors based on title, default to primary if not found
  const colors = categoryColors[title] || {
    bgColor: "bg-primary-100",
    borderColor: "border-primary-500",
    textColor: "text-primary-800"
  };

  return (
    <div className={`rounded-lg shadow-sm ${colors.bgColor} border-l-4 ${colors.borderColor} p-4`}>
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className={`font-medium ${colors.textColor}`}>{title}</h3>
      </div>
      
      <h4 className="font-bold text-gray-900 mb-2">{recommendation}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
      
      <button 
        onClick={() => window.location.href = '/dashboard/recommendations'}
        className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-800 cursor-pointer"
      >
        See more
      </button>
    </div>
  );
}
