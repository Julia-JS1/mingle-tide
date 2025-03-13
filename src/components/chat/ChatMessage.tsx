import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import TaskModal, { TaskData } from './TaskModal';
import MessageActions from './MessageActions';
import { 
  MessageSquare, 
  PaperclipIcon, 
  CheckSquare,
  Plus,
  MessageCircleReply,
  Smile,
  MoreVertical,
  Reply,
  Forward,
  ChevronDown,
  BookmarkPlus,
  Edit,
  Trash2,
  Link,
  Clock,
  Eye
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  isLatestMessage?: boolean;
  hasReplies?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onCreateTask?: (messageId: string) => void;
  onLink?: (messageId: string, docRef: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onCopyLink?: (messageId: string) => void;
  onRemind?: (messageId: string, reminderTime: string) => void;
  onForward?: (messageId: string) => void;
  onMarkUnread?: (messageId: string) => void;
  onBookmark?: (messageId: string) => void;
  onScrollToReplies?: (messageId: string) => void;
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
  isLatestMessage = true,
  hasReplies = false,
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
  onScrollToReplies,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const navigate = useNavigate();

  const commonReactions = ["👍", "❤️", "😊", "😂", "👏", "🎉", "🙏", "🔥"];
  
  const reminderOptions = [
    { label: 'Peste 30 minute', value: '30m' },
    { label: 'Peste 1 oră', value: '1h' },
    { label: 'Peste 3 ore', value: '3h' },
    { label: 'Mâine dimineață', value: 'tomorrow' },
    { label: 'Săptămâna viitoare', value: 'nextweek' },
  ];

  const handleDocRefClick = (docRef: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.metaKey || event.ctrlKey) {
      if (docRef.startsWith('CMD')) {
        navigate(`/commands/${docRef}`);
        toast.info(`Navigare la comanda #${docRef}`);
      } else if (docRef.startsWith('PROD')) {
        navigate(`/products/${docRef}`);
        toast.info(`Navigare la produsul #${docRef}`);
      } else if (docRef.startsWith('OF')) {
        navigate(`/offers/${docRef}`);
        toast.info(`Navigare la oferta #${docRef}`);
      }
    }
  };

  const renderContent = () => {
    let formattedContent = content;
    
    mentions.forEach(mention => {
      formattedContent = formattedContent.replace(
        new RegExp(`@${mention}\\b`, 'g'),
        `<span class="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 px-1 py-0.5 rounded font-medium">@${mention}</span>`
      );
    });

    documentRefs.forEach(docRef => {
      formattedContent = formattedContent.replace(
        new RegExp(`#${docRef}\\b`, 'g'),
        `<span class="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 px-1 py-0.5 rounded font-medium cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/60" data-docref="${docRef}">#${docRef}</span>`
      );
    });

    const taskTriggerPhrases = ["te rog să", "îmi poți", "poți să", "ai putea să", "solicită"];
    taskTriggerPhrases.forEach(phrase => {
      if (content.toLowerCase().includes(phrase.toLowerCase())) {
        formattedContent = formattedContent.replace(
          new RegExp(`(${phrase})`, 'gi'),
          `<span class="font-medium text-slate-700 dark:text-slate-300">$1</span>`
        );
      }
    });

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: formattedContent }} 
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const docRef = target.getAttribute('data-docref');
          if (docRef) {
            handleDocRefClick(docRef, e);
          }
        }}
      />
    );
  };

  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true, locale: ro });

  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(id, emoji);
      toast.success(`Ai reacționat cu ${emoji} la mesajul lui ${sender.name}`);
    }
  };

  const handleCreateTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (taskData: TaskData) => {
    if (onCreateTask) {
      onCreateTask(id);
      toast.success(`Sarcină creată: ${taskData.title}`, {
        description: `Asignată către: ${taskData.assignee}, Termen: ${taskData.dueDate ? format(taskData.dueDate, "PPP", { locale: ro }) : 'Nespecificat'}`
      });
    }
  };

  const handleScrollToReplies = () => {
    if (onScrollToReplies) {
      onScrollToReplies(id);
      toast.info("Navigare la răspunsuri");
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(id);
      setIsOptionsOpen(false);
      toast.info(`Răspuns la mesajul lui ${sender.name}`);
    }
  };

  const handleForward = () => {
    if (onForward) {
      onForward(id);
      setIsOptionsOpen(false);
      toast.info("Mesaj redirecționat");
    }
  };

  const handleMoreOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleRemind = (time: string) => {
    if (onRemind) {
      onRemind(id, time);
      setIsReminderOpen(false);
      toast.success(`Vei primi o notificare ${getReminderLabel(time)}`);
    }
  };

  const getReminderLabel = (time: string): string => {
    switch(time) {
      case '30m': return 'peste 30 minute';
      case '1h': return 'peste 1 oră';
      case '3h': return 'peste 3 ore';
      case 'tomorrow': return 'mâine dimineață';
      case 'nextweek': return 'săptămâna viitoare';
      default: return 'la timpul specificat';
    }
  };

  const hasTaskTrigger = ["te rog să", "îmi poți", "poți să", "ai putea să", "solicită"].some(
    phrase => content.toLowerCase().includes(phrase.toLowerCase())
  );
  
  const isAvailabilityConfirmation = content.toLowerCase().includes("toate produsele sunt disponibile");
  
  const hasMention = mentions.length > 0;
  const hasDocRef = documentRefs.length > 0;
  
  const shouldShowCreateTaskButton = (hasMention || hasDocRef || hasTaskTrigger) && !taskCreated && !isAvailabilityConfirmation;

  return (
    <div 
      className={`group relative flex gap-3 py-3 transition-all duration-200 ${isOwn ? 'justify-end' : 'justify-start'} message-animation`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        if (!isOptionsOpen) {
          setShowActions(false);
        }
      }}
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

        <div className="relative">
          <div 
            className={`mt-1 rounded-lg px-4 py-2.5 shadow-sm
              ${isOwn 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-foreground' 
                : 'bg-white dark:bg-slate-800/70 text-foreground shadow-sm border border-slate-200 dark:border-slate-700/50'
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

            {attachments && attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((file) => (
                  <div 
                    key={file.id}
                    className={`flex items-center gap-2 rounded-md p-2 text-sm bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600/50`}
                  >
                    <PaperclipIcon className="h-4 w-4" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs opacity-70">{(file.size / 1024).toFixed(0)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div 
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-opacity ${showActions || isOptionsOpen ? 'opacity-100' : 'opacity-0'}`}
          >
            <Collapsible 
              open={isOptionsOpen} 
              onOpenChange={setIsOptionsOpen}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute right-0 top-8 z-50 w-auto">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => onReply?.(id)}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Răspunde</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => onForward?.(id)}
                        >
                          <Forward className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Redirecționează</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleReaction("👍")}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Reacționează</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="right" className="w-56 bg-white dark:bg-slate-800 z-50">
                        <DropdownMenuItem onClick={() => onBookmark?.(id)}>
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                          <span>Salvează</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => onCreateTask?.(id)} disabled={taskCreated}>
                          <CheckSquare className="mr-2 h-4 w-4" />
                          <span>{taskCreated ? "Sarcină creată" : "Creează sarcină"}</span>
                        </DropdownMenuItem>
                        
                        {isOwn && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit?.(id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editează</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={() => onDelete?.(id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Șterge</span>
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={() => onCopyLink?.(id)}>
                          <Link className="mr-2 h-4 w-4" />
                          <span>Copiază link</span>
                        </DropdownMenuItem>
                        
                        {documentRefs && documentRefs.length > 0 && (
                          <DropdownMenuItem onClick={() => onLink?.(id, documentRefs[0])}>
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
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={() => onMarkUnread?.(id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Marchează ca necitit</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipProvider>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {shouldShowCreateTaskButton && !taskCreated && (
          <div className="mt-1">
            <Button 
              size="sm"
              variant="outline"
              className="bg-purple-100 hover:bg-purple-200 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800/30 dark:text-purple-300 dark:hover:bg-purple-800/50"
              onClick={handleCreateTask}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Creează sarcină
            </Button>
          </div>
        )}

        <div className="mt-1 flex flex-wrap gap-1">
          {Object.keys(reactions).length > 0 && (
            Object.entries(reactions).map(([emoji, reaction]) => (
              <Badge 
                key={emoji} 
                variant="outline" 
                className="reaction-badge bg-white dark:bg-slate-800 hover:bg-muted shadow-sm"
                onClick={() => onReact?.(id, emoji)}
              >
                {emoji} {reaction.count}
              </Badge>
            ))
          )}
          
          {hasReplies && (
            <Badge 
              variant="outline" 
              className="reaction-badge bg-white dark:bg-slate-800 hover:bg-muted shadow-sm cursor-pointer"
              onClick={handleScrollToReplies}
            >
              <MessageCircleReply className="h-3 w-3 mr-1" /> 1
            </Badge>
          )}
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        {hasTaskTrigger && !taskCreated && !isAvailabilityConfirmation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={taskCreated ? "secondary" : "default"}
                className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} -translate-y-1/2
                  h-8 w-8 rounded-full transition-colors ${
                    taskCreated 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                onClick={handleCreateTask}
                disabled={taskCreated}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{taskCreated ? "Sarcină creată" : "Creează sarcină"}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
        messageContent={content}
        mentionedUser={mentions.length > 0 ? mentions[0] : undefined}
      />
    </div>
  );
};

export default ChatMessage;

