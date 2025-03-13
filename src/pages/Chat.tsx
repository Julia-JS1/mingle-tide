
import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import ChannelList from '@/components/chat/ChannelList';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Bell, BellOff, Pin, Info, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Chat = () => {
  // Mock current user
  const currentUser = {
    id: "user1",
    name: "Adrian Ionescu",
    avatar: "https://i.pravatar.cc/150?img=1",
    isAdmin: true
  };

  // Mock channels
  const channels = [
    {
      id: "channel1",
      name: "general",
      type: "channel" as const,
      isPrivate: false,
      isPinned: true,
      isArchived: false,
      unreadCount: 3,
      mentions: 1
    },
    {
      id: "channel2",
      name: "ui-team",
      type: "channel" as const,
      isPrivate: false,
      isPinned: true,
      isArchived: false,
      unreadCount: 0,
      mentions: 0
    },
    {
      id: "channel3",
      name: "marketing",
      type: "channel" as const,
      isPrivate: false,
      isPinned: false,
      isArchived: false,
      unreadCount: 5,
      mentions: 0
    },
    {
      id: "channel4",
      name: "dev-backend",
      type: "channel" as const,
      isPrivate: true,
      isPinned: false,
      isArchived: false,
      unreadCount: 0,
      mentions: 0
    },
    {
      id: "channel5",
      name: "old-projects",
      type: "channel" as const,
      isPrivate: false,
      isPinned: false,
      isArchived: true,
      unreadCount: 0,
      mentions: 0
    }
  ];

  // Mock direct messages
  const directMessages = [
    {
      id: "dm1",
      type: "direct" as const,
      users: [
        {
          id: "user2",
          name: "Maria Popescu",
          avatar: "https://i.pravatar.cc/150?img=5",
          isOnline: true
        },
        {
          id: "user1",
          name: "Adrian Ionescu",
          avatar: "https://i.pravatar.cc/150?img=1",
          isOnline: true
        }
      ],
      unreadCount: 2,
      mentions: 1
    },
    {
      id: "dm2",
      type: "direct" as const,
      users: [
        {
          id: "user3",
          name: "Ion Vasilescu",
          avatar: "https://i.pravatar.cc/150?img=3",
          isOnline: false
        },
        {
          id: "user1",
          name: "Adrian Ionescu",
          avatar: "https://i.pravatar.cc/150?img=1",
          isOnline: true
        }
      ],
      unreadCount: 0,
      mentions: 0
    }
  ];

  // Mock documents
  const documents = [
    {
      id: "OF123",
      type: "offer",
      title: "Ofertă client Acme SRL"
    },
    {
      id: "CMD456",
      type: "order",
      title: "Comandă furnizor TechPro SRL"
    },
    {
      id: "PROD789",
      type: "product",
      title: "Laptop Dell XPS 15"
    }
  ];

  // Mock users list
  const users = [
    {
      id: "user1",
      name: "Adrian Ionescu",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: "user2",
      name: "Maria Popescu",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: "user3",
      name: "Ion Vasilescu",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
      id: "user4",
      name: "Elena Dumitrescu",
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  ];

  // State
  const [selectedChannel, setSelectedChannel] = useState<any>(channels[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<any>(null);

  // Generate messages for selected channel
  const handleSelectChannel = (channel: any) => {
    setSelectedChannel(channel);
    setLoading(true);
    
    // Clear previous messages
    setMessages([]);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock messages based on channel
      const mockMessages = generateMockMessages(channel, 15);
      setMessages(mockMessages);
      setLoading(false);
    }, 800);
  };

  // Generate random mock messages
  const generateMockMessages = (channel: any, count: number) => {
    const mockMessages: any[] = [];
    
    // Participants in the conversation
    const participants = channel.type === 'direct' 
      ? channel.users 
      : users.slice(0, 4);
    
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
        const mentionedUser = participants.find((u: any) => u.id !== sender.id);
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
        const mentionedUser = participants.find((u: any) => u.id !== sender.id);
        if (mentionedUser) {
          content = `@${mentionedUser.name}, te rog să verifici documentul #OF123 până mâine`;
          mentions.push(mentionedUser.name);
          documentRefs.push('OF123');
        }
      }
      
      // Get previous message for replies
      const replyToIndex = isReply ? Math.floor(Math.random() * mockMessages.length) : -1;
      const replyToMessage = replyToIndex >= 0 ? mockMessages[replyToIndex] : undefined;
      
      const message = {
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
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      timestamp: new Date(),
      isRead: true,
      attachments: attachments.map((file, index) => ({
        id: `attach-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: '#' // In real app, upload file and get URL
      })),
      mentions: content.match(/@(\w+)/g)?.map(match => match.substring(1)) || [],
      documentRefs: content.match(/#([A-Za-z0-9]+)/g)?.map(match => match.substring(1)) || []
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
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, taskCreated: true }
          : msg
      )
    );
  };

  // Handle creating a new channel
  const handleCreateChannel = () => {
    console.log("Create channel");
    // In a real app, show a dialog to create a new channel
  };

  // Handle managing channels
  const handleManageChannels = () => {
    console.log("Manage channels");
    // In a real app, navigate to channel management section
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <div className="flex-grow flex overflow-hidden">
          {/* Sidebar */}
          <div className="h-full w-64 border-r flex flex-col bg-background">
            <ChannelList
              currentUserId={currentUser.id}
              channels={channels}
              directMessages={directMessages}
              selectedChannelId={selectedChannel?.id}
              onSelectChannel={handleSelectChannel}
              onCreateChannel={handleCreateChannel}
              onManageChannels={handleManageChannels}
              isAdmin={currentUser.isAdmin}
            />
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col h-full">
            {/* Channel header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                {selectedChannel?.type === 'channel' ? (
                  <>
                    <Hash className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h2 className="text-lg font-medium">{selectedChannel?.name}</h2>
                    {selectedChannel?.isPrivate && (
                      <div className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                        Privat
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center">
                    <div className="relative mr-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img 
                          src={selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.avatar} 
                          alt={selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></div>
                      )}
                    </div>
                    <h2 className="text-lg font-medium">
                      {selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.name}
                    </h2>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Pin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-iflows-primary border-t-transparent"></div>
                    <span className="text-muted-foreground">Se încarcă mesajele...</span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4 text-center max-w-md">
                    <MessageSquare className="h-16 w-16 text-muted-foreground opacity-30" />
                    <h3 className="text-xl font-medium">Nicio conversație aici încă</h3>
                    <p className="text-muted-foreground">
                      Trimite primul mesaj pentru a începe o conversație în canalul {selectedChannel?.name}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      {...message}
                      isOwn={message.sender.id === currentUser.id}
                      onReply={handleReply}
                      onReact={handleReaction}
                      onCreateTask={handleCreateTask}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input area */}
            <div className="border-t">
              <ChatInput
                replyToMessage={replyTo ? {
                  id: replyTo.id,
                  sender: { name: replyTo.sender.name },
                  content: replyTo.content
                } : undefined}
                clearReplyTo={() => setReplyTo(null)}
                onSendMessage={handleSendMessage}
                availableUsers={users}
                availableDocuments={documents}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Chat;
