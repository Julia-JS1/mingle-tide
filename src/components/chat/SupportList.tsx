import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  Bot, 
  UserCheck, 
  Clock, 
  Star,
  Trash2,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    type: 'ai' | 'operator' | 'user';
    avatar?: string;
  };
  timestamp: Date;
}

interface SupportConversation {
  id: string;
  title: string;
  status: 'active' | 'resolved' | 'waiting';
  messages: SupportMessage[];
  createdAt: Date;
  lastMessageAt: Date;
  isOperatorTransferred: boolean;
  operatorAvailable: boolean;
  rating?: number;
}

interface SupportListProps {
  conversations: SupportConversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: SupportConversation) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
}

const SupportList: React.FC<SupportListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations
    .filter(conv => 
      !searchQuery || 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      // Sortare: active > waiting > resolved, apoi după lastMessageAt
      const statusOrder = { active: 0, waiting: 1, resolved: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

  const getStatusBadge = (status: string, isOperatorTransferred: boolean) => {
    switch (status) {
      case 'active':
        return (
          <Badge className={cn(
            "text-xs",
            isOperatorTransferred 
              ? "bg-green-500/10 text-green-700 dark:text-green-400" 
              : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
          )}>
            {isOperatorTransferred ? (
              <>
                <UserCheck className="mr-1 h-3 w-3" />
                Operator
              </>
            ) : (
              <>
                <Bot className="mr-1 h-3 w-3" />
                AI
              </>
            )}
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 text-xs">
            <Check className="mr-1 h-3 w-3" />
            Rezolvat
          </Badge>
        );
      case 'waiting':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs">
            <Clock className="mr-1 h-3 w-3" />
            În așteptare
          </Badge>
        );
      default:
        return null;
    }
  };

  const getLastMessage = (conversation: SupportConversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return '';
    
    const maxLength = 60;
    const content = lastMessage.content;
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Acum' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 zi' : `${diffInDays} zile`;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Suport iFlows</h2>
          <Button onClick={onCreateConversation} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Conversație nouă
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Caută conversații..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-muted/50 border-0 rounded-lg focus:ring-2 focus:ring-iflows-primary/20 focus:border-0"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-4">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'Nu s-au găsit conversații' : 'Încă nu aveți conversații de suport'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Încercați să modificați termenii de căutare'
                  : 'Creați prima conversație pentru a obține ajutor de la asistentul nostru AI'
                }
              </p>
              {!searchQuery && (
                <Button onClick={onCreateConversation}>
                  <Bot className="mr-2 h-4 w-4" />
                  Creează prima conversație
                </Button>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-sm border",
                  selectedConversationId === conversation.id 
                    ? "ring-2 ring-iflows-primary/20 border-iflows-primary/30 bg-iflows-primary/5" 
                    : "hover:border-iflows-primary/20"
                )}
                onClick={() => onSelectConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-iflows-primary/10 text-iflows-primary">
                        {conversation.isOperatorTransferred ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium truncate pr-2">
                          {conversation.title}
                        </h4>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {getStatusBadge(conversation.status, conversation.isOperatorTransferred)}
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(conversation.lastMessageAt)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {getLastMessage(conversation)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {conversation.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                {conversation.rating}/5
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SupportList;