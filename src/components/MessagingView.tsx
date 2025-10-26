import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  MessageSquare,
  Plus,
  Send,
  ChevronLeft,
  Loader2,
  Search,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'student' | 'parent' | 'teacher' | 'admin';
  recipient_id: string;
  recipient_name: string;
  recipient_role: 'student' | 'parent' | 'teacher' | 'admin';
  subject: string;
  content: string;
  read: boolean;
  replied: boolean;
  parent_message_id: string | null;
  created_at: string;
  read_at: string | null;
}

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_role: 'student' | 'parent' | 'teacher' | 'admin';
  last_message: string;
  last_message_time: string;
  unread_count: number;
  messages: Message[];
}

interface User {
  id: string;
  name: string;
  role: string;
}

export function MessagingView() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState<string>('');
  const [newSubject, setNewSubject] = useState('');
  const [newConversationMessage, setNewConversationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [availableRecipients, setAvailableRecipients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchAvailableRecipients();

      const channel = supabase
        .channel('messages_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          () => {
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchAvailableRecipients = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('users')
        .select('id, name, role')
        .neq('id', user.id)
        .eq('status', 'active');

      if (user.role === 'parent') {
        query = query.in('role', ['teacher', 'admin']);
      } else if (user.role === 'student') {
        query = query.in('role', ['teacher', 'admin']);
      } else if (user.role === 'teacher') {
        query = query.in('role', ['parent', 'student', 'admin']);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      setAvailableRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationsMap = new Map<string, Conversation>();

      messages?.forEach((msg: Message) => {
        const isCurrentUserSender = msg.sender_id === user.id;
        const otherUserId = isCurrentUserSender ? msg.recipient_id : msg.sender_id;
        const otherUserName = isCurrentUserSender ? msg.recipient_name : msg.sender_name;
        const otherUserRole = isCurrentUserSender ? msg.recipient_role : msg.sender_role;

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            id: otherUserId,
            other_user_id: otherUserId,
            other_user_name: otherUserName,
            other_user_role: otherUserRole,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
            messages: []
          });
        }

        const conv = conversationsMap.get(otherUserId)!;
        conv.messages.push(msg);

        if (!isCurrentUserSender && !msg.read) {
          conv.unread_count++;
        }
      });

      const convArray = Array.from(conversationsMap.values());
      convArray.forEach(conv => {
        conv.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });

      setConversations(convArray);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          sender_name: user.name,
          sender_role: user.role,
          recipient_id: selectedConversation.other_user_id,
          recipient_name: selectedConversation.other_user_name,
          recipient_role: selectedConversation.other_user_role,
          subject: 'Re: Conversation',
          content: newMessage
        });

      if (error) throw error;

      setNewMessage('');
      await fetchConversations();

      const updatedConv = conversations.find(c => c.id === selectedConversation.id);
      if (updatedConv) {
        setSelectedConversation(updatedConv);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleCreateConversation = async () => {
    if (!newRecipientId || !newConversationMessage.trim() || !user) return;

    setSending(true);

    try {
      const recipient = availableRecipients.find(r => r.id === newRecipientId);
      if (!recipient) return;

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          sender_name: user.name,
          sender_role: user.role,
          recipient_id: recipient.id,
          recipient_name: recipient.name,
          recipient_role: recipient.role,
          subject: newSubject || 'Nouveau message',
          content: newConversationMessage
        });

      if (error) throw error;

      toast.success('Message envoyé avec succès');
      setIsNewConversationOpen(false);
      setNewRecipientId('');
      setNewSubject('');
      setNewConversationMessage('');
      await fetchConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);

    const unreadMessages = conv.messages.filter(
      msg => msg.recipient_id === user?.id && !msg.read
    );

    if (unreadMessages.length > 0) {
      try {
        await supabase
          .from('messages')
          .update({ read: true, read_at: new Date().toISOString() })
          .in('id', unreadMessages.map(m => m.id));

        await fetchConversations();
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return '👩‍🏫';
      case 'admin': return '🏢';
      case 'parent': return '👨‍👩‍👧';
      case 'student': return '👦';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'from-purple-400 to-purple-500';
      case 'admin': return 'from-blue-400 to-blue-500';
      case 'parent': return 'from-green-400 to-green-500';
      case 'student': return 'from-orange-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedConversation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
              <CartoonEmoji type="chat" className="w-8 h-8" />
            </div>
            <div>
              <h2>Messagerie</h2>
              <p className="text-muted-foreground">
                {user?.role === 'admin' ? 'Messages de toute l\'école' : 'Vos conversations'}
              </p>
            </div>
          </div>

          <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nouveau message</DialogTitle>
                <DialogDescription>
                  Choisissez un destinataire et envoyez votre message
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Destinataire</Label>
                  <Select value={newRecipientId} onValueChange={setNewRecipientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRecipients.map(recipient => (
                        <SelectItem key={recipient.id} value={recipient.id}>
                          <div className="flex items-center gap-2">
                            <span>{getRoleIcon(recipient.role)}</span>
                            <span>{recipient.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {recipient.role === 'teacher' ? 'Enseignant' :
                               recipient.role === 'admin' ? 'Admin' :
                               recipient.role === 'parent' ? 'Parent' : 'Élève'}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sujet (optionnel)</Label>
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Sujet du message"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Votre message</Label>
                  <Textarea
                    value={newConversationMessage}
                    onChange={(e) => setNewConversationMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  onClick={handleCreateConversation}
                  disabled={!newRecipientId || !newConversationMessage.trim() || sending}
                  className="w-full bg-success"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {conversations.length > 0 && (
          <Card className="p-4 border-2 border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {filteredConversations.map((conv) => (
            <Card
              key={conv.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-border/50 hover:border-primary/30"
              onClick={() => handleSelectConversation(conv)}
            >
              <div className="flex items-start gap-3">
                <Avatar className={`w-12 h-12 border-2 border-white shadow-md bg-gradient-to-br ${getRoleColor(conv.other_user_role)}`}>
                  <AvatarFallback className="text-white bg-transparent">
                    <span className="text-xl">{getRoleIcon(conv.other_user_role)}</span>
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate">{conv.other_user_name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {conv.other_user_role === 'teacher' ? 'Enseignant' :
                         conv.other_user_role === 'admin' ? 'Admin' :
                         conv.other_user_role === 'parent' ? 'Parent' : 'Élève'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm whitespace-nowrap ml-2">
                      {formatTime(conv.last_message_time)}
                    </p>
                  </div>
                  <p className="text-muted-foreground truncate">{conv.last_message}</p>
                </div>

                {conv.unread_count > 0 && (
                  <Badge className="bg-destructive ml-2">
                    {conv.unread_count}
                  </Badge>
                )}
              </div>
            </Card>
          ))}

          {filteredConversations.length === 0 && conversations.length > 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Aucune conversation trouvée</p>
            </Card>
          )}

          {conversations.length === 0 && (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3>Aucune conversation</h3>
                  <p className="text-muted-foreground">
                    Commencez une nouvelle conversation
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedConversation(null)}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Avatar className={`w-12 h-12 border-2 border-white shadow-md bg-gradient-to-br ${getRoleColor(selectedConversation.other_user_role)}`}>
          <AvatarFallback className="text-white bg-transparent">
            <span className="text-xl">{getRoleIcon(selectedConversation.other_user_role)}</span>
          </AvatarFallback>
        </Avatar>

        <div>
          <h3>{selectedConversation.other_user_name}</h3>
          <p className="text-muted-foreground">
            {selectedConversation.other_user_role === 'teacher' ? 'Enseignant' :
             selectedConversation.other_user_role === 'admin' ? 'Administration' :
             selectedConversation.other_user_role === 'parent' ? 'Parent' : 'Élève'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {selectedConversation.messages.map((msg) => {
          const isCurrentUser = msg.sender_id === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
                <p className={`text-muted-foreground text-xs mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

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
            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-primary h-[60px] px-6"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
