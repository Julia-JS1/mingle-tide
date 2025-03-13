
import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
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
  Eye
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
  const [showActions, setShowActions] = useState(false);

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

    // Process document references
    documentRefs.forEach(docRef => {
      formattedContent = formattedContent.replace(
        new RegExp(`#${docRef}\\b`, 'g'),
        `<span class="text-iflows-primary font-medium cursor-pointer hover:underline">#${docRef}</span>`
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

  return (
    <div 
      className={`group relative flex gap-3 py-3 transition-all duration-200 ${isOwn ? 'justify-end' : 'justify-start'} message-animation`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
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

        {/* Message content */}
        <div 
          className={`mt-1 rounded-lg px-4 py-2.5 shadow-sm
            ${isOwn 
              ? 'bg-gradient-to-r from-iflows-primary to-iflows-secondary text-white' 
              : 'bg-muted/70 backdrop-blur-sm text-foreground'
            }`}
        >
          {renderContent()}
          
          {/* Task created badge */}
          {taskCreated && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-iflows-primary/10 text-iflows-primary border-iflows-primary/20">
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
                    ${isOwn ? 'bg-iflows-secondary/30' : 'bg-background/80'}`}
                >
                  <PaperclipIcon className="h-4 w-4" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs opacity-70">{(file.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {Object.keys(reactions).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(reactions).map(([emoji, reaction]) => (
              <Badge 
                key={emoji} 
                variant="outline" 
                className="bg-background/80 hover:bg-muted cursor-pointer transition-colors shadow-sm"
                onClick={() => onReact?.(id, emoji)}
              >
                {emoji} {reaction.count}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Message actions */}
      <div 
        className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2
          flex items-center gap-1 opacity-0 transition-opacity duration-200
          ${showActions ? 'opacity-100' : ''} ${isOwn ? 'flex-row-reverse' : ''}`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary transition-colors"
                onClick={() => onReply?.(id)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Răspunde</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary transition-colors"
                onClick={() => onReact?.(id, "👍")}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reacționează</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Create task button (conditionally shown) */}
        {content.toLowerCase().includes("te rog să") && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full text-iflows-primary hover:bg-iflows-primary/10 transition-colors"
                  onClick={() => onCreateTask?.(id)}
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Crează sarcină</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Document linking button (conditionally shown) */}
        {documentRefs.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full text-iflows-primary hover:bg-iflows-primary/10 transition-colors"
                  onClick={() => onLink?.(id, documentRefs[0])}
                >
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Asociază cu document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* More options dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isOwn ? "start" : "end"} className="w-48">
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
            <DropdownMenuItem onClick={() => onCopyLink?.(id)}>
              <Link className="mr-2 h-4 w-4" />
              <span>Copiază link</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRemind?.(id)}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Amintește-mi</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onForward?.(id)}>
              <Forward className="mr-2 h-4 w-4" />
              <span>Redirecționează</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMarkUnread?.(id)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Marchează necitit</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatMessage;
