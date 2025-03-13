
import React, { useState } from 'react';
import MiniChat from '@/components/chat/MiniChat';
import { Link } from 'react-router-dom';

interface ChatLauncherProps {
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
}

const ChatLauncher: React.FC<ChatLauncherProps> = ({ currentUser }) => {
  const [expanded, setExpanded] = useState(false);

  // Mock channels
  const channels = [
    {
      id: "channel1",
      name: "general",
      type: "channel" as const,
      unreadCount: 3
    },
    {
      id: "channel2",
      name: "ui-team",
      type: "channel" as const,
      unreadCount: 0
    },
    {
      id: "channel3",
      name: "marketing",
      type: "channel" as const,
      unreadCount: 5
    }
  ];

  // Mock direct messages
  const directMessages = [
    {
      id: "dm1",
      name: "Maria Popescu",
      type: "direct" as const,
      users: [
        {
          id: "user2",
          name: "Maria Popescu",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        {
          id: "user1",
          name: "Adrian Ionescu",
          avatar: "https://i.pravatar.cc/150?img=1",
        }
      ],
      unreadCount: 2
    },
    {
      id: "dm2",
      name: "Ion Vasilescu",
      type: "direct" as const,
      users: [
        {
          id: "user3",
          name: "Ion Vasilescu",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        {
          id: "user1",
          name: "Adrian Ionescu",
          avatar: "https://i.pravatar.cc/150?img=1",
        }
      ],
      unreadCount: 0
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

  // Mock users
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

  const handleCloseMiniChat = () => {
    setExpanded(false);
  };

  const handleExpandFull = () => {
    // In a real app, redirect to the full chat page
    window.location.href = '/chat';
  };

  return (
    <MiniChat
      currentUser={currentUser}
      initialChannel={channels[0]}
      initialExpanded={expanded}
      userChannels={[...channels, ...directMessages]}
      users={users}
      documents={documents}
      onClose={handleCloseMiniChat}
      onExpandFull={handleExpandFull}
    />
  );
};

export default ChatLauncher;
