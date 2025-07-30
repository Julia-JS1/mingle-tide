import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import SupportList from '@/components/chat/SupportList';
import SupportChat from '@/components/chat/SupportChat';
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

const Support = () => {
  const [conversations, setConversations] = useState<SupportConversation[]>([
    {
      id: 'support-1',
      title: 'Problemă cu sincronizarea datelor',
      status: 'resolved',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isOperatorTransferred: true,
      operatorAvailable: true,
      rating: 5,
      messages: [
        {
          id: 'msg1',
          content: 'Bună! Sunt Asistentul AI iFlows. Cu ce vă pot ajuta azi?',
          sender: {
            id: 'ai-assistant',
            name: 'iFlows AI Assistant',
            type: 'ai'
          },
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'msg2',
          content: 'Am o problemă cu sincronizarea datelor. Modificările pe care le fac nu se salvează corect.',
          sender: {
            id: 'current-user',
            name: 'Tu',
            type: 'user'
          },
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000)
        },
        {
          id: 'msg3',
          content: 'Înțeleg problema. Vă transfer la un coleg specialist pentru a rezolva această situație cât mai repede.',
          sender: {
            id: 'ai-assistant',
            name: 'iFlows AI Assistant',
            type: 'ai'
          },
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120000)
        },
        {
          id: 'msg4',
          content: 'Bună ziua! Sunt Mihai din echipa tehnică. Am rezolvat problema cu sincronizarea. Acum totul ar trebui să funcționeze normal.',
          sender: {
            id: 'operator-2',
            name: 'Mihai Ionescu',
            type: 'operator',
            avatar: 'https://i.pravatar.cc/150?img=8'
          },
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 'support-2',
      title: 'Întrebări despre facturare',
      status: 'active',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isOperatorTransferred: false,
      operatorAvailable: true,
      messages: [
        {
          id: 'msg5',
          content: 'Bună! Sunt Asistentul AI iFlows. Cu ce vă pot ajuta azi?',
          sender: {
            id: 'ai-assistant',
            name: 'iFlows AI Assistant',
            type: 'ai'
          },
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        {
          id: 'msg6',
          content: 'Vreau să știu cum pot schimba planul de facturare pentru companie.',
          sender: {
            id: 'current-user',
            name: 'Tu',
            type: 'user'
          },
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
        },
        {
          id: 'msg7',
          content: 'Puteți schimba planul din secțiunea Setări > Facturare din contul dumneavoastră. Aveți acces la această secțiune ca administrator?',
          sender: {
            id: 'ai-assistant',
            name: 'iFlows AI Assistant',
            type: 'ai'
          },
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        }
      ]
    }
  ]);
  
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);

  const handleCreateConversation = () => {
    const newConversation: SupportConversation = {
      id: `support-${Date.now()}`,
      title: 'Conversație nouă de suport',
      status: 'active',
      createdAt: new Date(),
      lastMessageAt: new Date(),
      isOperatorTransferred: false,
      operatorAvailable: true,
      messages: [
        {
          id: `welcome-${Date.now()}`,
          content: 'Bună! Sunt Asistentul AI iFlows. Cu ce vă pot ajuta azi?',
          sender: {
            id: 'ai-assistant',
            name: 'iFlows AI Assistant',
            type: 'ai'
          },
          timestamp: new Date()
        }
      ]
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    toast.success('Conversație nouă creată');
  };

  const handleSelectConversation = (conversation: SupportConversation) => {
    setSelectedConversation(conversation);
  };

  const handleUpdateConversation = (updatedConversation: SupportConversation) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
    setSelectedConversation(updatedConversation);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
    
    toast.success('Conversația a fost ștearsă');
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex">
        {/* Support List Sidebar */}
        <div className="w-80 border-r bg-background flex-shrink-0">
          <SupportList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            onCreateConversation={handleCreateConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>

        {/* Support Chat Area */}
        <div className="flex-1">
          <SupportChat
            conversation={selectedConversation || undefined}
            onUpdateConversation={handleUpdateConversation}
            onCreateConversation={handleCreateConversation}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Support;