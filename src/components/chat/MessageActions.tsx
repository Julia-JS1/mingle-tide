
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  Share,
  Reply,
  MessageCircleReply
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
  onRemind: (messageId: string, reminderTime: string) => void;
  onForward: (messageId: string) => void;
  onMarkUnread: (messageId: string) => void;
  onBookmark: (messageId: string) => void;
  position?: 'left' | 'right';
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
  onBookmark,
  position = 'left'
}) => {
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  
  const commonReactions = ["👍", "❤️", "😊", "😂", "👏", "🎉", "🙏", "🔥"];

  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji);
  };
  
  const handleRemind = (time: string) => {
    onRemind(messageId, time);
    setIsReminderOpen(false);
  };

  // Determine position classes based on the position prop
  const positionClasses = position === 'left'
    ? `${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'}`
    : 'right-0 translate-x-[calc(100%+0.5rem)]';

  const isRightSide = position === 'right';
  
  const reminderOptions = [
    { label: 'Peste 30 minute', value: '30m' },
    { label: 'Peste 1 oră', value: '1h' },
    { label: 'Peste 3 ore', value: '3h' },
    { label: 'Mâine dimineață', value: 'tomorrow' },
    { label: 'Săptămâna viitoare', value: 'nextweek' },
  ];

  return (
    <div 
      className={`absolute ${positionClasses} top-1/2 -translate-y-1/2
        opacity-100 transition-opacity z-10`}
    >
      {isRightSide ? (
        // Right side compact actions menu
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-md p-1 gap-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => onReply(messageId)}
                >
                  <Reply className="h-4 w-4" />
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
                  onClick={() => onForward(messageId)}
                >
                  <Forward className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Redirecționează</p>
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
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 z-50">
                <DropdownMenuItem onClick={() => onBookmark(messageId)}>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  <span>Salvează</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onCreateTask(messageId)} disabled={taskCreated}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  <span>{taskCreated ? "Sarcină creată" : "Creează sarcină"}</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
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
                
                <Popover open={isReminderOpen} onOpenChange={setIsReminderOpen}>
                  <PopoverTrigger asChild>
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      setIsReminderOpen(true);
                    }}>
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Amintește-mi</span>
                    </DropdownMenuItem>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 p-2" sideOffset={5}>
                    <div className="text-sm font-medium mb-2">Setează o notificare</div>
                    <div className="space-y-1">
                      {reminderOptions.map((option) => (
                        <button
                          key={option.value}
                          className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => handleRemind(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <DropdownMenuItem onClick={() => onMarkUnread(messageId)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Marchează ca necitit</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      ) : (
        // Left side vertical actions menu - keeping the same structure but simplified
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
                  <Reply className="h-4 w-4" />
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
              <DropdownMenuContent align={isOwn ? "start" : "end"} className="w-56 bg-white dark:bg-slate-800 z-50">
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
                  
                  <Popover open={isReminderOpen} onOpenChange={setIsReminderOpen}>
                    <PopoverTrigger asChild>
                      <DropdownMenuItem onClick={(e) => {
                        e.preventDefault();
                        setIsReminderOpen(true);
                      }}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Amintește-mi</span>
                      </DropdownMenuItem>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-56 p-2" sideOffset={5}>
                      <div className="text-sm font-medium mb-2">Setează o notificare</div>
                      <div className="space-y-1">
                        {reminderOptions.map((option) => (
                          <button
                            key={option.value}
                            className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => handleRemind(option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <DropdownMenuItem onClick={() => onMarkUnread(messageId)}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Marchează ca necitit</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default MessageActions;
