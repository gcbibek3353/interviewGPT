import { getRandomInterviewCover } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const InterviewCard = ({
  id,
  userId,
  coverImage,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {

  // Format date for display
  const formattedDate = new Date(createdAt as string).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden group-hover:border-purple-400 transition-colors">
              <Image 
                src={coverImage} 
                alt={role} 
                layout="fill"
                objectFit="cover"
                className="transition-opacity duration-300 group-hover:opacity-90"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-lg font-bold text-white truncate hover:text-purple-400 transition-colors">
                {role}
              </h3>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                type === 'technical' 
                  ? 'bg-blue-900/50 text-blue-300' 
                  : type === 'behavioral' 
                    ? 'bg-purple-900/50 text-purple-300'
                    : 'bg-green-900/50 text-green-300'
              }`}>
                {type}
              </span>
            </div>
            
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {techstack && techstack.map((tech: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 text-xs rounded-md bg-gray-700/80 text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-5 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="font-mono">ID: {id.substring(0, 8)}...</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 px-6 py-4 border-t border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-mono">User: {userId.substring(0, 8)}...</span>
        </div>
        <Link 
          href={`/dashboard/interview/${id}`}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-purple-500/20"
        >
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
export default InterviewCard;