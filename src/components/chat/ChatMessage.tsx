
import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckSquare, 
  PaperclipIcon, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Link, 
  Clock, 
  Forward, 
  Eye,
  Heart,
  Smile,
  Target,
  Share,
  BookmarkPlus
} from 'lucide-react';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface MessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  isOwn?: boolean;
  isRead?: boolean;
  edited?: boolean;
  attachments?: Attachment[];
  reactions?: Record<string, Reaction>;
  replyTo?: string;
  replyToContent?: string;
  replyToSender?: string;
  mentions?: string[];
  documentRefs?: string[];
  taskCreated?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onCreateTask?: (messageId: string) => void;
  onLink?: (messageId: string, docRef: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onCopyLink?: (messageId: string) => void;
  onRemind?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
  onMarkUnread?: (messageId: string) => void;
}

const ChatMessage: React.FC<MessageProps> = ({
  id,
  content,
  sender,
  timestamp,
  isOwn = false,
  isRead = true,
  edited = false,
  attachments = [],
  reactions = {},
  replyTo,
  replyToContent,
  replyToSender,
  mentions = [],
  documentRefs = [],
  taskCreated = false,
  onReply,
  onReact,
  onCreateTask,
  onLink,
  onEdit,
  onDelete,
  onCopyLink,
  onRemind,
  onForward,
  onMarkUnread,
}) => {
  const [showActions, setShowActions] = useState(true); // Always show actions for better visibility
  const [showReactionOptions, setShowReactionOptions] = useState(false);

  // Parse and format message content to highlight mentions and document references
  const renderContent = () => {
    let formattedContent = content;
    
    // Process mentions
    mentions.forEach(mention => {
      formattedContent = formattedContent.replace(
        new RegExp(`@${mention}\\b`, 'g'),
        `<span class="text-iflows-primary font-medium">@${mention}</span>`
      );
    });

    // Process document references with improved visibility
    documentRefs.forEach(docRef => {
      formattedContent = formattedContent.replace(
        new RegExp(`#${docRef}\\b`, 'g'),
        `<span class="bg-iflows-primary/20 text-iflows-primary font-medium rounded px-1 py-0.5 cursor-pointer hover:underline">#${docRef}</span>`
      );
    });

    // If this is a potential task, highlight the task trigger phrases
    const taskTriggerPhrases = ["te rog să", "îmi poți", "poți să", "ai putea să"];
    taskTriggerPhrases.forEach(phrase => {
      if (content.toLowerCase().includes(phrase.toLowerCase())) {
        formattedContent = formattedContent.replace(
          new RegExp(`(${phrase})`, 'gi'),
          `<span class="text-iflows-primary font-medium">$1</span>`
        );
      }
    });

    return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

  // Format message time
  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true, locale: ro });

  // Helper function for handling reactions with visual feedback
  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(id, emoji);
      toast.success(`Ai reacționat cu ${emoji} la mesajul lui ${sender.name}`);
    }
  };

  // Helper function for task creation with visual feedback
  const handleCreateTask = () => {
    if (onCreateTask) {
      onCreateTask(id);
      toast.success("Sarcină creată cu succes!");
    }
  };

  // Check if this message contains task trigger phrases
  const hasTaskTrigger = ["te rog să", "îmi poți", "poți să", "ai putea să"].some(
    phrase => content.toLowerCase().includes(phrase.toLowerCase())
  );

  // Common reaction emojis
  const commonReactions = ["👍", "❤️", "😊", "😂", "👏", "🎉", "🙏", "🔥"];

  return (
    <div 
      className={`group relative flex gap-3 py-3 transition-all duration-200 ${isOwn ? 'justify-end' : 'justify-start'} message-animation`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(true)} // Keep actions visible even on mouse leave
    >
      {!isOwn && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="border-2 border-background shadow-sm">
            <img src={sender.avatar} alt={sender.name} className="aspect-square h-full w-full object-cover" />
          </Avatar>
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Reply reference if this is a reply */}
        {replyTo && (
          <div className={`mb-1 text-xs text-muted-foreground flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 ${isOwn ? 'self-end' : 'self-start'}`}>
            <MessageSquare className="h-3 w-3" />
            <span>Răspuns către <span className="font-medium">{replyToSender}</span>:</span>
            <span className="truncate max-w-[150px]">{replyToContent}</span>
          </div>
        )}

        {/* Message header */}
        <div className={`flex items-center gap-2 text-sm ${isOwn ? 'flex-row-reverse' : ''}`}>
          {!isOwn && <span className="font-medium">{sender.name}</span>}
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
          {edited && <span className="text-xs text-muted-foreground">(editat)</span>}
        </div>

        {/* Message content - using a more visible color scheme for own messages */}
        <div 
          className={`mt-1 rounded-lg px-4 py-2.5 shadow-sm
            ${isOwn 
              ? 'bg-slate-200 dark:bg-slate-800 text-foreground' 
              : 'bg-muted/70 backdrop-blur-sm text-foreground'
            }`}
        >
          {renderContent()}
          
          {/* Task created badge */}
          {taskCreated && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30">
                <CheckSquare className="mr-1 h-3 w-3" />
                Sarcină creată
              </Badge>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {attachments.map((file) => (
                <div 
                  key={file.id}
                  className={`flex items-center gap-2 rounded-md p-2 text-sm
                    ${isOwn ? 'bg-white/60 dark:bg-slate-700/60' : 'bg-white/60 dark:bg-slate-800/60'}`}
                >
                  <PaperclipIcon className="h-4 w-4" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs opacity-70">{(file.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reactions - improved visibility */}
        {Object.keys(reactions).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(reactions).map(([emoji, reaction]) => (
              <Badge 
                key={emoji} 
                variant="outline" 
                className="reaction-badge bg-white dark:bg-slate-800 hover:bg-muted shadow-sm"
                onClick={() => onReact?.(id, emoji)}
              >
                {emoji} {reaction.count}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* NEW HOVER CARD FOR REACTIONS - matches the design in the image */}
      <div className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} bottom-0 translate-y-1/2
          flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-md opacity-100 transition-opacity z-10`}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-xs px-3 py-1.5 h-auto"
            >
              Add reaction...
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 w-auto bg-white border shadow-xl rounded-full flex items-center gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full hover:bg-slate-100"
              onClick={() => handleReaction("👍")}
            >
              <Target className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full hover:bg-slate-100"
              onClick={() => handleReaction("😊")}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full hover:bg-slate-100"
              onClick={() => onReply?.(id)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full hover:bg-slate-100"
              onClick={() => onForward?.(id)}
            >
              <Forward className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full hover:bg-slate-100"
              onClick={() => onCopyLink?.(id)}
            >
              <BookmarkPlus className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full hover:bg-slate-100"
              onClick={() => {
                if (onLink && documentRefs.length > 0) {
                  onLink(id, documentRefs[0]);
                }
              }}
            >
              <Link className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-10 w-10 rounded-full hover:bg-slate-100"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isOwn && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit?.(id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editează</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete?.(id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Șterge</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onRemind?.(id)}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Amintește-mi</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMarkUnread?.(id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Marchează necitit</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Task creation button - made more visible and always showing when task phrases detected */}
      {hasTaskTrigger && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={taskCreated ? "secondary" : "default"}
                className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} -translate-y-1/2
                  h-8 w-8 rounded-full transition-colors ${
                    taskCreated 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : "bg-iflows-primary text-white hover:bg-iflows-secondary animate-pulse-slow"
                  }`}
                onClick={handleCreateTask}
                disabled={taskCreated}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{taskCreated ? "Sarcină creată" : "Crează sarcină"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ChatMessage;
