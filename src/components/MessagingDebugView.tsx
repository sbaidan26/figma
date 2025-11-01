import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export function MessagingDebugView() {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const debug = async () => {
      try {
        console.log('=== MESSAGING DEBUG START ===');
        console.log('1. Auth user:', user);

        if (!user) {
          setError('Aucun utilisateur authentifié');
          setLoading(false);
          return;
        }

        // Check if dbUserId is available
        console.log('2. Checking dbUserId from user object:', user.dbUserId);

        if (!user.dbUserId) {
          setError('dbUserId non disponible. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }

        // Fetch DB user
        console.log('3. Fetching DB user for id:', user.dbUserId);
        const { data: dbUserData, error: dbUserError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.dbUserId)
          .maybeSingle();

        if (dbUserError) {
          console.error('DB user error:', dbUserError);
          setError(`Erreur DB user: ${dbUserError.message}`);
          setLoading(false);
          return;
        }

        if (!dbUserData) {
          setError('Utilisateur non trouvé dans la base de données');
          setLoading(false);
          return;
        }

        console.log('4. DB user found:', dbUserData);
        setDbUser(dbUserData);

        // Fetch recipients
        console.log('5. Fetching recipients...');
        const { data: recipientsData, error: recipientsError } = await supabase
          .from('users')
          .select('id, name, role, status')
          .neq('id', dbUserData.id)
          .eq('status', 'active');

        if (recipientsError) {
          console.error('Recipients error:', recipientsError);
          setError(`Erreur recipients: ${recipientsError.message}`);
        } else {
          console.log('6. Recipients found:', recipientsData);
          setRecipients(recipientsData || []);
        }

        // Fetch messages
        console.log('7. Fetching messages...');
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${dbUserData.id},recipient_id.eq.${dbUserData.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) {
          console.error('Messages error:', messagesError);
          setError(`Erreur messages: ${messagesError.message}`);
        } else {
          console.log('8. Messages found:', messagesData);
          setMessages(messagesData || []);
        }

        console.log('=== MESSAGING DEBUG END ===');
        setLoading(false);
      } catch (err: any) {
        console.error('Debug error:', err);
        setError(`Erreur: ${err.message}`);
        setLoading(false);
      }
    };

    debug();
  }, [user]);

  const sendTestMessage = async () => {
    if (!dbUser || recipients.length === 0) return;

    const recipient = recipients[0];
    console.log('Sending test message to:', recipient);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: dbUser.id,
          sender_name: dbUser.name,
          sender_role: dbUser.role,
          recipient_id: recipient.id,
          recipient_name: recipient.name,
          recipient_role: recipient.role,
          subject: 'Test message',
          content: 'Ceci est un message de test envoyé depuis le debug view'
        })
        .select();

      if (error) {
        console.error('Send error:', error);
        alert('Erreur: ' + error.message);
      } else {
        console.log('Message sent:', data);
        alert('Message envoyé avec succès!');
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Send error:', err);
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Chargement du debug...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Debug Messagerie</h3>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-800 font-semibold">Erreur</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Utilisateur authentifié</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Utilisateur dans la base de données</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(dbUser, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Destinataires disponibles ({recipients.length})</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(recipients, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Messages existants ({messages.length})</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(messages, null, 2)}
            </pre>
          </div>

          {dbUser && recipients.length > 0 && (
            <div className="pt-4 border-t">
              <Button onClick={sendTestMessage} className="w-full">
                Envoyer un message de test à {recipients[0].name}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold mb-2">Instructions</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Vérifiez que toutes les sections ci-dessus affichent des données</li>
          <li>Ouvrez la console du navigateur (F12) pour voir les logs détaillés</li>
          <li>Si vous voyez des erreurs, partagez-les pour résolution</li>
          <li>Testez l'envoi d'un message avec le bouton ci-dessus</li>
        </ol>
      </Card>
    </div>
  );
}
