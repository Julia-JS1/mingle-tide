import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, 
  Hash, 
  Plus, 
  Settings, 
  User, 
  Lock, 
  ChevronRight,
  ChevronDown,
  Pin,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ChannelModal, { ChannelData } from './ChannelModal';
import { toast } from 'sonner';

interface Channel {
  id: string;
  name: string;
  type: 'channel';
  isPrivate: boolean;
  isPinned: boolean;
  isArchived: boolean;
  unreadCount: number;
  mentions: number;
}

interface DirectMessage {
  id: string;
  type: 'direct';
  users: Array<{
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }>;
  unreadCount: number;
  mentions: number;
}

type ChannelOrDM = Channel | DirectMessage;

interface ChannelListProps {
  currentUserId: string;
  channels: Channel[];
  directMessages: DirectMessage[];
  selectedChannelId?: string;
  onSelectChannel: (channel: ChannelOrDM) => void;
  onCreateChannel?: (channelData: ChannelData) => void;
  onManageChannels?: () => void;
  isAdmin: boolean;
  className?: string;
}

const ChannelList: React.FC<ChannelListProps> = ({
  currentUserId,
  channels,
  directMessages,
  selectedChannelId,
  onSelectChannel,
  onCreateChannel,
  onManageChannels,
  isAdmin,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  
  const sampleUsers = [
    { id: "1", name: "Ana Popescu" },
    { id: "2", name: "Mihai Ionescu" },
    { id: "3", name: "Elena Dragomir" },
    { id: "4", name: "Alexandru Dumitrescu" },
    { id: "5", name: "Maria Stan" },
  ];
  
  const filteredChannels = channels
    .filter(channel => 
      !searchQuery || 
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      
      return a.name.localeCompare(b.name);
    });

  const pinnedChannels = filteredChannels.filter(channel => channel.isPinned);
  const unpinnedChannels = filteredChannels.filter(channel => !channel.isPinned && !channel.isArchived);
  const archivedChannels = filteredChannels.filter(channel => channel.isArchived);

  const filteredDirectMessages = directMessages
    .filter(dm => {
      if (!searchQuery) return true;
      
      return dm.users.some(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      
      const aName = a.users.find(u => u.id !== currentUserId)?.name || '';
      const bName = b.users.find(u => u.id !== currentUserId)?.name || '';
      return aName.localeCompare(bName);
    });

  const getDMPartnerInfo = (dm: DirectMessage) => {
    return dm.users.find(user => user.id !== currentUserId);
  };
  
  const handleCreateChannel = (channelData: ChannelData) => {
    if (onCreateChannel) {
      onCreateChannel(channelData);
    } else {
      toast.success(`Canal nou creat: ${channelData.name}`);
      console.info("Create channel", channelData);
    }
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Caută în chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-muted/50 border-0 rounded-lg focus:ring-2 focus:ring-iflows-primary/20 focus:border-0"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="pb-4">
          <div className="mb-4">
            <div 
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setShowChannels(!showChannels)}
            >
              <div className="flex items-center text-sm font-medium">
                {showChannels ? <ChevronDown className="h-4 w-4 mr-1.5 text-iflows-primary" /> : <ChevronRight className="h-4 w-4 mr-1.5 text-iflows-primary" />}
                Canale
              </div>
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsChannelModalOpen(true);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Crează un canal nou</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onManageChannels?.();
                          }}
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Gestionează canalele</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            
            {showChannels && (
              <div className="mt-1 space-y-0.5 pl-2">
                {pinnedChannels.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Canale ancorate
                    </div>
                    
                    {pinnedChannels.map(channel => (
                      <button
                        key={channel.id}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-all",
                          channel.id === selectedChannelId
                            ? "bg-iflows-primary text-white font-medium shadow-sm"
                            : "hover:bg-iflows-primary/10"
                        )}
                        onClick={() => onSelectChannel(channel)}
                      >
                        <div className="flex items-center overflow-hidden">
                          <div className="flex items-center min-w-0">
                            {channel.isPrivate ? (
                              <Lock className={cn("h-3.5 w-3.5 mr-1.5 flex-shrink-0", 
                                channel.id === selectedChannelId ? "text-white" : "text-muted-foreground")} />
                            ) : (
                              <Hash className={cn("h-3.5 w-3.5 mr-1.5 flex-shrink-0", 
                                channel.id === selectedChannelId ? "text-white" : "text-muted-foreground")} />
                            )}
                            <span className="truncate">{channel.name}</span>
                          </div>
                          
                          <Pin className={cn("h-3 w-3 ml-1.5", 
                            channel.id === selectedChannelId ? "text-white/70" : "text-muted-foreground")} />
                        </div>
                        
                        {(channel.unreadCount > 0 || channel.mentions > 0) && (
                          <div className="flex items-center gap-1">
                            {channel.mentions > 0 && (
                              <Badge variant="destructive" className="px-1 min-w-5 h-5 flex items-center justify-center">
                                {channel.mentions}
                              </Badge>
                            )}
                            {channel.unreadCount > 0 && channel.mentions === 0 && (
                              <Badge variant="secondary" className="px-1 min-w-5 h-5 flex items-center justify-center">
                                {channel.unreadCount}
                              </Badge>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {unpinnedChannels.length > 0 && (
                  <div>
                    {pinnedChannels.length > 0 && (
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Canale
                      </div>
                    )}
                    
                    {unpinnedChannels.map(channel => (
                      <button
                        key={channel.id}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-all",
                          channel.id === selectedChannelId
                            ? "bg-iflows-primary text-white font-medium shadow-sm"
                            : "hover:bg-iflows-primary/10"
                        )}
                        onClick={() => onSelectChannel(channel)}
                      >
                        <div className="flex items-center overflow-hidden">
                          {channel.isPrivate ? (
                            <Lock className={cn("h-3.5 w-3.5 mr-1.5 flex-shrink-0", 
                              channel.id === selectedChannelId ? "text-white" : "text-muted-foreground")} />
                          ) : (
                            <Hash className={cn("h-3.5 w-3.5 mr-1.5 flex-shrink-0", 
                              channel.id === selectedChannelId ? "text-white" : "text-muted-foreground")} />
                          )}
                          <span className="truncate">{channel.name}</span>
                        </div>
                        
                        {(channel.unreadCount > 0 || channel.mentions > 0) && (
                          <div className="flex items-center gap-1">
                            {channel.mentions > 0 && (
                              <Badge variant="destructive" className="px-1 min-w-5 h-5 flex items-center justify-center">
                                {channel.mentions}
                              </Badge>
                            )}
                            {channel.unreadCount > 0 && channel.mentions === 0 && (
                              <Badge variant="secondary" className="px-1 min-w-5 h-5 flex items-center justify-center">
                                {channel.unreadCount}
                              </Badge>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {archivedChannels.length > 0 && (
                  <div className="mt-2">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center">
                      <Archive className="h-3 w-3 mr-1" />
                      Canale arhivate
                    </div>
                    
                    {archivedChannels.map(channel => (
                      <button
                        key={channel.id}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-all text-muted-foreground",
                          channel.id === selectedChannelId
                            ? "bg-muted font-medium"
                            : "hover:bg-muted/70"
                        )}
                        onClick={() => onSelectChannel(channel)}
                      >
                        <div className="flex items-center overflow-hidden">
                          <Hash className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          <span className="truncate">{channel.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {filteredChannels.length === 0 && (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    {searchQuery 
                      ? "Nu s-au găsit canale care să corespundă căutării"
                      : "Nu există canale disponibile"}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <div 
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setShowDirectMessages(!showDirectMessages)}
            >
              <div className="flex items-center text-sm font-medium">
                {showDirectMessages ? <ChevronDown className="h-4 w-4 mr-1.5 text-iflows-primary" /> : <ChevronRight className="h-4 w-4 mr-1.5 text-iflows-primary" />}
                Conversații directe
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-iflows-primary/10 hover:text-iflows-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add function to create new DM
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Conversație nouă</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {showDirectMessages && (
              <div className="mt-1 space-y-0.5 pl-2">
                {filteredDirectMessages.map(dm => {
                  const partner = getDMPartnerInfo(dm);
                  
                  return (
                    <button
                      key={dm.id}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-all",
                        dm.id === selectedChannelId
                          ? "bg-iflows-primary text-white font-medium shadow-sm"
                          : "hover:bg-iflows-primary/10"
                      )}
                      onClick={() => onSelectChannel(dm)}
                    >
                      <div className="flex items-center overflow-hidden">
                        <div className="relative flex-shrink-0 mr-2">
                          <div className="h-6 w-6 rounded-full overflow-hidden bg-muted border border-muted">
                            {partner?.avatar ? (
                              <img 
                                src={partner.avatar} 
                                alt={partner.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-3 w-3 m-1.5" />
                            )}
                          </div>
                          
                          {partner?.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-background"></div>
                          )}
                        </div>
                        
                        <span className="truncate">{partner?.name}</span>
                      </div>
                      
                      {(dm.unreadCount > 0 || dm.mentions > 0) && (
                        <div className="flex items-center gap-1">
                          {dm.mentions > 0 && (
                            <Badge variant="destructive" className="px-1 min-w-5 h-5 flex items-center justify-center">
                              {dm.mentions}
                            </Badge>
                          )}
                          {dm.unreadCount > 0 && dm.mentions === 0 && (
                            <Badge variant="secondary" className="px-1 min-w-5 h-5 flex items-center justify-center">
                              {dm.unreadCount}
                            </Badge>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
                
                {filteredDirectMessages.length === 0 && (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    {searchQuery 
                      ? "Nu s-au găsit conversații care să corespundă căutării"
                      : "Nu există conversații directe"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      
      <ChannelModal 
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onSave={handleCreateChannel}
        availableUsers={sampleUsers}
      />
    </div>
  );
};

export default ChannelList;
