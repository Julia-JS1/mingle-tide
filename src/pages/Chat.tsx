import React, { useState, useEffect, useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import ChannelList from '@/components/chat/ChannelList';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import ChannelManagementDrawer from '@/components/chat/ChannelManagementDrawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Bell, Pin, Info, Search, Hash, Settings, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

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
      name: "vanzari",
      type: "channel" as const,
      isPrivate: false,
      isPinned: true,
      isArchived: false,
      unreadCount: 0,
      mentions: 0
    },
    {
      id: "channel3",
      name: "productie",
      type: "channel" as const,
      isPrivate: false,
      isPinned: false,
      isArchived: false,
      unreadCount: 5,
      mentions: 0
    },
    {
      id: "channel4",
      name: "marketing",
      type: "channel" as const,
      isPrivate: true,
      isPinned: false,
      isArchived: false,
      unreadCount: 0,
      mentions: 0
    },
    {
      id: "channel5",
      name: "financiar",
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
  const [isManageChannelsOpen, setIsManageChannelsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ... keep existing code (handleSelectChannel, useEffects, generateExampleMessages, generateMockMessages, getRandomMessage, handleSendMessage, handleReaction, handleReply, handleCreateTask, handleLinkToDocument, handleEditMessage, handleDeleteMessage, handleCopyLink, handleRemind, handleForward, handleMarkUnread, handleCreateChannel, handleManageChannels, handleBookmark)

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col">
        <div 
          className="flex-grow flex overflow-hidden relative"
        >
          <div 
            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
            style={{
              opacity: 0.15,
            }}
          >
            <img 
              src="/lovable-uploads/461a1973-2e20-48ba-a340-2f902bd27a9e.png" 
              alt="iFlows Logo" 
              className="w-4/5 max-w-3xl"
            />
          </div>

          <div className="h-full w-64 border-r flex flex-col shadow-md bg-background/95 backdrop-blur-sm z-10">
            <div className="p-3 flex items-center justify-between">
              <h2 className="font-semibold text-lg">iFlows Chat</h2>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <Settings className="h-4 w-4" />
              </Button>
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

          <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-background to-muted/30 z-10">
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
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      {...message}
                      isOwn={message.sender.id === currentUser.id}
                      isLatestMessage={index === messages.length - 1}
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
      
      <ChannelManagementDrawer
        isOpen={isManageChannelsOpen}
        onClose={() => setIsManageChannelsOpen(false)}
        channels={channels}
        isAdmin={currentUser.isAdmin}
      />
    </TooltipProvider>
  );
};

export default Chat;
