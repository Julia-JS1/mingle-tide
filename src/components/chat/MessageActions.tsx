
import React from 'react';
import { Button } from '@/components/ui/button';
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
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

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    side="left"
    className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

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
        <TooltipPrimitive.Provider delayDuration={0}>
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => handleReaction("👍")}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </TooltipPrimitive.Trigger>
            <TooltipContent>
              <p>Apreciez</p>
            </TooltipContent>
          </TooltipPrimitive.Root>

          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onReply(messageId)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipPrimitive.Trigger>
            <TooltipContent>
              <p>Răspunde</p>
            </TooltipContent>
          </TooltipPrimitive.Root>

          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onForward(messageId)}
              >
                <Forward className="h-4 w-4" />
              </Button>
            </TooltipPrimitive.Trigger>
            <TooltipContent>
              <p>Redirecționează</p>
            </TooltipContent>
          </TooltipPrimitive.Root>

          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onBookmark(messageId)}
              >
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </TooltipPrimitive.Trigger>
            <TooltipContent>
              <p>Salvează</p>
            </TooltipContent>
          </TooltipPrimitive.Root>

          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => onCreateTask(messageId)}
                disabled={taskCreated}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </TooltipPrimitive.Trigger>
            <TooltipContent>
              <p>{taskCreated ? "Sarcină creată" : "Creează sarcină"}</p>
            </TooltipContent>
          </TooltipPrimitive.Root>

          <DropdownMenu>
            <TooltipPrimitive.Root>
              <TooltipPrimitive.Trigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipPrimitive.Trigger>
              <TooltipContent>
                <p>Mai multe</p>
              </TooltipContent>
            </TooltipPrimitive.Root>
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
        </TooltipPrimitive.Provider>
      </div>
    </div>
  );
};

export default MessageActions;
