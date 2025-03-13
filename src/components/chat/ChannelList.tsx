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
  onCreateChannel?: () => void;
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

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Caută în chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="mb-4">
            <div 
              className="flex items-center justify-between px-2 py-1 cursor-pointer"
              onClick={() => setShowChannels(!showChannels)}
            >
              <div className="flex items-center text-sm font-medium">
                {showChannels ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
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
                          className="h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateChannel?.();
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
                          className="h-6 w-6 rounded-full"
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
              <div className="mt-1 space-y-0.5">
                {pinnedChannels.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Canale ancorate
                    </div>
                    
                    {pinnedChannels.map(channel => (
                      <button
                        key={channel.id}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors",
                          channel.id === selectedChannelId
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => onSelectChannel(channel)}
                      >
                        <div className="flex items-center overflow-hidden">
                          <div className="flex items-center min-w-0">
                            {channel.isPrivate ? (
                              <Lock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            ) : (
                              <Hash className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            )}
                            <span className="truncate">{channel.name}</span>
                          </div>
                          
                          <Pin className="h-3 w-3 ml-1.5 text-muted-foreground" />
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
                          "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors",
                          channel.id === selectedChannelId
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => onSelectChannel(channel)}
                      >
                        <div className="flex items-center overflow-hidden">
                          {channel.isPrivate ? (
                            <Lock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          ) : (
                            <Hash className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
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
                          "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors text-muted-foreground",
                          channel.id === selectedChannelId
                            ? "bg-accent font-medium"
                            : "hover:bg-muted"
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
              className="flex items-center justify-between px-2 py-1 cursor-pointer"
              onClick={() => setShowDirectMessages(!showDirectMessages)}
            >
              <div className="flex items-center text-sm font-medium">
                {showDirectMessages ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                Conversații directe
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
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
              <div className="mt-1 space-y-0.5">
                {filteredDirectMessages.map(dm => {
                  const partner = getDMPartnerInfo(dm);
                  
                  return (
                    <button
                      key={dm.id}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors",
                        dm.id === selectedChannelId
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-muted"
                      )}
                      onClick={() => onSelectChannel(dm)}
                    >
                      <div className="flex items-center overflow-hidden">
                        <div className="relative flex-shrink-0 mr-2">
                          <div className="h-5 w-5 rounded-full overflow-hidden bg-muted">
                            {partner?.avatar ? (
                              <img 
                                src={partner.avatar} 
                                alt={partner.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-3 w-3 m-1" />
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
    </div>
  );
};

export default ChannelList;
