const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {

  console.log(id, userId, role, type, techstack, createdAt);
  
  // Format date for display
  const formattedDate = new Date(createdAt as string).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white truncate">{role}</h3>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-blue-200">
            {type}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mt-2">
            {techstack && techstack.map((tech: string, index: number) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs rounded-md bg-gray-700 text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
          <span>ID: {id.substring(0, 8)}...</span>
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="bg-gray-900 px-5 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-400">User: {userId.substring(0, 8)}...</span>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};
export default InterviewCard;