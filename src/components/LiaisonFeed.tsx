import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, Clock, User } from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';

interface Signature {
  parentName: string;
  signedAt: string;
}

interface LiaisonMessage {
  id: number;
  author: string;
  authorRole: 'teacher' | 'admin' | 'director';
  date: string;
  time: string;
  title: string;
  content: string;
  signatures: Signature[];
  requiresSignature: boolean;
}

const mockMessages: LiaisonMessage[] = [
  {
    id: 1,
    author: 'Mme Benali',
    authorRole: 'teacher',
    date: '19 Oct 2025',
    time: '14:30',
    title: 'Sortie scolaire au Musée des Sciences',
    content: 'Chers parents, nous organisons une sortie pédagogique au Musée des Sciences le jeudi 25 octobre. Départ à 9h, retour prévu à 16h. Le coût est de 5€ par élève. Merci de signer ce mot pour autoriser la participation de votre enfant.',
    signatures: [
      { parentName: 'M. Dupont', signedAt: '19 Oct 2025 à 15:45' }
    ],
    requiresSignature: true,
  },
  {
    id: 2,
    author: 'Direction',
    authorRole: 'director',
    date: '18 Oct 2025',
    time: '10:00',
    title: 'Réunion parents-professeurs',
    content: 'La réunion parents-professeurs du premier trimestre aura lieu le vendredi 27 octobre de 17h à 20h. Vous recevrez votre créneau horaire par message dans les prochains jours.',
    signatures: [
      { parentName: 'M. Dupont', signedAt: '18 Oct 2025 à 12:30' },
      { parentName: 'Mme Dupont', signedAt: '18 Oct 2025 à 18:15' }
    ],
    requiresSignature: true,
  },
  {
    id: 3,
    author: 'Administration',
    authorRole: 'admin',
    date: '17 Oct 2025',
    time: '09:15',
    title: 'Photo de classe 📸',
    content: 'Les photos de classe seront prises le mardi 24 octobre. Merci de veiller à ce que les élèves portent une tenue soignée.',
    signatures: [
      { parentName: 'Mme Dupont', signedAt: '17 Oct 2025 à 20:00' }
    ],
    requiresSignature: true,
  },
  {
    id: 4,
    author: 'Mme Benali',
    authorRole: 'teacher',
    date: '16 Oct 2025',
    time: '16:00',
    title: 'Projet jardinage 🌱',
    content: 'Notre projet jardinage démarre la semaine prochaine ! Les élèves apprendront à planter des graines et à observer la croissance des plantes. Si vous avez des pots ou des graines à donner, n\'hésitez pas !',
    signatures: [],
    requiresSignature: false,
  },
  {
    id: 5,
    author: 'Direction',
    authorRole: 'director',
    date: '15 Oct 2025',
    time: '11:30',
    title: 'Vacances de la Toussaint',
    content: 'Les vacances de la Toussaint débuteront le samedi 21 octobre au soir. La reprise des cours est prévue le lundi 6 novembre à 8h30. Bonnes vacances à tous !',
    signatures: [],
    requiresSignature: false,
  },
];

export function LiaisonFeed() {
  const [messages, setMessages] = useState(mockMessages);
  const currentParent = 'Mme Dupont'; // À récupérer du contexte utilisateur

  const handleSign = (messageId: number) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const alreadySigned = msg.signatures.some(sig => sig.parentName === currentParent);
        if (alreadySigned) return msg;
        
        return {
          ...msg,
          signatures: [
            ...msg.signatures,
            {
              parentName: currentParent,
              signedAt: new Date().toLocaleString('fr-FR', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          ]
        };
      }
      return msg;
    }));
  };

  const getAuthorIcon = (role: string) => {
    switch (role) {
      case 'teacher': return '👩‍🏫';
      case 'director': return '👔';
      case 'admin': return '📋';
      default: return '👤';
    }
  };

  const getAuthorColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'from-purple-400 to-purple-500';
      case 'director': return 'from-blue-400 to-blue-500';
      case 'admin': return 'from-teal-400 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const isSignedByCurrentParent = (message: LiaisonMessage) => {
    return message.signatures.some(sig => sig.parentName === currentParent);
  };

  const isFullySigned = (message: LiaisonMessage) => {
    return message.signatures.length >= 2;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
            <CartoonEmoji type="mail" className="w-8 h-8" />
          </div>
          <div>
            <h2>Cahier de Liaison</h2>
            <p className="text-muted-foreground">
              Fil d'actualité des messages de l'école
            </p>
          </div>
        </div>
        <Badge className="bg-warning">
          {messages.filter(m => m.requiresSignature && !isSignedByCurrentParent(m)).length} à signer
        </Badge>
      </div>

      <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        {messages.map((message) => {
          const signedByCurrent = isSignedByCurrentParent(message);
          const fullySigned = isFullySigned(message);
          
          return (
            <Card key={message.id} className="overflow-hidden border-2 border-border/50 hover:shadow-lg transition-all">
              {/* Message Header */}
              <div className="bg-gradient-to-r from-muted/50 to-accent/30 p-4 border-b-2 border-border/50">
                <div className="flex items-start gap-3">
                  <Avatar className={`w-12 h-12 border-2 border-white shadow-md bg-gradient-to-br ${getAuthorColor(message.authorRole)}`}>
                    <AvatarFallback className="text-white bg-transparent">
                      <span className="text-xl">{getAuthorIcon(message.authorRole)}</span>
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="flex items-center gap-2">
                          {message.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-muted-foreground">
                            {message.author}
                          </p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-muted-foreground">
                            {message.date} à {message.time}
                          </p>
                        </div>
                      </div>
                      
                      {message.requiresSignature && (
                        <Badge 
                          variant={fullySigned ? 'default' : signedByCurrent ? 'secondary' : 'destructive'}
                          className="ml-2"
                        >
                          {fullySigned ? (
                            <>✓ Signé par les 2 parents</>
                          ) : signedByCurrent ? (
                            <>✓ Signé par vous</>
                          ) : (
                            <>⏳ À signer</>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6">
                <p className="mb-4 leading-relaxed">{message.content}</p>

                {/* Signatures Section */}
                {message.requiresSignature && (
                  <div className="mt-6 pt-4 border-t-2 border-border/50">
                    <h4 className="mb-3 flex items-center gap-2">
                      <span>✍️</span> Signatures des parents
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      {message.signatures.map((sig, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 p-3 bg-success/10 rounded-xl border border-success/30"
                        >
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{sig.parentName}</p>
                            <p className="text-muted-foreground text-xs">{sig.signedAt}</p>
                          </div>
                        </div>
                      ))}
                      
                      {message.signatures.length < 2 && (
                        Array.from({ length: 2 - message.signatures.length }).map((_, idx) => (
                          <div 
                            key={`empty-${idx}`}
                            className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border/50 border-dashed"
                          >
                            <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="text-muted-foreground">En attente de signature</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Sign Button */}
                    {!signedByCurrent && (
                      <Button 
                        onClick={() => handleSign(message.id)}
                        className="w-full bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Signer ce message
                      </Button>
                    )}
                  </div>
                )}

                {/* Info message for non-signature posts */}
                {!message.requiresSignature && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-xl border border-border/50">
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <span>ℹ️</span> Message informatif - Aucune signature requise
                    </p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
