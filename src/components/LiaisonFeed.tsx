import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, Clock, Loader2, Plus } from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import { LiaisonCreateModal } from './LiaisonCreateModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';

interface Signature {
  id: string;
  parent_id: string;
  parent_name: string;
  signed_at: string;
}

interface LiaisonEntry {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'information' | 'event' | 'authorization';
  created_by: string;
  created_by_name: string;
  author_role: 'teacher' | 'admin' | 'director';
  class_id: string | null;
  requires_signature: boolean;
  created_at: string;
  updated_at: string;
  signatures?: Signature[];
}

export function LiaisonFeed() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LiaisonEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingId, setSigningId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const canCreateEntries = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel('liaison_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'liaison_entries' },
        () => {
          fetchEntries();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'liaison_signatures' },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEntries = async () => {
    try {
      const { data: entriesData, error: entriesError } = await supabase
        .from('liaison_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;

      const entriesWithSignatures = await Promise.all(
        (entriesData || []).map(async (entry) => {
          const { data: signaturesData, error: signaturesError } = await supabase
            .from('liaison_signatures')
            .select('*')
            .eq('liaison_entry_id', entry.id)
            .order('signed_at', { ascending: false });

          if (signaturesError) {
            console.error('Error fetching signatures:', signaturesError);
            return { ...entry, signatures: [] };
          }

          return {
            ...entry,
            signatures: signaturesData || []
          };
        })
      );

      setEntries(entriesWithSignatures);
    } catch (error) {
      console.error('Error fetching liaison entries:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (entryId: string) => {
    if (!user || user.role !== 'parent') {
      toast.error('Seuls les parents peuvent signer les messages');
      return;
    }

    setSigningId(entryId);

    try {
      const { error } = await supabase
        .from('liaison_signatures')
        .insert({
          liaison_entry_id: entryId,
          parent_id: user.id,
          parent_name: user.name
        });

      if (error) {
        if (error.code === '23505') {
          toast.info('Vous avez déjà signé ce message');
        } else {
          throw error;
        }
      } else {
        toast.success('Message signé avec succès');
        fetchEntries();
      }
    } catch (error) {
      console.error('Error signing liaison entry:', error);
      toast.error('Erreur lors de la signature');
    } finally {
      setSigningId(null);
    }
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

  const isSignedByCurrentParent = (entry: LiaisonEntry) => {
    return entry.signatures?.some(sig => sig.parent_id === user?.id) || false;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSignatureDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unsignedCount = entries.filter(
    entry => entry.requires_signature && !isSignedByCurrentParent(entry)
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        <div className="flex items-center gap-3">
          {user?.role === 'parent' && unsignedCount > 0 && (
            <Badge className="bg-warning">
              {unsignedCount} à signer
            </Badge>
          )}
          {canCreateEntries && (
            <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau message
            </Button>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Aucun message pour le moment</p>
        </Card>
      ) : (
        <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          {entries.map((entry) => {
            const signedByCurrent = isSignedByCurrentParent(entry);
            const signatureCount = entry.signatures?.length || 0;

            return (
              <Card key={entry.id} className="overflow-hidden border-2 border-border/50 hover:shadow-lg transition-all">
                {/* Message Header */}
                <div className="bg-gradient-to-r from-muted/50 to-accent/30 p-4 border-b-2 border-border/50">
                  <div className="flex items-start gap-3">
                    <Avatar className={`w-12 h-12 border-2 border-white shadow-md bg-gradient-to-br ${getAuthorColor(entry.author_role)}`}>
                      <AvatarFallback className="text-white bg-transparent">
                        <span className="text-xl">{getAuthorIcon(entry.author_role)}</span>
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="flex items-center gap-2">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-muted-foreground">
                              {entry.created_by_name}
                            </p>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-muted-foreground">
                              {formatDate(entry.created_at)} à {formatTime(entry.created_at)}
                            </p>
                          </div>
                        </div>

                        {entry.requires_signature && user?.role === 'parent' && (
                          <Badge
                            variant={signedByCurrent ? 'secondary' : 'destructive'}
                            className="ml-2"
                          >
                            {signedByCurrent ? (
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
                  <p className="mb-4 leading-relaxed">{entry.content}</p>

                  {/* Signatures Section */}
                  {entry.requires_signature && (
                    <div className="mt-6 pt-4 border-t-2 border-border/50">
                      <h4 className="mb-3 flex items-center gap-2">
                        <span>✍️</span> Signatures des parents
                      </h4>

                      {signatureCount > 0 && (
                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                          {entry.signatures!.map((sig) => (
                            <div
                              key={sig.id}
                              className="flex items-center gap-2 p-3 bg-success/10 rounded-xl border border-success/30"
                            >
                              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{sig.parent_name}</p>
                                <p className="text-muted-foreground text-xs">
                                  {formatSignatureDate(sig.signed_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {signatureCount === 0 && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-xl border border-border/50 border-dashed">
                          <Clock className="w-5 h-5 text-muted-foreground inline mr-2" />
                          <span className="text-muted-foreground">Aucune signature pour le moment</span>
                        </div>
                      )}

                      {/* Sign Button */}
                      {user?.role === 'parent' && !signedByCurrent && (
                        <Button
                          onClick={() => handleSign(entry.id)}
                          disabled={signingId === entry.id}
                          className="w-full bg-success hover:bg-success/90"
                        >
                          {signingId === entry.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Signature en cours...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Signer ce message
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Info message for non-signature posts */}
                  {!entry.requires_signature && (
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
      )}

      <LiaisonCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchEntries}
      />
    </div>
  );
}
