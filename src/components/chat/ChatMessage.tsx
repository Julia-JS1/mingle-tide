
import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { toast } from "sonner";
import TaskModal, { TaskData } from './TaskModal';
import MessageActions from './MessageActions';
import { 
  MessageSquare, 
  PaperclipIcon, 
  CheckSquare,
  Plus,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  isLatestMessage = true,
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
  const [showActions, setShowActions] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const renderContent = () => {
    let formattedContent = content;
    
    // Process mentions (make them blue as in the screenshot)
    mentions.forEach(mention => {
      formattedContent = formattedContent.replace(
        new RegExp(`@${mention}\\b`, 'g'),
        `<span class="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 px-1 py-0.5 rounded font-medium">@${mention}</span>`
      );
    });

    // Process document references (make them purple with background as in the screenshot)
    documentRefs.forEach(docRef => {
      formattedContent = formattedContent.replace(
        new RegExp(`#${docRef}\\b`, 'g'),
        `<span class="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 px-1 py-0.5 rounded font-medium">#${docRef}</span>`
      );
    });

    // Check for task trigger phrases and format them
    const taskTriggerPhrases = ["te rog să", "îmi poți", "poți să", "ai putea să", "solicită"];
    taskTriggerPhrases.forEach(phrase => {
      if (content.toLowerCase().includes(phrase.toLowerCase())) {
        formattedContent = formattedContent.replace(
          new RegExp(`(${phrase})`, 'gi'),
          `<span class="font-medium text-slate-700 dark:text-slate-300">$1</span>`
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

  const hasTaskTrigger = ["te rog să", "îmi poți", "poți să", "ai putea să", "solicită"].some(
    phrase => content.toLowerCase().includes(phrase.toLowerCase())
  );

  const hasMention = mentions.length > 0;
  const hasDocRef = documentRefs.length > 0;
  
  // Determine if we should show the create task button based on the screenshot content
  const shouldShowCreateTaskButton = (hasMention || hasDocRef || hasTaskTrigger) && !taskCreated;

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

        {shouldShowCreateTaskButton && !taskCreated && (
          <div className="mt-1">
            <Button 
              size="sm"
              variant="outline"
              className="bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={handleCreateTask}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Creează sarcină
            </Button>
          </div>
        )}

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

      {showActions && (
        <MessageActions
          isOwn={isOwn}
          messageId={id}
          documentRefs={documentRefs}
          taskCreated={taskCreated}
          onReply={onReply || (() => {})}
          onReact={onReact || (() => {})}
          onCreateTask={onCreateTask || (() => {})}
          onLink={onLink || (() => {})}
          onEdit={onEdit || (() => {})}
          onDelete={onDelete || (() => {})}
          onCopyLink={onCopyLink || (() => {})}
          onRemind={onRemind || (() => {})}
          onForward={onForward || (() => {})}
          onMarkUnread={onMarkUnread || (() => {})}
          onBookmark={onBookmark || (() => {})}
        />
      )}

      <TooltipProvider delayDuration={0}>
        {hasTaskTrigger && !taskCreated && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant={taskCreated ? "secondary" : "default"}
                className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} -translate-y-1/2
                  h-8 w-8 rounded-full transition-colors ${
                    taskCreated 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
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
