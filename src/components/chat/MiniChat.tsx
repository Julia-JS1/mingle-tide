
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { cn } from '@/lib/utils';

interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'direct';
  unreadCount: number;
  users?: Array<{ id: string; name: string; avatar: string }>;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

interface ChatDocument {
  id: string;
  type: string;
  title: string;
}

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  isRead?: boolean;
  edited?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  reactions?: Record<string, {
    emoji: string;
    count: number;
    users: string[];
  }>;
  replyTo?: string;
  replyToContent?: string;
  replyToSender?: string;
  mentions?: string[];
  documentRefs?: string[];
  taskCreated?: boolean;
}

interface MiniChatProps {
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
  initialChannel?: Channel;
  initialExpanded?: boolean;
  className?: string;
  userChannels: Channel[];
  users: ChatUser[];
  documents: ChatDocument[];
  onClose?: () => void;
  onExpandFull?: () => void;
}

const MiniChat: React.FC<MiniChatProps> = ({
  currentUser,
  initialChannel,
  initialExpanded = false,
  className,
  userChannels,
  users,
  documents,
  onClose,
  onExpandFull,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(initialChannel || null);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample mock messages - in a real app, fetch these from an API
  useEffect(() => {
    if (selectedChannel) {
      // Simulated loading of messages
      setLoading(true);
      
      // Simulate API call with delay
      const timer = setTimeout(() => {
        const randomMessages = generateMockMessages(selectedChannel, 8);
        setMessages(randomMessages);
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedChannel]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Animation class for mini-chat appearance
  const animationClass = expanded ? 'mini-chat-animation' : '';

  // Generate random mock messages for testing
  const generateMockMessages = (channel: Channel, count: number): Message[] => {
    const mockMessages: Message[] = [];
    
    // Participants in the conversation
    const participants = channel.type === 'direct' 
      ? channel.users || [] 
      : users.slice(0, 4);
    
    // Add current user to participants if not already there
    if (!participants.some(user => user.id === currentUser.id)) {
      participants.push(currentUser);
    }
    
    // Generate messages
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const sender = participants[Math.floor(Math.random() * participants.length)];
      const timestamp = new Date(now.getTime() - (count - i) * 3 * 60000); // 3 minutes between messages
      const isReply = Math.random() > 0.7 && i > 0;
      const hasMention = Math.random() > 0.7;
      const hasDocRef = Math.random() > 0.7;
      const isTaskMessage = Math.random() > 0.8;
      
      let content = getRandomMessage();
      
      // Add mentions
      const mentions: string[] = [];
      if (hasMention) {
        const mentionedUser = participants.find(u => u.id !== sender.id);
        if (mentionedUser) {
          content = `@${mentionedUser.name} ${content}`;
          mentions.push(mentionedUser.name);
        }
      }
      
      // Add document references
      const documentRefs: string[] = [];
      if (hasDocRef) {
        const randomDoc = documents[Math.floor(Math.random() * documents.length)];
        content = `${content} #${randomDoc.id}`;
        documentRefs.push(randomDoc.id);
      }
      
      // Create a task message
      if (isTaskMessage) {
        const mentionedUser = participants.find(u => u.id !== sender.id);
        if (mentionedUser) {
          content = `@${mentionedUser.name}, te rog să verifici documentul #OF123 până mâine`;
          mentions.push(mentionedUser.name);
          documentRefs.push('OF123');
        }
      }
      
      // Get previous message for replies
      const replyToIndex = isReply ? Math.floor(Math.random() * mockMessages.length) : -1;
      const replyToMessage = replyToIndex >= 0 ? mockMessages[replyToIndex] : undefined;
      
      const message: Message = {
        id: `msg-${Date.now()}-${i}`,
        content,
        sender,
        timestamp,
        isRead: true,
        edited: Math.random() > 0.8,
        attachments: Math.random() > 0.8 ? [
          {
            id: `attach-${i}`,
            name: `document-${i}.pdf`,
            type: 'application/pdf',
            size: Math.floor(Math.random() * 1000000),
            url: '#'
          }
        ] : undefined,
        reactions: Math.random() > 0.7 ? {
          '👍': {
            emoji: '👍',
            count: Math.floor(Math.random() * 3) + 1,
            users: [participants[0].id]
          }
        } : undefined,
        replyTo: replyToMessage ? replyToMessage.id : undefined,
        replyToContent: replyToMessage ? replyToMessage.content : undefined,
        replyToSender: replyToMessage ? replyToMessage.sender.name : undefined,
        mentions,
        documentRefs,
        taskCreated: isTaskMessage && Math.random() > 0.5
      };
      
      mockMessages.push(message);
    }
    
    return mockMessages;
  };

  // Random messages for mock data
  const getRandomMessage = (): string => {
    const messages = [
      "Bună, cum pot să te ajut?",
      "Am verificat documentul, totul este în regulă.",
      "Trebuie să trimitem oferta astăzi.",
      "Când putem programa o întâlnire pentru a discuta despre acest proiect?",
      "Am actualizat datele în sistem.",
      "Clientul a solicitat o ofertă pentru 10 bucăți.",
      "Poți să verifici facturile din ultima lună?",
      "Am transmis comanda către furnizor.",
      "Stocul este insuficient pentru această comandă.",
      "Documentele au fost semnate și trimise.",
      "Trebuie să stabilim o strategie pentru noul proiect.",
      "Clienții sunt mulțumiți de serviciile noastre.",
      "Poți să pregătești raportul pentru ședința de mâine?",
      "Am primit confirmarea de livrare.",
      "Statusul comenzii a fost actualizat.",
      "Trebuie să contactăm clientul pentru mai multe detalii.",
      "Când vom primi marfa de la furnizor?",
      "Am trimis email-ul cu detaliile solicitării.",
      "Documentele sunt gata pentru a fi semnate.",
      "Transportul va ajunge mâine dimineață."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Handle sending a new message
  const handleSendMessage = (content: string, attachments: File[]) => {
    if (!selectedChannel || (!content.trim() && attachments.length === 0)) return;
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      sender: currentUser,
      timestamp: new Date(),
      isRead: true,
      attachments: attachments.map((file, index) => ({
        id: `attach-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: '#' // In real app, upload file and get URL
      })),
      mentions: extractMentions(content),
      documentRefs: extractDocRefs(content)
    };
    
    // If replying to a message, add reply info
    if (replyTo) {
      newMessage.replyTo = replyTo.id;
      newMessage.replyToContent = replyTo.content;
      newMessage.replyToSender = replyTo.sender.name;
      setReplyTo(null);
    }
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Extract mentions from message content
  const extractMentions = (content: string): string[] => {
    const mentionPattern = /@(\w+)/g;
    const matches = content.match(mentionPattern);
    if (!matches) return [];
    return matches.map(match => match.substring(1));
  };

  // Extract document references from message content
  const extractDocRefs = (content: string): string[] => {
    const refPattern = /#([A-Za-z0-9]+)/g;
    const matches = content.match(refPattern);
    if (!matches) return [];
    return matches.map(match => match.substring(1));
  };

  // Handle message reactions
  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [emoji]: {
                  emoji,
                  count: msg.reactions?.[emoji] 
                    ? msg.reactions[emoji].count + 1 
                    : 1,
                  users: [
                    ...(msg.reactions?.[emoji]?.users || []),
                    currentUser.id
                  ]
                }
              }
            }
          : msg
      )
    );
  };

  // Handle replying to a message
  const handleReply = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyTo(messageToReply);
    }
  };

  // Handle creating a task from a message
  const handleCreateTask = (messageId: string) => {
    // In a real app, show a task creation dialog
    // For now, just mark the message as having a task created
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, taskCreated: true }
          : msg
      )
    );
  };

  // Clear reply state
  const clearReplyTo = () => setReplyTo(null);

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col rounded-lg shadow-strong",
        className
      )}
    >
      {/* Chat button (minimized state) */}
      {!expanded && (
        <Button 
          className="h-12 w-12 rounded-full bg-iflows-primary shadow-medium hover:bg-iflows-secondary transition-all duration-300 animate-scale-in"
          onClick={() => setExpanded(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Mini chat (expanded state) */}
      {expanded && (
        <div 
          className={cn(
            "flex w-80 flex-col rounded-lg bg-card border shadow-medium overflow-hidden",
            animationClass
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center">
              {selectedChannel?.type === 'direct' ? (
                <span className="font-medium">
                  {selectedChannel?.users?.[0]?.name || selectedChannel?.name}
                </span>
              ) : (
                <div className="flex items-center">
                  <span>#</span>
                  <span className="ml-1 font-medium">{selectedChannel?.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {/* Channel selector dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">
                      Canale
                    </div>
                    {userChannels.filter(c => c.type === 'channel').map(channel => (
                      <DropdownMenuItem 
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="mr-1">#</span>
                          <span>{channel.name}</span>
                        </div>
                        {channel.unreadCount > 0 && (
                          <Badge variant="secondary" className="ml-2 px-1.5 h-5 min-w-5 flex items-center justify-center">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                    
                    <div className="my-2 text-xs font-medium text-muted-foreground">
                      Conversații
                    </div>
                    {userChannels.filter(c => c.type === 'direct').map(channel => (
                      <DropdownMenuItem 
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel)}
                        className="flex items-center justify-between"
                      >
                        <span>{channel.name}</span>
                        {channel.unreadCount > 0 && (
                          <Badge variant="secondary" className="ml-2 px-1.5 h-5 min-w-5 flex items-center justify-center">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Expand button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onExpandFull}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              
              {/* Collapse button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setExpanded(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {/* Close button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 h-[320px]">
            <div className="p-3 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-iflows-primary border-t-transparent"></div>
                    <span className="text-sm text-muted-foreground">Se încarcă mesajele...</span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-[280px]">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="h-12 w-12 text-muted-foreground opacity-30" />
                    <span className="text-muted-foreground">
                      Nu există mesaje în acest canal
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Trimite primul mesaj pentru a începe conversația
                    </span>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    {...message}
                    isOwn={message.sender.id === currentUser.id}
                    onReply={handleReply}
                    onReact={handleReaction}
                    onCreateTask={handleCreateTask}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <ChatInput
            replyToMessage={replyTo ? {
              id: replyTo.id,
              sender: { name: replyTo.sender.name },
              content: replyTo.content
            } : undefined}
            clearReplyTo={clearReplyTo}
            onSendMessage={handleSendMessage}
            availableUsers={users}
            availableDocuments={documents}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default MiniChat;
