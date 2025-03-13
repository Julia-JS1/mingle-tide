
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckSquare, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Link, 
  Clock, 
  Forward, 
  Eye,
  BookmarkPlus,
  Share
} from 'lucide-react';

interface MessageActionsProps {
  isOwn: boolean;
  messageId: string;
  documentRefs: string[];
  taskCreated?: boolean;
  onReply: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onCreateTask: (messageId: string) => void;
  onLink: (messageId: string, docRef: string) => void;
  onEdit: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onCopyLink: (messageId: string) => void;
  onRemind: (messageId: string) => void;
  onForward: (messageId: string) => void;
  onMarkUnread: (messageId: string) => void;
  onBookmark: (messageId: string) => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  isOwn,
  messageId,
  documentRefs,
  taskCreated,
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
  onBookmark
}) => {
  const commonReactions = ["👍", "❤️", "😊", "😂", "👏", "🎉", "🙏", "🔥"];

  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji);
  };

  return (
    <div 
      className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2
        opacity-100 transition-opacity z-10`}
    >
      <div className="flex flex-col items-center bg-white dark:bg-slate-800 rounded-lg shadow-md p-1 gap-1">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => handleReaction("👍")}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Apreciez</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onReply(messageId)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Răspunde</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onForward(messageId)}
              >
                <Forward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Redirecționează</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onBookmark(messageId)}
              >
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Salvează</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onCreateTask(messageId)}
                disabled={taskCreated}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{taskCreated ? "Sarcină creată" : "Creează sarcină"}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Mai multe</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align={isOwn ? "start" : "end"} className="w-56">
              <div className="p-2 grid grid-cols-4 gap-1">
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
              <DropdownMenuSeparator />
              <div className="space-y-1 p-1">
                {isOwn && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit(messageId)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editează</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => onDelete(messageId)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Șterge</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onBookmark(messageId)}>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  <span>Salvează</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopyLink(messageId)}>
                  <Link className="mr-2 h-4 w-4" />
                  <span>Copiază link</span>
                </DropdownMenuItem>
                {documentRefs && documentRefs.length > 0 && (
                  <DropdownMenuItem onClick={() => onLink(messageId, documentRefs[0])}>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Asociază cu #{documentRefs[0]}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onRemind(messageId)}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Amintește-mi</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMarkUnread(messageId)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Marchează ca necitit</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MessageActions;
