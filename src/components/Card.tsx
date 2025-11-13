export const Card = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className={`border border-gray-200 rounded-lg p-6 shadow-sm bg-white ${className}`}>
    {children}
  </div>
);
