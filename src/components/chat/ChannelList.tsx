import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Search, 
  Hash, 
  Plus, 
  Settings, 
  User, 
  Lock, 
  Unlock,
  ChevronRight,
  ChevronDown,
  Pin,
  Archive,
  Users,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ChannelModal, { ChannelData } from './ChannelModal';
import ChannelManagementDrawer from './ChannelManagementDrawer';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Channel {
  id: string;
  name: string;
  type: 'channel';
  isPrivate: boolean;
  isPinned: boolean;
  isArchived: boolean;
  unreadCount: number;
  mentions: number;
  members?: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
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
  const [showSupport, setShowSupport] = useState(true);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isManageChannelsOpen, setIsManageChannelsOpen] = useState(false);
  const [isNewDmDialogOpen, setIsNewDmDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<{id: string, name: string}[]>([]);
  
  const sampleUsers = [
    { id: "1", name: "Ana Popescu" },
    { id: "2", name: "Mihai Ionescu" },
    { id: "3", name: "Elena Dragomir" },
    { id: "4", name: "Alexandru Dumitrescu" },
    { id: "5", name: "Maria Stan" },
  ];
  
  // Mock support conversations data
  const supportConversations = [
    { id: 'support-1', title: 'Problemă cu sincronizarea', status: 'resolved', unreadCount: 0 },
    { id: 'support-2', title: 'Întrebări despre facturare', status: 'active', unreadCount: 1 },
  ];
  
  const channelsWithMembers = channels.map(channel => {
    if (channel.isPrivate && !channel.members) {
      return {
        ...channel,
        members: [
          {
            id: "user1",
            name: "Adrian Ionescu",
            avatar: "https://i.pravatar.cc/150?img=1",
          },
          {
            id: "user2",
            name: "Maria Popescu",
            avatar: "https://i.pravatar.cc/150?img=5",
          },
          {
            id: "user4",
            name: "Elena Dumitrescu",
            avatar: "https://i.pravatar.cc/150?img=4",
          }
        ]
      };
    }
    return channel;
  });
  
  const filteredChannels = channelsWithMembers
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

  const handleManageChannels = () => {
    setIsManageChannelsOpen(true);
    if (onManageChannels) {
      onManageChannels();
    }
    console.info("Manage channels");
  };

  const handleCreateDirectMessage = () => {
    setIsNewDmDialogOpen(true);
  };

  const handleStartDirectMessage = () => {
    if (selectedUsers.length === 0) {
      toast.error("Selectează cel puțin un utilizator pentru conversație");
      return;
    }

    const usersString = selectedUsers.map(u => u.name).join(", ");
    
    toast.success(`Conversație nouă creată cu ${usersString}`, {
      description: "Poți începe să trimiți mesaje acum"
    });
    
    setIsNewDmDialogOpen(false);
    setSelectedUsers([]);

    console.info("Create direct message with", selectedUsers);
  };

  const toggleUserSelection = (user: {id: string, name: string}) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const renderChannelIcon = (channel: Channel, isSelected: boolean) => {
    if (channel.isPrivate) {
      return <Lock className={cn("h-3.5 w-3.5 mr-1.5 flex-shrink-0", 
        isSelected ? "text-white" : "text-muted-foreground")} />;
    } else {
      return <Hash className={cn("h-3.5 w-3.5 mr-1.5 flex-shrink-0", 
        isSelected ? "text-white" : "text-muted-foreground")} />;
    }
  };

  const renderChannelStatus = (channel: Channel, isSelected: boolean) => {
    if (!channel.isPrivate) {
      return (
        <span className={cn("text-xs px-1.5 py-0.5 rounded-sm ml-1.5", 
          isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>
          Public
        </span>
      );
    }
    
    return (
      <span className={cn("text-xs px-1.5 py-0.5 rounded-sm ml-1.5 flex items-center", 
        isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>
        <Lock className="h-2.5 w-2.5 mr-0.5" />
        Privat
      </span>
    );
  };

  const renderChannelMembers = (channel: Channel, isSelected: boolean) => {
    if (!channel.isPrivate || !channel.members || channel.members.length === 0) {
      return null;
    }
    
    const visibleMembers = channel.members.slice(0, 3);
    const extraMembersCount = channel.members.length - visibleMembers.length;
    
    return (
      <div className="flex -space-x-2 ml-auto mr-2">
        {visibleMembers.map((member, index) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-5 w-5 border border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-[8px]">
                  {member.name.split(' ').map(part => part[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{member.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {extraMembersCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center justify-center h-5 w-5 rounded-full text-[8px] font-medium border border-background",
                isSelected ? "bg-white/30 text-white" : "bg-muted text-muted-foreground"
              )}>
                +{extraMembersCount}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{extraMembersCount} membri în plus</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  const renderChannel = (channel: Channel) => {
    const isSelected = channel.id === selectedChannelId;
    
    return (
      <button
        key={channel.id}
        className={cn(
          "w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-all",
          isSelected
            ? "bg-iflows-primary text-white font-medium shadow-sm"
            : "hover:bg-iflows-primary/10"
        )}
        onClick={() => onSelectChannel(channel)}
      >
        <div className="flex items-center overflow-hidden flex-grow min-w-0">
          <div className="flex items-center min-w-0 flex-shrink-0">
            {renderChannelIcon(channel, isSelected)}
            <span className="truncate">{channel.name}</span>
            {renderChannelStatus(channel, isSelected)}
            {channel.isPinned && (
              <Pin className={cn("h-3 w-3 ml-1.5", 
                isSelected ? "text-white/70" : "text-muted-foreground")} />
            )}
          </div>
        </div>
        
        {renderChannelMembers(channel, isSelected)}
        
        {(channel.unreadCount > 0 || channel.mentions > 0) && (
          <div className="flex items-center gap-1 flex-shrink-0">
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
    );
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
                            handleManageChannels();
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
                    
                    {pinnedChannels.map(channel => renderChannel(channel))}
                  </div>
                )}
                
                {unpinnedChannels.length > 0 && (
                  <div>
                    {pinnedChannels.length > 0 && (
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Canale
                      </div>
                    )}
                    
                    {unpinnedChannels.map(channel => renderChannel(channel))}
                  </div>
                )}
                
                {archivedChannels.length > 0 && (
                  <div className="mt-2">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center">
                      <Archive className="h-3 w-3 mr-1" />
                      Canale arhivate
                    </div>
                    
                    {archivedChannels.map(channel => renderChannel(channel))}
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
          
          <div className="mb-4">
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
                        handleCreateDirectMessage();
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
          
          {/* Support Section */}
          <div>
            <div 
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setShowSupport(!showSupport)}
            >
              <div className="flex items-center text-sm font-medium">
                {showSupport ? <ChevronDown className="h-4 w-4 mr-1.5 text-iflows-primary" /> : <ChevronRight className="h-4 w-4 mr-1.5 text-iflows-primary" />}
                Suport
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
                        window.location.href = '/support';
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Conversație nouă de suport</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {showSupport && (
              <div className="mt-1 space-y-0.5 pl-2">
                {supportConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to="/support"
                    className="w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-all hover:bg-iflows-primary/10"
                  >
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-iflows-primary" />
                      <span className="truncate">{conv.title}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Badge className={cn(
                        "text-xs",
                        conv.status === 'active' ? "bg-green-500/10 text-green-700" : "bg-gray-500/10 text-gray-700"
                      )}>
                        {conv.status === 'active' ? 'Activ' : 'Rezolvat'}
                      </Badge>
                      
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="px-1 min-w-5 h-5">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
                
                <Link
                  to="/support"
                  className="w-full flex items-center px-2 py-2 rounded-md text-sm transition-all hover:bg-iflows-primary/10 text-muted-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Crează conversație nouă</span>
                </Link>
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
      
      <ChannelManagementDrawer
        isOpen={isManageChannelsOpen}
        onClose={() => setIsManageChannelsOpen(false)}
        channels={channels}
        isAdmin={isAdmin}
      />

      <Dialog open={isNewDmDialogOpen} onOpenChange={setIsNewDmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conversație directă nouă</DialogTitle>
            <DialogDescription>
              Selectează utilizatorii cu care dorești să începi o conversație
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                placeholder="Caută utilizatori..."
                className="pl-9"
              />
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sampleUsers.map((user) => (
                <div 
                  key={user.id}
                  className={cn(
                    "flex items-center p-2 rounded-md cursor-pointer transition-colors",
                    selectedUsers.some(u => u.id === user.id)
                      ? "bg-iflows-primary/10 text-iflows-primary"
                      : "hover:bg-muted"
                  )}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted border border-muted mr-3 flex-shrink-0">
                    <User className="h-4 w-4 m-2" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                  {selectedUsers.some(u => u.id === user.id) && (
                    <div className="ml-auto bg-iflows-primary text-white rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsNewDmDialogOpen(false);
                setSelectedUsers([]);
              }}
            >
              Anulează
            </Button>
            <Button 
              variant="default" 
              onClick={handleStartDirectMessage}
              disabled={selectedUsers.length === 0}
            >
              Începe conversația
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChannelList;

