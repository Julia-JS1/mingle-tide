
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ChatLauncher from "@/components/chat/ChatLauncher";

const Index = () => {
  // Mock current user
  const currentUser = {
    id: "user1",
    name: "Adrian Ionescu",
    avatar: "https://i.pravatar.cc/150?img=1"
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 gap-8">
      <h1 className="text-4xl font-bold text-center">
        Welcome to the iFlows Platform
      </h1>
      <p className="text-xl text-center max-w-2xl text-muted-foreground">
        Accesează modulul de chat pentru a comunica cu echipa ta și a gestiona documentele în timp real.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/chat">Deschide Chat</Link>
        </Button>
      </div>
      
      {/* Add the ChatLauncher component for mini-chat functionality */}
      <ChatLauncher currentUser={currentUser} />
    </div>
  );
};

export default Index;
