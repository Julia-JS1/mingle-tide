
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { CalendarIcon, CheckIcon, FileTextIcon, LockIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskData) => void;
  messageContent: string;
  mentionedUser?: string;
}

export interface TaskData {
  title: string;
  description: string;
  assignee: string;
  privacy: 'public' | 'private';
  dueDate: Date | undefined;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  messageContent,
  mentionedUser
}) => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: messageContent,
    assignee: mentionedUser || '',
    privacy: 'public',
    dueDate: undefined
  });

  const handleSave = () => {
    onSave(taskData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-500" />
            Creează sarcină nouă
          </DialogTitle>
          <DialogDescription>
            Completează detaliile sarcinii pentru a o crea.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              Titlu
            </Label>
            <Input
              id="title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              placeholder="Adaugă un titlu pentru sarcină"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              Descriere
            </Label>
            <Textarea
              id="description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              placeholder="Adaugă o descriere detaliată"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignee" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              Responsabil
            </Label>
            <Input
              id="assignee"
              value={taskData.assignee}
              onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
              placeholder="Numele responsabilului"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="privacy" className="flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-muted-foreground" />
              Confidențialitate
            </Label>
            <Select
              value={taskData.privacy}
              onValueChange={(value: 'public' | 'private') => 
                setTaskData({ ...taskData, privacy: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează confidențialitatea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Privat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              Termen limită
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !taskData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {taskData.dueDate ? (
                    format(taskData.dueDate, "PPP", { locale: ro })
                  ) : (
                    <span>Selectează data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={taskData.dueDate}
                  onSelect={(date) => setTaskData({ ...taskData, dueDate: date })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button onClick={handleSave} disabled={!taskData.title.trim()}>
            Creează sarcina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
