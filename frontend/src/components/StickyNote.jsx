import { Trash2, CheckCircle, XCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StickyNote = ({ note, onDelete, onStatusUpdate, isTeacher = false }) => {
  // Simple inline styles for colors
  const colorStyles = {
    yellow: { backgroundColor: '#fef3c7', borderColor: '#f59e0b' },
    blue: { backgroundColor: '#dbeafe', borderColor: '#3b82f6' },
    green: { backgroundColor: '#dcfce7', borderColor: '#10b981' },
    orange: { backgroundColor: '#fed7aa', borderColor: '#f97316' },
    pink: { backgroundColor: '#fce7f3', borderColor: '#ec4899' },
    purple: { backgroundColor: '#e9d5ff', borderColor: '#8b5cf6' }
  };
  
  const selectedStyle = colorStyles[note.color] || colorStyles.yellow;

  return (
    <div 
      className="relative p-4 rounded-xl border-2 shadow-note transition-all duration-300 hover:shadow-hover hover:-translate-y-1 group min-h-[200px] flex flex-col"
      style={selectedStyle}
    >
      {isTeacher && (
        <button
          onClick={() => onDelete(note.id)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      )}
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-lg">{note.studentName}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/60 px-2 py-1 rounded-full text-foreground">
              {note.category}
            </span>
            {/* Status indicator for all users */}
            {note.status && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                note.status === 'answered' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : note.status === 'important'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {note.status === 'answered' ? '✓ Answered' : 
                 note.status === 'important' ? '⭐ Important' : 
                 '⏳ Unanswered'}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-foreground text-sm leading-relaxed">
          {note.question}
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {isTeacher && onStatusUpdate && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={note.status === 'answered' ? 'default' : 'outline'}
              onClick={() => onStatusUpdate(note.id, 'answered')}
              className="h-6 w-6 p-0"
              title="Mark as answered"
            >
              <CheckCircle size={12} />
            </Button>
            <Button
              size="sm"
              variant={note.status === 'important' ? 'default' : 'outline'}
              onClick={() => onStatusUpdate(note.id, 'important')}
              className="h-6 w-6 p-0"
              title="Mark as important"
            >
              <Star size={12} />
            </Button>
            <Button
              size="sm"
              variant={note.status === 'unanswered' ? 'default' : 'outline'}
              onClick={() => onStatusUpdate(note.id, 'unanswered')}
              className="h-6 w-6 p-0"
              title="Mark as unanswered"
            >
              <XCircle size={12} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyNote;