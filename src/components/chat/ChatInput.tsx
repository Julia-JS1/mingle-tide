
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Send, 
  PaperclipIcon, 
  Smile, 
  Hash, 
  AtSign, 
  X,
  ImageIcon,
  FileIcon,
  MicIcon,
  VideoIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ChatInputProps {
  replyToMessage?: {
    id: string;
    sender: {
      name: string;
    };
    content: string;
  };
  clearReplyTo: () => void;
  onSendMessage: (content: string, attachments: File[]) => void;
  availableUsers: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  availableDocuments: Array<{
    id: string;
    type: string;
    title: string;
  }>;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  replyToMessage,
  clearReplyTo,
  onSendMessage,
  availableUsers,
  availableDocuments,
  isLoading = false,
}) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [documentFilter, setDocumentFilter] = useState('');
  const [currentCursorPosition, setCurrentCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);
  
  // Track cursor position for mentions and document references
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setCurrentCursorPosition(e.target.selectionStart);
    
    // Check for mention trigger
    const mentionTriggerPosition = newMessage.lastIndexOf('@', currentCursorPosition);
    const isTriggeredForMention = 
      mentionTriggerPosition !== -1 && 
      (mentionTriggerPosition === 0 || newMessage[mentionTriggerPosition - 1] === ' ') &&
      mentionTriggerPosition < currentCursorPosition;
    
    if (isTriggeredForMention) {
      const filter = newMessage.substring(mentionTriggerPosition + 1, currentCursorPosition);
      setMentionFilter(filter);
      setShowMentionDropdown(true);
      setShowDocumentDropdown(false);
    } else {
      setShowMentionDropdown(false);
    }
    
    // Check for document reference trigger
    const docTriggerPosition = newMessage.lastIndexOf('#', currentCursorPosition);
    const isTriggeredForDoc = 
      docTriggerPosition !== -1 && 
      (docTriggerPosition === 0 || newMessage[docTriggerPosition - 1] === ' ') &&
      docTriggerPosition < currentCursorPosition;
    
    if (isTriggeredForDoc) {
      const filter = newMessage.substring(docTriggerPosition + 1, currentCursorPosition);
      setDocumentFilter(filter);
      setShowDocumentDropdown(true);
      setShowMentionDropdown(false);
    } else {
      setShowDocumentDropdown(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter without shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    // Escape to close dropdowns
    if (e.key === 'Escape') {
      setShowMentionDropdown(false);
      setShowDocumentDropdown(false);
      setShowEmojiPicker(false);
    }
  };
  
  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message.trim(), files);
      setMessage('');
      setFiles([]);
      setShowEmojiPicker(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const insertMention = (user: { name: string }) => {
    if (textareaRef.current) {
      const mentionTriggerPosition = message.lastIndexOf('@', currentCursorPosition);
      const beforeMention = message.substring(0, mentionTriggerPosition);
      const afterMention = message.substring(currentCursorPosition);
      
      const newMessage = `${beforeMention}@${user.name} ${afterMention}`;
      setMessage(newMessage);
      
      // Set cursor position after the inserted mention
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = mentionTriggerPosition + user.name.length + 2; // +2 for @ and space
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          setCurrentCursorPosition(newCursorPosition);
        }
      }, 0);
      
      setShowMentionDropdown(false);
    }
  };
  
  const insertDocumentReference = (doc: { id: string }) => {
    if (textareaRef.current) {
      const docTriggerPosition = message.lastIndexOf('#', currentCursorPosition);
      const beforeDoc = message.substring(0, docTriggerPosition);
      const afterDoc = message.substring(currentCursorPosition);
      
      const newMessage = `${beforeDoc}#${doc.id} ${afterDoc}`;
      setMessage(newMessage);
      
      // Set cursor position after the inserted document reference
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = docTriggerPosition + doc.id.length + 2; // +2 for # and space
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          setCurrentCursorPosition(newCursorPosition);
        }
      }, 0);
      
      setShowDocumentDropdown(false);
    }
  };
  
  const insertEmoji = (emoji: string) => {
    if (textareaRef.current) {
      const newMessage = message + emoji;
      setMessage(newMessage);
      setShowEmojiPicker(false);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };
  
  // Filter users and documents based on input
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );
  
  const filteredDocuments = availableDocuments.filter(doc => 
    doc.id.toLowerCase().includes(documentFilter.toLowerCase()) || 
    doc.title.toLowerCase().includes(documentFilter.toLowerCase())
  );
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (type.includes('video')) return <VideoIcon className="h-4 w-4" />;
    if (type.includes('audio')) return <MicIcon className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <div className="border-t bg-background p-3">
      {/* Reply to message */}
      {replyToMessage && (
        <div className="mb-2 flex items-center justify-between rounded bg-muted/50 p-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Răspuns către</span>
            <span className="font-medium">{replyToMessage.sender.name}</span>
            <span className="truncate max-w-[150px]">{replyToMessage.content}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={clearReplyTo}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Attached files preview */}
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="flex items-center gap-1 pl-2 pr-1 py-1"
            >
              {getFileIcon(file.type)}
              <span className="truncate max-w-[100px]">{file.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Message input area */}
      <div
        className="relative flex items-end gap-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Scrie un mesaj..."
          className="min-h-[40px] max-h-[120px] pr-10 resize-none"
          disabled={isLoading}
        />
        
        {/* Input actions */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Adaugă emoji</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={handleFileClick}
                >
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Atașează fișier</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    setMessage(prev => prev + '@');
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.focus();
                        setCurrentCursorPosition(textareaRef.current.selectionStart);
                        setShowMentionDropdown(true);
                      }
                    }, 0);
                  }}
                >
                  <AtSign className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Menționează pe cineva</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => {
                    setMessage(prev => prev + '#');
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.focus();
                        setCurrentCursorPosition(textareaRef.current.selectionStart);
                        setShowDocumentDropdown(true);
                      }
                    }, 0);
                  }}
                >
                  <Hash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Referință document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Send button */}
        <Button 
          type="button"
          size="icon"
          className="flex-shrink-0 bg-iflows-primary h-10 w-10 rounded-full hover:bg-iflows-secondary disabled:opacity-50"
          onClick={handleSend}
          disabled={isLoading || (!message.trim() && files.length === 0)}
        >
          <Send className="h-4 w-4" />
        </Button>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
        />
      </div>
      
      {/* Mention dropdown */}
      {showMentionDropdown && (
        <div className="absolute bottom-full left-4 mb-2 w-60 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md z-10">
          <div className="p-1">
            {filteredUsers.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                Nu s-au găsit utilizatori
              </div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer"
                  onClick={() => insertMention(user)}
                >
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-muted">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-iflows-primary text-white text-xs">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Document dropdown */}
      {showDocumentDropdown && (
        <div className="absolute bottom-full left-4 mb-2 w-60 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md z-10">
          <div className="p-1">
            {filteredDocuments.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                Nu s-au găsit documente
              </div>
            ) : (
              filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer"
                  onClick={() => insertDocumentReference(doc)}
                >
                  <Hash className="h-4 w-4 text-iflows-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{doc.id}</span>
                    <span className="text-xs text-muted-foreground">{doc.title}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 mb-2 p-2 w-64 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md z-10">
          <div className="grid grid-cols-8 gap-1">
            {['😊', '😂', '👍', '👏', '❤️', '🎉', '🙏', '😍', 
              '🤔', '😎', '🔥', '✅', '❌', '⚠️', '🚀', '💯',
              '👀', '💪', '🤝', '👋', '🙌', '🤞', '👌', '🙄'].map(emoji => (
              <button
                key={emoji}
                className="h-8 w-8 flex items-center justify-center text-lg hover:bg-accent rounded cursor-pointer"
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
