const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-950 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-base">
          🍽️
        </div>
      </div>
      <p className="text-gray-500 text-sm animate-pulse">Loading delicious meals...</p>
    </div>
  );
};

export default LoadingSpinner;