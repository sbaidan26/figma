import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  MessageSquare, 
  Plus, 
  Send,
  User,
  Building2,
  ChevronLeft,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Message {
  id: number;
  sender: 'parent' | 'other';
  senderName: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  recipient: string;
  recipientRole: 'teacher' | 'admin';
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    recipient: 'Mme Benali',
    recipientRole: 'teacher',
    lastMessage: 'Oui, Marie progresse très bien en mathématiques.',
    lastMessageTime: '14:32',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'parent',
        senderName: 'Vous',
        content: 'Bonjour Madame, comment se porte Marie en classe ?',
        timestamp: '14:15'
      },
      {
        id: 2,
        sender: 'other',
        senderName: 'Mme Benali',
        content: 'Bonjour ! Marie se porte très bien. Elle est très participative et s\'investit dans tous les ateliers.',
        timestamp: '14:20'
      },
      {
        id: 3,
        sender: 'parent',
        senderName: 'Vous',
        content: 'Merci beaucoup ! Et en mathématiques, comment va-t-elle ?',
        timestamp: '14:25'
      },
      {
        id: 4,
        sender: 'other',
        senderName: 'Mme Benali',
        content: 'Oui, Marie progresse très bien en mathématiques. Elle comprend rapidement les nouvelles notions.',
        timestamp: '14:32'
      },
    ]
  },
  {
    id: 2,
    recipient: 'Administration',
    recipientRole: 'admin',
    lastMessage: 'Le certificat médical a bien été reçu.',
    lastMessageTime: 'Hier',
    unread: 1,
    messages: [
      {
        id: 1,
        sender: 'parent',
        senderName: 'Vous',
        content: 'Bonjour, je vous envoie le certificat médical pour l\'absence de Marie.',
        timestamp: 'Hier 16:45'
      },
      {
        id: 2,
        sender: 'other',
        senderName: 'Administration',
        content: 'Le certificat médical a bien été reçu. L\'absence est maintenant justifiée. Bonne continuation.',
        timestamp: 'Hier 17:10'
      },
    ]
  },
];

export function MessagingView() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState<string>('');
  const [newConversationMessage, setNewConversationMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newMsg: Message = {
          id: conv.messages.length + 1,
          sender: 'parent',
          senderName: 'Vous',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: 'À l\'instant'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null);
    setNewMessage('');
  };

  const handleCreateConversation = () => {
    if (!newRecipient || !newConversationMessage.trim()) return;

    const recipientData = newRecipient === 'teacher' 
      ? { name: 'Mme Benali', role: 'teacher' as const }
      : { name: 'Administration', role: 'admin' as const };

    const newConv: Conversation = {
      id: conversations.length + 1,
      recipient: recipientData.name,
      recipientRole: recipientData.role,
      lastMessage: newConversationMessage,
      lastMessageTime: 'À l\'instant',
      unread: 0,
      messages: [
        {
          id: 1,
          sender: 'parent',
          senderName: 'Vous',
          content: newConversationMessage,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setConversations([newConv, ...conversations]);
    setIsNewConversationOpen(false);
    setNewRecipient('');
    setNewConversationMessage('');
    setSelectedConversation(newConv);
  };

  const getRecipientIcon = (role: string) => {
    return role === 'teacher' ? '👩‍🏫' : '🏢';
  };

  const getRecipientColor = (role: string) => {
    return role === 'teacher' 
      ? 'from-purple-400 to-purple-500' 
      : 'from-blue-400 to-blue-500';
  };

  // List view
  if (!selectedConversation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
              <CartoonEmoji type="chat" className="w-8 h-8" />
            </div>
            <div>
              <h2>Messagerie École-Famille</h2>
              <p className="text-muted-foreground">
                Communiquez avec l'enseignant et l'administration
              </p>
            </div>
          </div>
          
          <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle conversation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nouvelle conversation</DialogTitle>
                <DialogDescription>
                  Choisissez un destinataire et envoyez votre premier message
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Destinataire</Label>
                  <Select value={newRecipient} onValueChange={setNewRecipient}>
                    <SelectTrigger className="bg-input-background">
                      <SelectValue placeholder="Choisir un destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <span>👩‍🏫</span>
                          <span>Enseignante de mon enfant (Mme Benali)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <span>🏢</span>
                          <span>Administration de l'école</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Votre message</Label>
                  <Textarea
                    value={newConversationMessage}
                    onChange={(e) => setNewConversationMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="min-h-[120px] bg-input-background"
                  />
                </div>

                <Button 
                  onClick={handleCreateConversation}
                  disabled={!newRecipient || !newConversationMessage.trim()}
                  className="w-full bg-success"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-border/50 hover:border-primary/30"
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex items-start gap-3">
                <Avatar className={`w-12 h-12 border-2 border-white shadow-md bg-gradient-to-br ${getRecipientColor(conv.recipientRole)}`}>
                  <AvatarFallback className="text-white bg-transparent">
                    <span className="text-xl">{getRecipientIcon(conv.recipientRole)}</span>
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="truncate">{conv.recipient}</h3>
                    <p className="text-muted-foreground text-sm whitespace-nowrap ml-2">
                      {conv.lastMessageTime}
                    </p>
                  </div>
                  <p className="text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>

                {conv.unread > 0 && (
                  <Badge className="bg-destructive ml-2">
                    {conv.unread}
                  </Badge>
                )}
              </div>
            </Card>
          ))}

          {conversations.length === 0 && (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3>Aucune conversation</h3>
                  <p className="text-muted-foreground">
                    Commencez une nouvelle conversation avec l'enseignant ou l'administration
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Conversation view
  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedConversation(null)}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <Avatar className={`w-12 h-12 border-2 border-white shadow-md bg-gradient-to-br ${getRecipientColor(selectedConversation.recipientRole)}`}>
          <AvatarFallback className="text-white bg-transparent">
            <span className="text-xl">{getRecipientIcon(selectedConversation.recipientRole)}</span>
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3>{selectedConversation.recipient}</h3>
          <p className="text-muted-foreground">
            {selectedConversation.recipientRole === 'teacher' ? 'Enseignante CM2-A' : 'École Al-Amal'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {selectedConversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-md ${msg.sender === 'parent' ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-4 rounded-2xl ${
                  msg.sender === 'parent'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted rounded-bl-sm'
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
              </div>
              <p className={`text-muted-foreground text-xs mt-1 ${msg.sender === 'parent' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <Card className="p-4 border-2 border-border/50">
        <div className="flex gap-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Écrivez votre message..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-input-background"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-primary h-[60px] px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
