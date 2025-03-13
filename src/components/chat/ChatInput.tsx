
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  Smile, 
  PaperclipIcon, 
  Send, 
  AtSign,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface EmojiCategoryProps {
  title: string;
  emojis: string[];
  onSelectEmoji: (emoji: string) => void;
}

const EmojiCategory: React.FC<EmojiCategoryProps> = ({ title, emojis, onSelectEmoji }) => (
  <div className="mb-4">
    <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
    <div className="grid grid-cols-8 gap-1">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-lg transition-colors"
          onClick={() => onSelectEmoji(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
);

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Document {
  id: string;
  type: string;
  title: string;
}

interface ChatInputProps {
  replyToMessage?: {
    id: string;
    sender: {
      name: string;
    };
    content: string;
  };
  clearReplyTo?: () => void;
  onSendMessage: (content: string, attachments: File[]) => void;
  availableUsers: User[];
  availableDocuments: Document[];
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
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [showDocumentMenu, setShowDocumentMenu] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [documentSearch, setDocumentSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 });
  const [documentPosition, setDocumentPosition] = useState({ start: 0, end: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common emoji sets
  const commonEmojis = {
    recent: ['👍', '❤️', '😊', '✅', '👏', '🎉', '🙏', '💯'],
    reactions: ['👍', '❤️', '😊', '😂', '🙌', '👏', '🔥', '✅'],
    objects: ['📎', '📂', '📅', '📊', '📈', '📝', '💼', '🔒'],
    symbols: ['✅', '❌', '⭐', '❓', '❗', '⚠️', '🔴', '🟢'],
  };

  // Update cursor position whenever the message changes
  useEffect(() => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, [message]);

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle message submission
  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
    }
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for @ character to trigger mentions
    if (e.key === '@') {
      setShowMentionMenu(true);
      setMentionSearch('');
      setMentionPosition({ 
        start: textareaRef.current?.selectionStart || 0, 
        end: (textareaRef.current?.selectionStart || 0) + 1 
      });
    }
    
    // Check for # character to trigger document references
    if (e.key === '#') {
      setShowDocumentMenu(true);
      setDocumentSearch('');
      setDocumentPosition({ 
        start: textareaRef.current?.selectionStart || 0, 
        end: (textareaRef.current?.selectionStart || 0) + 1 
      });
    }

    // Close menus if Escape is pressed
    if (e.key === 'Escape') {
      setShowMentionMenu(false);
      setShowDocumentMenu(false);
    }

    // Submit on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle input changes and track @ mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Track cursor position
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }

    // If mention menu is open, update search
    if (showMentionMenu) {
      const searchText = newValue.substring(mentionPosition.start, cursorPosition);
      // If text after @ contains a space, close the menu
      if (searchText.includes(' ') || !searchText.startsWith('@')) {
        setShowMentionMenu(false);
      } else {
        setMentionSearch(searchText.substring(1)); // Remove @ from search
      }
    }

    // If document menu is open, update search
    if (showDocumentMenu) {
      const searchText = newValue.substring(documentPosition.start, cursorPosition);
      // If text after # contains a space, close the menu
      if (searchText.includes(' ') || !searchText.startsWith('#')) {
        setShowDocumentMenu(false);
      } else {
        setDocumentSearch(searchText.substring(1)); // Remove # from search
      }
    }
  };

  // Insert a mention at the current cursor position
  const insertMention = (user: User) => {
    const beforeMention = message.substring(0, mentionPosition.start);
    const afterMention = message.substring(cursorPosition);
    const newMessage = `${beforeMention}@${user.name} ${afterMention}`;
    setMessage(newMessage);
    setShowMentionMenu(false);
    
    // Focus back on textarea and set cursor after the inserted mention
    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = mentionPosition.start + user.name.length + 2; // +2 for @ and space
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
        }
      }, 0);
    }
  };

  // Insert a document reference at the current cursor position
  const insertDocumentRef = (doc: Document) => {
    const beforeRef = message.substring(0, documentPosition.start);
    const afterRef = message.substring(cursorPosition);
    const newMessage = `${beforeRef}#${doc.id} ${afterRef}`;
    setMessage(newMessage);
    setShowDocumentMenu(false);
    
    // Focus back on textarea and set cursor after the inserted reference
    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = documentPosition.start + doc.id.length + 2; // +2 for # and space
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
        }
      }, 0);
    }
  };

  // Insert emoji at current cursor position
  const insertEmoji = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newMessage = message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      
      // Set cursor position after emoji
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + emoji.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle text formatting (bold, italic, etc.)
  const handleFormatText = (format: 'bold' | 'italic' | 'list') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = message.substring(start, end);
    
    let formattedText = selectedText;
    let cursorAdjustment = 0;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorAdjustment = 4; // 2 for opening ** and 2 for closing **
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorAdjustment = 2; // 1 for opening * and 1 for closing *
        break;
      case 'list':
        formattedText = selectedText
          .split('\n')
          .map(line => `• ${line}`)
          .join('\n');
        cursorAdjustment = selectedText.split('\n').length * 2; // 2 characters per line (bullet and space)
        break;
    }
    
    const newMessage = message.substring(0, start) + formattedText + message.substring(end);
    setMessage(newMessage);
    
    // Set cursor position after formatted text
    setTimeout(() => {
      if (textareaRef.current) {
        if (start === end) {
          // If no text was selected, place cursor inside the formatting
          const newPosition = start + Math.floor(cursorAdjustment / 2);
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        } else {
          // If text was selected, place cursor after formatting
          const newPosition = start + formattedText.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Filter available users based on search text
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  // Filter available documents based on search text
  const filteredDocuments = availableDocuments.filter(doc => 
    doc.id.toLowerCase().includes(documentSearch.toLowerCase()) || 
    doc.title.toLowerCase().includes(documentSearch.toLowerCase())
  );

  return (
    <div className="border-t bg-card p-4">
      {/* Reply reference */}
      {replyToMessage && (
        <div className="mb-2 flex items-start justify-between rounded-md bg-muted/50 p-2 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Răspuns către <span className="font-medium">{replyToMessage.sender.name}</span>
            </span>
            <span className="line-clamp-1">{replyToMessage.content}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5" 
            onClick={clearReplyTo}
          >
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </Button>
        </div>
      )}

      {/* Selected files */}
      {files.length > 0 && (
        <div className="mb-2 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm"
            >
              <div className="flex items-center">
                <PaperclipIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => removeFile(index)}
              >
                <span className="sr-only">Remove</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        {/* Text formatting toolbar */}
        <div className="absolute left-0 top-0 flex items-center gap-1 p-1.5">
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => handleFormatText('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">
              <p>Bold</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => handleFormatText('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">
              <p>Italic</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => handleFormatText('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">
              <p>Lista cu puncte</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => {
                  if (textareaRef.current) {
                    const pos = textareaRef.current.selectionStart;
                    const newMessage = 
                      message.substring(0, pos) + '@' + message.substring(pos);
                    setMessage(newMessage);
                    setShowMentionMenu(true);
                    setMentionPosition({ start: pos, end: pos + 1 });
                    
                    // Focus on textarea and place cursor after @
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.selectionStart = pos + 1;
                        textareaRef.current.selectionEnd = pos + 1;
                        textareaRef.current.focus();
                      }
                    }, 0);
                  }
                }}
              >
                <AtSign className="h-4 w-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">
              <p>Menționează</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => {
                  if (textareaRef.current) {
                    const pos = textareaRef.current.selectionStart;
                    const newMessage = 
                      message.substring(0, pos) + '#' + message.substring(pos);
                    setMessage(newMessage);
                    setShowDocumentMenu(true);
                    setDocumentPosition({ start: pos, end: pos + 1 });
                    
                    // Focus on textarea and place cursor after #
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.selectionStart = pos + 1;
                        textareaRef.current.selectionEnd = pos + 1;
                        textareaRef.current.focus();
                      }
                    }, 0);
                  }
                }}
              >
                <Hash className="h-4 w-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">
              <p>Referință document</p>
            </Tooltip.Content>
          </Tooltip>
        </div>

        <div className="flex flex-col">
          <textarea
            ref={textareaRef}
            className={cn(
              "min-h-[80px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              "pt-10" // Add padding top to accommodate the formatting toolbar
            )}
            placeholder="Scrie un mesaj..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />

          {/* Mention menu */}
          {showMentionMenu && (
            <div className="absolute left-10 top-[calc(100%-4px)] z-10 w-64 -translate-y-full rounded-md border bg-popover p-1 shadow-md">
              <div className="py-1 text-xs font-medium text-muted-foreground px-2">
                Menționează un utilizator
              </div>
              <ScrollArea className="h-[200px]">
                <div className="p-1 space-y-1">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        onClick={() => insertMention(user)}
                      >
                        <Avatar className="h-6 w-6">
                          <img src={user.avatar} alt={user.name} className="aspect-square h-full w-full object-cover" />
                        </Avatar>
                        <span>{user.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nu a fost găsit niciun utilizator
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Document reference menu */}
          {showDocumentMenu && (
            <div className="absolute left-10 top-[calc(100%-4px)] z-10 w-64 -translate-y-full rounded-md border bg-popover p-1 shadow-md">
              <div className="py-1 text-xs font-medium text-muted-foreground px-2">
                Referință document
              </div>
              <ScrollArea className="h-[200px]">
                <div className="p-1 space-y-1">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <button
                        key={doc.id}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        onClick={() => insertDocumentRef(doc)}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                          <span className="text-xs font-medium">
                            {doc.type.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span>{doc.id}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[170px]">
                            {doc.title}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nu a fost găsit niciun document
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Emoji picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-80 p-2">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    <EmojiCategory 
                      title="Recente" 
                      emojis={commonEmojis.recent}
                      onSelectEmoji={insertEmoji} 
                    />
                    <EmojiCategory 
                      title="Reacții" 
                      emojis={commonEmojis.reactions}
                      onSelectEmoji={insertEmoji} 
                    />
                    <EmojiCategory 
                      title="Obiecte" 
                      emojis={commonEmojis.objects}
                      onSelectEmoji={insertEmoji} 
                    />
                    <EmojiCategory 
                      title="Simboluri" 
                      emojis={commonEmojis.symbols}
                      onSelectEmoji={insertEmoji} 
                    />
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* File attachment */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full" 
              onClick={handleFileSelect}
              disabled={isLoading}
            >
              <PaperclipIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Send button */}
          <Button 
            className="rounded-full px-4"
            onClick={handleSendMessage}
            disabled={isLoading || (message.trim() === '' && files.length === 0)}
          >
            <Send className="mr-2 h-4 w-4" />
            Trimite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
