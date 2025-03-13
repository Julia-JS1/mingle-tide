
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Globe, Lock, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (channelData: ChannelData) => void;
  availableUsers: User[];
}

export interface ChannelData {
  name: string;
  isPrivate: boolean;
  allowedUsers: User[];
}

const ChannelModal: React.FC<ChannelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableUsers
}) => {
  const [channelData, setChannelData] = useState<ChannelData>({
    name: '',
    isPrivate: false,
    allowedUsers: []
  });

  const handleSave = () => {
    onSave(channelData);
    onClose();
    // Reset the form after saving
    setChannelData({
      name: '',
      isPrivate: false,
      allowedUsers: []
    });
  };

  const toggleUserSelection = (user: User) => {
    setChannelData(prev => {
      const isSelected = prev.allowedUsers.some(u => u.id === user.id);
      
      if (isSelected) {
        return {
          ...prev,
          allowedUsers: prev.allowedUsers.filter(u => u.id !== user.id)
        };
      } else {
        return {
          ...prev,
          allowedUsers: [...prev.allowedUsers, user]
        };
      }
    });
  };

  const isFormValid = channelData.name.trim() !== '' && 
    (!channelData.isPrivate || channelData.allowedUsers.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {channelData.isPrivate ? 
              <Lock className="h-5 w-5 text-iflows-primary" /> : 
              <Globe className="h-5 w-5 text-iflows-primary" />
            }
            Crează canal nou
          </DialogTitle>
          <DialogDescription>
            Completează detaliile canalului pentru a-l crea.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              Nume canal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={channelData.name}
              onChange={(e) => setChannelData({ ...channelData, name: e.target.value })}
              placeholder="Adaugă un nume pentru canal"
              required
              className={!channelData.name.trim() ? "border-red-300 focus-visible:ring-red-500" : ""}
            />
            {!channelData.name.trim() && (
              <p className="text-xs text-red-500 mt-1">Numele canalului este obligatoriu</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="private-channel" className="flex items-center gap-2 cursor-pointer">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Canal privat
              </Label>
            </div>
            <Switch
              id="private-channel"
              checked={channelData.isPrivate}
              onCheckedChange={(checked) => setChannelData({ ...channelData, isPrivate: checked })}
            />
          </div>

          {channelData.isPrivate && (
            <div className="grid gap-2 mt-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Membrii cu acces <span className="text-red-500">*</span>
              </Label>
              
              <div className="border rounded-md p-1">
                <ScrollArea className="h-[150px] pr-4">
                  <div className="space-y-2 p-2">
                    {availableUsers.map(user => (
                      <div key={user.id} className="flex items-center space-x-2 py-1">
                        <Checkbox 
                          id={`user-${user.id}`} 
                          checked={channelData.allowedUsers.some(u => u.id === user.id)}
                          onCheckedChange={() => toggleUserSelection(user)}
                        />
                        <Label 
                          htmlFor={`user-${user.id}`}
                          className="cursor-pointer text-sm flex-1"
                        >
                          {user.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {channelData.isPrivate && channelData.allowedUsers.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Selectați cel puțin un utilizator pentru canalul privat</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Creează canal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelModal;
