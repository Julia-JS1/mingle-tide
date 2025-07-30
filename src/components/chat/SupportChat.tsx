import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  User, 
  Send, 
  Paperclip, 
  Star, 
  StarOff,
  Check,
  Clock,
  AlertCircle,
  Edit3,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
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

interface SupportChatProps {
  conversation?: SupportConversation;
  onUpdateConversation?: (conversation: SupportConversation) => void;
  onCreateConversation?: (title: string) => void;
}

const SupportChat: React.FC<SupportChatProps> = ({
  conversation,
  onUpdateConversation,
  onCreateConversation
}) => {
  const [message, setMessage] = useState('');
  const [isOperatorAvailable, setIsOperatorAvailable] = useState(true);
  const [interactionCount, setInteractionCount] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  // Simulare disponibilitate operator bazată pe ora zilei
  useEffect(() => {
    const checkOperatorAvailability = () => {
      const hour = new Date().getHours();
      // Simulăm program 8:00 - 20:00
      setIsOperatorAvailable(hour >= 8 && hour < 20);
    };
    
    checkOperatorAvailability();
    const interval = setInterval(checkOperatorAvailability, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() || !conversation) return;

    const newMessage: SupportMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: {
        id: 'current-user',
        name: 'Tu',
        type: 'user'
      },
      timestamp: new Date()
    };

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastMessageAt: new Date()
    };

    // Simulare răspuns AI după o scurtă întârziere
    setTimeout(() => {
      if (!updatedConversation.isOperatorTransferred) {
        const aiResponse: SupportMessage = {
          id: `ai-${Date.now()}`,
          content: generateAIResponse(message),
          sender: {
            id: 'ai-assistant',
            name: 'iFlows AI Assistant',
            type: 'ai'
          },
          timestamp: new Date()
        };

        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, aiResponse],
          lastMessageAt: new Date()
        };

        onUpdateConversation?.(finalConversation);
        setInteractionCount(prev => prev + 1);
      }
    }, 1000);

    onUpdateConversation?.(updatedConversation);
    setMessage('');
    setInteractionCount(prev => prev + 1);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "Înțeleg problema dumneavoastră. Vă pot ajuta să rezolvați această situație. Puteți să-mi spuneți mai multe detalii?",
      "Mulțumesc pentru informații. Bazat pe ceea ce mi-ați spus, vă recomand să verificați setările din contul dumneavoastră.",
      "Aceasta este o problemă comună. Vă voi ghida pas cu pas pentru a o rezolva. Primul pas este să accesați meniul principal.",
      "Pentru a vă ajuta mai bine, am nevoie de câteva informații suplimentare. Ce anume nu funcționează corect?",
      "Vă înțeleg frustrarea. Să încerc să vă ajut să rezolvăm această problemă cât mai repede posibil."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleTransferToOperator = () => {
    if (!conversation) return;

    if (isOperatorAvailable) {
      const transferMessage: SupportMessage = {
        id: `transfer-${Date.now()}`,
        content: "Un coleg de la Suport va prelua conversația în scurt timp.",
        sender: {
          id: 'system',
          name: 'Sistem',
          type: 'ai'
        },
        timestamp: new Date()
      };

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, transferMessage],
        isOperatorTransferred: true,
        lastMessageAt: new Date()
      };

      // Simulare preluare de către operator după 3 secunde
      setTimeout(() => {
        const operatorMessage: SupportMessage = {
          id: `op-${Date.now()}`,
          content: "Bună ziua! Sunt Ana din echipa de suport iFlows. Am preluat conversația și vă voi ajuta să rezolvați problema.",
          sender: {
            id: 'operator-1',
            name: 'Ana Popescu',
            type: 'operator',
            avatar: 'https://i.pravatar.cc/150?img=5'
          },
          timestamp: new Date()
        };

        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, operatorMessage],
          lastMessageAt: new Date()
        };

        onUpdateConversation?.(finalConversation);
      }, 3000);

      onUpdateConversation?.(updatedConversation);
      toast.success("Conversația a fost transferată la un operator");
    } else {
      const unavailableMessage: SupportMessage = {
        id: `unavailable-${Date.now()}`,
        content: "Momentan nu sunt operatori activi. Lăsați un mesaj și vă vom răspunde în cel mai scurt timp.",
        sender: {
          id: 'system',
          name: 'Sistem',
          type: 'ai'
        },
        timestamp: new Date()
      };

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, unavailableMessage],
        lastMessageAt: new Date()
      };

      onUpdateConversation?.(updatedConversation);
      toast.info("Operatorii nu sunt disponibili în acest moment");
    }
  };

  const handleMarkAsResolved = () => {
    if (!conversation) return;

    const updatedConversation = {
      ...conversation,
      status: 'resolved' as const,
      lastMessageAt: new Date()
    };

    onUpdateConversation?.(updatedConversation);
    setShowFeedback(true);
    toast.success("Conversația a fost marcată ca rezolvată");
  };

  const handleTitleEdit = () => {
    setEditingTitle(true);
    setNewTitle(conversation?.title || '');
  };

  const handleTitleSave = () => {
    if (!conversation || !newTitle.trim()) {
      setEditingTitle(false);
      return;
    }

    const updatedConversation = {
      ...conversation,
      title: newTitle.trim()
    };

    onUpdateConversation?.(updatedConversation);
    setEditingTitle(false);
    toast.success("Titlul conversației a fost actualizat");
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    if (conversation) {
      const updatedConversation = {
        ...conversation,
        rating: stars
      };
      onUpdateConversation?.(updatedConversation);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Activ</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">Rezolvat</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">În așteptare</Badge>;
      default:
        return null;
    }
  };

  const getSenderIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Bot className="h-4 w-4" />;
      case 'operator':
        return <UserCheck className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Suport iFlows</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Selectați o conversație existentă sau creați una nouă pentru a începe.
            </p>
            <Button 
              onClick={() => onCreateConversation?.("Conversație nouă de suport")}
              className="w-full"
            >
              <Bot className="mr-2 h-4 w-4" />
              Creează conversație nouă
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              {editingTitle ? (
                <div className="flex items-center space-x-2">
                  <Input
                    ref={titleInputRef}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleSave();
                      } else if (e.key === 'Escape') {
                        setEditingTitle(false);
                      }
                    }}
                    className="h-8"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold truncate">{conversation.title}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleTitleEdit}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(conversation.status)}
            {conversation.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsResolved}
              >
                <Check className="mr-2 h-4 w-4" />
                Marchează ca rezolvat
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex space-x-3",
                msg.sender.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender.type !== 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {msg.sender.avatar ? (
                    <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                  ) : (
                    <AvatarFallback className={cn(
                      "text-xs",
                      msg.sender.type === 'ai' ? "bg-blue-500/10 text-blue-600" :
                      msg.sender.type === 'operator' ? "bg-green-500/10 text-green-600" :
                      "bg-gray-500/10 text-gray-600"
                    )}>
                      {getSenderIcon(msg.sender.type)}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              
              <div className={cn(
                "max-w-[70%] space-y-1",
                msg.sender.type === 'user' ? "items-end" : "items-start"
              )}>
                {msg.sender.type !== 'user' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{msg.sender.name}</span>
                    {msg.sender.type === 'ai' && (
                      <Badge variant="secondary" className="text-xs">AI</Badge>
                    )}
                    {msg.sender.type === 'operator' && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                        Operator
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  msg.sender.type === 'user' 
                    ? "bg-iflows-primary text-white"
                    : msg.sender.type === 'ai'
                    ? "bg-blue-500/10 text-foreground border"
                    : "bg-green-500/10 text-foreground border"
                )}>
                  {msg.content}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString('ro-RO', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              {msg.sender.type === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-iflows-primary/10 text-iflows-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Transfer Button (shown after first interaction) */}
      {interactionCount > 0 && !conversation.isOperatorTransferred && conversation.status === 'active' && (
        <div className="px-4 pb-2">
          <Button
            variant="outline"
            onClick={handleTransferToOperator}
            className="w-full"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Transferă la operator
            {!isOperatorAvailable && (
              <Badge variant="secondary" className="ml-2">
                <Clock className="mr-1 h-3 w-3" />
                În afara programului
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Input Area */}
      {conversation.status === 'active' && (
        <div className="border-t p-4 space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Textarea
                placeholder="Scrieți mesajul dumneavoastră..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Trimite
            </Button>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {showFeedback && conversation.status === 'resolved' && (
        <div className="border-t p-4 bg-muted/30">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Evaluează experiența</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRating(star)}
                  >
                    {star <= (rating || 0) ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                ))}
              </div>
              
              <Textarea
                placeholder="Feedback opțional..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="h-20"
              />
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => {
                    toast.success("Mulțumim pentru feedback!");
                    setShowFeedback(false);
                  }}
                >
                  Trimite feedback
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFeedback(false)}
                >
                  Omite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SupportChat;