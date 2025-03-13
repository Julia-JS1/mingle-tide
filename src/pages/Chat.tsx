
import React, { useState, useEffect, useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import ChannelList from '@/components/chat/ChannelList';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Bell, BellOff, Pin, Info, Search, Settings, Hash, Users, Plus, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ChatMessageType {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  reactions?: Record<string, {
    emoji: string;
    count: number;
    users: string[];
  }>;
  replyTo?: string;
  replyToContent?: string;
  replyToSender?: string;
  mentions: string[];
  documentRefs: string[];
  taskCreated?: boolean;
  edited?: boolean;
}

const Chat = () => {
  const currentUser = {
    id: "user1",
    name: "Adrian Ionescu",
    avatar: "https://i.pravatar.cc/150?img=1",
    isAdmin: true
  };

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
    },
    {
      id: "PROD123",
      type: "product",
      title: "Monitor Dell UltraSharp"
    }
  ];

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

  const [selectedChannel, setSelectedChannel] = useState<any>(channels[0]);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessageType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSelectChannel = (channel: any) => {
    setSelectedChannel(channel);
    setLoading(true);
    
    setMessages([]);
    
    setTimeout(() => {
      // If general channel is selected, display the provided examples
      if (channel.id === "channel1") {
        setMessages(generateExampleMessages());
      } else {
        const mockMessages = generateMockMessages(channel, 15);
        setMessages(mockMessages);
      }
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    // Load general channel by default
    handleSelectChannel(channels[0]);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateExampleMessages = () => {
    const exampleMessages: ChatMessageType[] = [
      {
        id: "ex1",
        content: "Bun venit în canalul general al platformei iFlows! Aici puteți discuta despre orice subiect legat de proiectele noastre.",
        sender: users[0],
        timestamp: new Date(new Date().getTime() - 86400000 * 5), // 5 days ago
        isRead: true,
        mentions: [],
        documentRefs: []
      },
      {
        id: "ex2",
        content: "Am actualizat documentația pentru modulul de chat. Puteți găsi toate informațiile în secțiunea Documentație.",
        sender: users[1],
        timestamp: new Date(new Date().getTime() - 86400000 * 4), // 4 days ago
        isRead: true,
        mentions: [],
        documentRefs: []
      },
      {
        id: "ex3",
        content: "@Maria Popescu, am verificat oferta #OF123 și totul pare în regulă. Putem trimite către client?",
        sender: users[2],
        timestamp: new Date(new Date().getTime() - 86400000 * 3), // 3 days ago
        isRead: true,
        mentions: ["Maria Popescu"],
        documentRefs: ["OF123"]
      },
      {
        id: "ex4",
        content: "@Ion Vasilescu, da, oferta este gata. Am adăugat și discount-ul discutat. Te rog să o trimiți astăzi către client.",
        sender: users[1],
        timestamp: new Date(new Date().getTime() - 86400000 * 3 + 3600000), // 3 days ago + 1 hour
        isRead: true,
        mentions: ["Ion Vasilescu"],
        documentRefs: [],
        replyTo: "ex3",
        replyToContent: "@Maria Popescu, am verificat oferta #OF123 și totul pare în regulă. Putem trimite către client?",
        replyToSender: "Ion Vasilescu"
      },
      {
        id: "ex5",
        content: "Am actualizat stocul pentru produsul #PROD123. Acum avem 50 de unități disponibile.",
        sender: users[3],
        timestamp: new Date(new Date().getTime() - 86400000 * 2), // 2 days ago
        isRead: true,
        mentions: [],
        documentRefs: ["PROD123"],
        attachments: [
          {
            id: "attachment1",
            name: "stoc_actualizat.xlsx",
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 45000,
            url: "#"
          }
        ]
      },
      {
        id: "ex6",
        content: "@Adrian Ionescu, te rog să verifici comanda #CMD456 și să confirmi că produsele sunt disponibile pentru livrare până vineri.",
        sender: users[1],
        timestamp: new Date(new Date().getTime() - 86400000), // 1 day ago
        isRead: true,
        mentions: ["Adrian Ionescu"],
        documentRefs: ["CMD456"],
      },
      {
        id: "ex7",
        content: "@Elena Dumitrescu, te rog să soliciți la furnizor 20 de unități #PROD123 pentru comanda #CMD456.",
        sender: users[0],
        timestamp: new Date(new Date().getTime() - 43200000), // 12 hours ago
        isRead: true,
        mentions: ["Elena Dumitrescu"],
        documentRefs: ["PROD123", "CMD456"]
      },
      {
        id: "ex8",
        content: "@Adrian Ionescu Am verificat comanda #CMD456 și toate produsele sunt disponibile. Putem livra până vineri fără probleme.",
        sender: users[3],
        timestamp: new Date(new Date().getTime() - 21600000), // 6 hours ago
        isRead: true,
        mentions: ["Adrian Ionescu"],
        documentRefs: ["CMD456"],
        replyTo: "ex6",
        replyToContent: "@Adrian Ionescu, te rog să verifici comanda #CMD456 și să confirmi că produsele sunt disponibile pentru livrare până vineri.",
        replyToSender: "Maria Popescu"
      },
      {
        id: "ex9",
        content: "Echipa, am programat o ședință pentru discutarea noilor funcționalități ale platformei. Vă rog să fiți disponibili mâine la ora 10:00.",
        sender: users[0],
        timestamp: new Date(new Date().getTime() - 10800000), // 3 hours ago
        isRead: true,
        mentions: [],
        documentRefs: [],
        reactions: {
          "👍": {
            emoji: "👍",
            count: 3,
            users: ["user2", "user3", "user4"]
          },
          "👀": {
            emoji: "👀",
            count: 1,
            users: ["user2"]
          }
        }
      },
      {
        id: "ex10",
        content: "@Ion Vasilescu, te rog să pregătești raportul de vânzări pentru ședința de mâine.",
        sender: users[0],
        timestamp: new Date(new Date().getTime() - 7200000), // 2 hours ago
        isRead: true,
        mentions: ["Ion Vasilescu"],
        documentRefs: [],
        taskCreated: true
      },
      {
        id: "ex11",
        content: "Am creat task-ul și voi avea raportul gata până mâine dimineață.",
        sender: users[2],
        timestamp: new Date(new Date().getTime() - 5400000), // 1.5 hours ago
        isRead: true,
        mentions: [],
        documentRefs: [],
        replyTo: "ex10",
        replyToContent: "@Ion Vasilescu, te rog să pregătești raportul de vânzări pentru ședința de mâine.",
        replyToSender: "Adrian Ionescu"
      },
      {
        id: "ex12",
        content: "Am adăugat 20 de unități de #PROD123 în comandă. @Maria Popescu poți să verifici și să confirmi?",
        sender: users[3],
        timestamp: new Date(new Date().getTime() - 3600000), // 1 hour ago
        isRead: true,
        mentions: ["Maria Popescu"],
        documentRefs: ["PROD123"],
        replyTo: "ex7",
        replyToContent: "@Elena Dumitrescu, te rog să soliciți la furnizor 20 de unități #PROD123 pentru comanda #CMD456.",
        replyToSender: "Adrian Ionescu"
      }
    ];

    return exampleMessages;
  };

  const generateMockMessages = (channel: any, count: number) => {
    const mockMessages: ChatMessageType[] = [];
    
    const participants = channel.type === 'direct' 
      ? channel.users 
      : users.slice(0, 4);
    
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const sender = participants[Math.floor(Math.random() * participants.length)];
      const timestamp = new Date(now.getTime() - (count - i) * 3 * 60000);
      const isReply = Math.random() > 0.7 && i > 0;
      const hasMention = Math.random() > 0.7;
      const hasDocRef = Math.random() > 0.7;
      const isTaskMessage = Math.random() > 0.8;
      
      let content = getRandomMessage();
      
      const mentions: string[] = [];
      if (hasMention) {
        const mentionedUser = participants.find((u: any) => u.id !== sender.id);
        if (mentionedUser) {
          content = `@${mentionedUser.name} ${content}`;
          mentions.push(mentionedUser.name);
        }
      }
      
      const documentRefs: string[] = [];
      if (hasDocRef) {
        const randomDoc = documents[Math.floor(Math.random() * documents.length)];
        content = `${content} #${randomDoc.id}`;
        documentRefs.push(randomDoc.id);
      }
      
      if (i === 3 && sender.id !== currentUser.id) {
        content = `@${currentUser.name} Stocul este insuficient pentru această comandă #CMD456`;
        mentions.push(currentUser.name);
        documentRefs.push('CMD456');
      }
      
      if (isTaskMessage) {
        const mentionedUser = participants.find((u: any) => u.id !== sender.id);
        if (mentionedUser) {
          content = `@${mentionedUser.name}, te rog să verifici documentul #OF123 până mâine`;
          mentions.push(mentionedUser.name);
          documentRefs.push('OF123');
        }
      }
      
      const replyToIndex = isReply ? Math.floor(Math.random() * mockMessages.length) : -1;
      const replyToMessage = replyToIndex >= 0 ? mockMessages[replyToIndex] : undefined;
      
      const message: ChatMessageType = {
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

  const handleSendMessage = (content: string, attachments: File[]) => {
    if (!selectedChannel || (!content.trim() && attachments.length === 0)) return;
    
    const newMessage: ChatMessageType = {
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
        url: '#' 
      })),
      mentions: content.match(/@(\w+)/g)?.map(match => match.substring(1)) || [],
      documentRefs: content.match(/#([A-Za-z0-9]+)/g)?.map(match => match.substring(1)) || []
    };
    
    if (replyTo) {
      newMessage.replyTo = replyTo.id;
      newMessage.replyToContent = replyTo.content;
      newMessage.replyToSender = replyTo.sender.name;
      setReplyTo(null);
    }
    
    setMessages(prev => [...prev, newMessage]);
  };

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
    
    toast.success(`Reacție ${emoji} adăugată la mesajul lui ${messages.find(msg => msg.id === messageId)?.sender.name}!`);
  };

  const handleReply = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyTo(messageToReply);
      toast.info("Răspunzi la mesajul lui " + messageToReply.sender.name);
    }
  };

  const handleCreateTask = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, taskCreated: true }
          : msg
      )
    );
    
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      toast.success(`Sarcină creată din mesajul: "${message.content.substring(0, 30)}..."`, {
        description: "Sarcina a fost adăugată în lista ta de activități."
      });
    }
  };

  const handleLinkToDocument = (messageId: string, docRef: string) => {
    toast.success(`Mesajul a fost asociat cu documentul #${docRef}`, {
      description: "Poți vedea acest mesaj și în secțiunea de comentarii a documentului."
    });
  };

  const handleEditMessage = (messageId: string) => {
    toast.info("Editare mesaj", {
      description: "Funcționalitatea de editare va fi disponibilă în curând."
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success("Mesajul a fost șters.");
  };

  const handleCopyLink = (messageId: string) => {
    const link = `https://app.iflows.ro/chat/message/${messageId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link-ul a fost copiat în clipboard.");
    });
  };

  const handleRemind = (messageId: string) => {
    toast.info("Reminder setat", {
      description: "Vei primi o notificare despre acest mesaj peste 1 oră."
    });
  };

  const handleForward = (messageId: string) => {
    toast.info("Funcționalitate de redirecționare", {
      description: "Va fi disponibilă în curând."
    });
  };

  const handleMarkUnread = (messageId: string) => {
    toast.success("Mesajul a fost marcat ca necitit.");
  };

  const handleCreateChannel = () => {
    console.log("Create channel");
  };

  const handleManageChannels = () => {
    console.log("Manage channels");
  };

  const handleBookmark = (messageId: string) => {
    toast.success("Mesajul a fost salvat în favoritele tale");
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <div className="flex-grow flex overflow-hidden">
          <div className="h-full w-64 border-r flex flex-col shadow-md bg-background/95 backdrop-blur-sm">
            <div className="p-3 flex items-center justify-between">
              <h2 className="font-semibold text-lg">iFlows Chat</h2>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  placeholder="Caută în mesaje" 
                  className="pl-8 bg-muted/50 border-0 focus-visible:ring-1"
                />
              </div>
            </div>
            
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
            
            {currentUser.isAdmin && (
              <div className="mt-auto p-3 border-t">
                <Button variant="outline" className="w-full flex items-center justify-between" onClick={handleManageChannels}>
                  <span className="flex items-center">
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Gestionare canale</span>
                  </span>
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-background to-muted/30">
            <div className="flex items-center justify-between p-4 border-b bg-background/70 backdrop-blur-sm shadow-sm">
              {selectedChannel?.type === 'channel' ? (
                <>
                  <div className="bg-iflows-primary/10 p-1.5 rounded-md mr-3">
                    <Hash className="h-5 w-5 text-iflows-primary" />
                  </div>
                  <h2 className="text-lg font-medium">{selectedChannel?.name}</h2>
                  {selectedChannel?.isPrivate && (
                    <div className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      Privat
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="h-9 w-9 rounded-full overflow-hidden shadow-sm border-2 border-background">
                      <img 
                        src={selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.avatar} 
                        alt={selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                    )}
                  </div>
                  <h2 className="text-lg font-medium">
                    {selectedChannel?.users?.find((u: any) => u.id !== currentUser.id)?.name}
                  </h2>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary transition-colors">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary transition-colors">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary transition-colors">
                  <Pin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary transition-colors">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-iflows-primary border-t-transparent"></div>
                    <span className="text-muted-foreground mt-2 font-medium">Se încarcă mesajele...</span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-6 text-center max-w-md">
                    <div className="bg-iflows-primary/10 p-6 rounded-full">
                      <MessageSquare className="h-16 w-16 text-iflows-primary opacity-80" />
                    </div>
                    <h3 className="text-2xl font-medium">Nicio conversație aici încă</h3>
                    <p className="text-muted-foreground text-lg">
                      Trimite primul mesaj pentru a începe o conversație în canalul <span className="font-medium text-foreground">{selectedChannel?.name}</span>.
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
                      onLink={handleLinkToDocument}
                      onEdit={handleEditMessage}
                      onDelete={handleDeleteMessage}
                      onCopyLink={handleCopyLink}
                      onRemind={handleRemind}
                      onForward={handleForward}
                      onMarkUnread={handleMarkUnread}
                      onBookmark={handleBookmark}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="border-t bg-background/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
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

// Handle functions that were referenced but not implemented
const handleCreateChannel = () => {
  toast.info("Funcționalitate de creare canale", {
    description: "Va fi disponibilă în curând."
  });
};

const handleManageChannels = () => {
  toast.info("Funcționalitate de gestionare canale", {
    description: "Va fi disponibilă în curând."
  });
};

const handleReply = (messageId: string) => {
  toast.info("Răspunzi la mesajul cu ID-ul " + messageId);
};

const handleReaction = (messageId: string, emoji: string) => {
  toast.success(`Reacție ${emoji} adăugată`);
};

const handleCreateTask = (messageId: string) => {
  toast.success("Sarcină creată cu succes!");
};

const handleLinkToDocument = (messageId: string, docRef: string) => {
  toast.success(`Mesajul a fost asociat cu documentul #${docRef}`);
};

const handleEditMessage = (messageId: string) => {
  toast.info("Editare mesaj");
};

const handleDeleteMessage = (messageId: string) => {
  toast.success("Mesajul a fost șters.");
};

const handleCopyLink = (messageId: string) => {
  toast.success("Link-ul a fost copiat în clipboard.");
};

const handleRemind = (messageId: string) => {
  toast.info("Reminder setat");
};

const handleForward = (messageId: string) => {
  toast.info("Funcționalitate de redirecționare");
};

const handleMarkUnread = (messageId: string) => {
  toast.success("Mesajul a fost marcat ca necitit.");
};

const handleBookmark = (messageId: string) => {
  toast.success("Mesajul a fost salvat în favoritele tale");
};

export default Chat;
