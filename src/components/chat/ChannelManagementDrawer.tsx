
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Archive,
  Hash,
  Lock,
  Pin,
  PinOff,
  Settings,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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

interface ChannelManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  isAdmin: boolean;
  onUpdateChannel?: (channel: Channel) => void;
  onDeleteChannel?: (channelId: string) => void;
  onArchiveChannel?: (channelId: string) => void;
  onUnarchiveChannel?: (channelId: string) => void;
  onPinChannel?: (channelId: string) => void;
  onUnpinChannel?: (channelId: string) => void;
}

const ChannelManagementDrawer: React.FC<ChannelManagementDrawerProps> = ({
  isOpen,
  onClose,
  channels,
  isAdmin,
  onUpdateChannel,
  onDeleteChannel,
  onArchiveChannel,
  onUnarchiveChannel,
  onPinChannel,
  onUnpinChannel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [editName, setEditName] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const startEditing = (channel: Channel) => {
    setEditingChannel(channel);
    setEditName(channel.name);
  };

  const saveEdit = () => {
    if (!editingChannel) return;
    if (!editName.trim()) {
      toast.error('Numele canalului nu poate fi gol');
      return;
    }

    const updatedChannel = {
      ...editingChannel,
      name: editName.trim()
    };

    if (onUpdateChannel) {
      onUpdateChannel(updatedChannel);
    } else {
      toast.success(`Canalul "${editingChannel.name}" a fost redenumit "${editName.trim()}"`);
    }
    
    setEditingChannel(null);
  };

  const cancelEdit = () => {
    setEditingChannel(null);
  };

  const handlePin = (channel: Channel) => {
    if (channel.isPinned) {
      if (onUnpinChannel) {
        onUnpinChannel(channel.id);
      } else {
        toast.success(`Canalul "${channel.name}" a fost dezancorat`);
      }
    } else {
      if (onPinChannel) {
        onPinChannel(channel.id);
      } else {
        toast.success(`Canalul "${channel.name}" a fost ancorat`);
      }
    }
  };

  const handleArchive = (channel: Channel) => {
    if (channel.isArchived) {
      if (onUnarchiveChannel) {
        onUnarchiveChannel(channel.id);
      } else {
        toast.success(`Canalul "${channel.name}" a fost dezarhivat`);
      }
    } else {
      if (onArchiveChannel) {
        onArchiveChannel(channel.id);
      } else {
        toast.success(`Canalul "${channel.name}" a fost arhivat`);
      }
    }
  };

  const handleDelete = (channel: Channel) => {
    if (onDeleteChannel) {
      onDeleteChannel(channel.id);
    } else {
      toast.success(`Canalul "${channel.name}" a fost șters`);
    }
  };

  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChannels = filteredChannels.filter(channel => !channel.isArchived);
  const archivedChannels = filteredChannels.filter(channel => channel.isArchived);

  return (
    <TooltipProvider>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[85vh] max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl">Gestionare canale</DrawerTitle>
            <DrawerDescription>
              Gestionează canalele de comunicare din platformă
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4">
            <div className="mb-4">
              <Input
                placeholder="Caută canale..."
                value={searchQuery}
                onChange={handleSearch}
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Hash className="h-4 w-4 mr-1" />
                  Canale active
                </h3>
                <Separator className="mb-3" />
                
                {activeChannels.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    Nu există canale active{searchQuery ? ' care să corespundă căutării' : ''}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeChannels.map(channel => (
                      <div 
                        key={channel.id}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 group transition-colors"
                      >
                        {editingChannel?.id === channel.id ? (
                          <div className="flex-1 flex items-center space-x-2">
                            {channel.isPrivate ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Hash className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-8"
                              autoFocus
                            />
                            <div className="space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={saveEdit}
                                className="h-8"
                              >
                                Salvează
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEdit}
                                className="h-8"
                              >
                                Anulează
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-2">
                              {channel.isPrivate ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Hash className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium">{channel.name}</span>
                              {channel.isPinned && (
                                <Pin className="h-3 w-3 text-muted-foreground" />
                              )}
                              {channel.isPrivate && (
                                <Badge variant="outline" className="text-xs">Privat</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {isAdmin && (
                                <>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => startEditing(channel)}
                                      >
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Editează canal</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => handlePin(channel)}
                                      >
                                        {channel.isPinned ? (
                                          <PinOff className="h-4 w-4" />
                                        ) : (
                                          <Pin className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{channel.isPinned ? 'Dezancorează canal' : 'Ancorează canal'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => handleArchive(channel)}
                                      >
                                        <Archive className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Arhivează canal</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(channel)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Șterge canal</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {archivedChannels.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Archive className="h-4 w-4 mr-1" />
                    Canale arhivate
                  </h3>
                  <Separator className="mb-3" />
                  
                  <div className="space-y-2">
                    {archivedChannels.map(channel => (
                      <div 
                        key={channel.id}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 group transition-colors text-muted-foreground"
                      >
                        <div className="flex items-center space-x-2">
                          <Hash className="h-4 w-4" />
                          <span>{channel.name}</span>
                        </div>
                        
                        {isAdmin && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => handleArchive(channel)}
                                >
                                  <Archive className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Dezarhivează canal</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(channel)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Șterge canal</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Închide</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </TooltipProvider>
  );
};

export default ChannelManagementDrawer;
