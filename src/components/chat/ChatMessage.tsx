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
  onBookmark?: (messageId: string) => void;
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
  onBookmark,
}) => {
  const [showActions, setShowActions] = useState(true);

  const renderContent = () => {
    let formattedContent = content;
    
    mentions.forEach(mention => {
      formattedContent = formattedContent.replace(
        new RegExp(`@${mention}\\b`, 'g'),
        `<span class="text-iflows-primary font-medium">@${mention}</span>`
      );
    });

    documentRefs.forEach(docRef => {
      formattedContent = formattedContent.replace(
        new RegExp(`#${docRef}\\b`, 'g'),
        `<span class="bg-iflows-primary/20 text-iflows-primary font-medium rounded px-1 py-0.5 cursor-pointer hover:underline">#${docRef}</span>`
      );
    });

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

  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true, locale: ro });

  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(id, emoji);
      toast.success(`Ai reacționat cu ${emoji} la mesajul lui ${sender.name}`);
    }
  };

  const handleCreateTask = () => {
    if (onCreateTask) {
      onCreateTask(id);
      toast.success("Sarcină creată cu succes!");
    }
  };

  const hasTaskTrigger = ["te rog să", "îmi poți", "poți să", "ai putea să"].some(
    phrase => content.toLowerCase().includes(phrase.toLowerCase())
  );

  const commonReactions = ["👍", "❤️", "😊", "😂", "👏", "🎉", "🙏", "🔥"];

  return (
    <div 
      className={`group relative flex gap-3 py-3 transition-all duration-200 ${isOwn ? 'justify-end' : 'justify-start'} message-animation`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(true)}
    >
      {!isOwn && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="border-2 border-background shadow-sm">
            <img src={sender.avatar} alt={sender.name} className="aspect-square h-full w-full object-cover" />
          </Avatar>
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {replyTo && (
          <div className={`mb-1 text-xs text-muted-foreground flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 ${isOwn ? 'self-end' : 'self-start'}`}>
            <MessageSquare className="h-3 w-3" />
            <span>Răspuns către <span className="font-medium">{replyToSender}</span>:</span>
            <span className="truncate max-w-[150px]">{replyToContent}</span>
          </div>
        )}

        <div className={`flex items-center gap-2 text-sm ${isOwn ? 'flex-row-reverse' : ''}`}>
          {!isOwn && <span className="font-medium">{sender.name}</span>}
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
          {edited && <span className="text-xs text-muted-foreground">(editat)</span>}
        </div>

        <div 
          className={`mt-1 rounded-lg px-4 py-2.5 shadow-sm
            ${isOwn 
              ? 'bg-slate-200 dark:bg-slate-800 text-foreground' 
              : 'bg-muted/70 backdrop-blur-sm text-foreground'
            }`}
        >
          {renderContent()}
          
          {taskCreated && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30">
                <CheckSquare className="mr-1 h-3 w-3" />
                Sarcină creată
              </Badge>
            </div>
          )}

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

      <div 
        className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} bottom-0 translate-y-1/2
          opacity-0 group-hover:opacity-100 transition-opacity z-10`}
      >
        <div className="flex items-center bg-white dark:bg-slate-800 backdrop-blur-sm rounded-full shadow-md">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => handleReaction("👍")}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => handleReaction("❤️")}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => handleReaction("😊")}
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => onReply?.(id)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => onForward?.(id)}
          >
            <Forward className="h-4 w-4" />
          </Button>
          <HoverCard openDelay={0} closeDelay={200}>
            <HoverCardTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent align={isOwn ? "start" : "end"} className="p-2 w-[200px] rounded-xl">
              <div className="grid grid-cols-3 gap-1">
                {commonReactions.map(emoji => (
                  <Button 
                    key={emoji}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => handleReaction(emoji)}
                  >
                    <span className="text-lg">{emoji}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-2 space-y-1">
                {isOwn && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start" 
                      onClick={() => onEdit?.(id)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editează</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-destructive" 
                      onClick={() => onDelete?.(id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Șterge</span>
                    </Button>
                  </>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => onBookmark?.(id)}
                >
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  <span>Salvează</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => onCopyLink?.(id)}
                >
                  <Link className="mr-2 h-4 w-4" />
                  <span>Copiază link</span>
                </Button>
                {documentRefs.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start" 
                    onClick={() => onLink?.(id, documentRefs[0])}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    <span>Asociază cu #{documentRefs[0]}</span>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => onRemind?.(id)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Amintește-mi</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start" 
                  onClick={() => onMarkUnread?.(id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Marchează necitit</span>
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

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
