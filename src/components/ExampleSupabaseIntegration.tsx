/**
 * EXEMPLE D'INTÉGRATION SUPABASE
 * 
 * Ce fichier montre comment intégrer les appels API Supabase
 * dans vos composants existants. Utilisez ces exemples pour
 * mettre à jour TeacherDashboard, ParentDashboard, StudentDashboard, etc.
 */

import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Board, Message, Homework, Grade } from '../types';

// ============================================
// EXEMPLE 1 : Charger et afficher les pancartes
// ============================================
export function BoardsExample() {
  const { getBoards, createBoard, deleteBoard, loading } = useApi();
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newBoard, setNewBoard] = useState({
    title: '',
    description: '',
    type: 'announcement' as const
  });

  // Charger les pancartes au montage du composant
  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data.boards || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des pancartes');
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createBoard(newBoard);
      toast.success('Pancarte créée avec succès !');
      setNewBoard({ title: '', description: '', type: 'announcement' });
      setShowForm(false);
      loadBoards(); // Recharger la liste
    } catch (error) {
      toast.error('Erreur lors de la création de la pancarte');
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette pancarte ?')) return;
    
    try {
      await deleteBoard(boardId);
      toast.success('Pancarte supprimée');
      loadBoards();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading && boards.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h2>Pancartes</h2>
        {user?.role === 'teacher' && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : 'Nouvelle pancarte'}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleCreateBoard} className="space-y-4">
            <Input
              placeholder="Titre"
              value={newBoard.title}
              onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Description"
              value={newBoard.description}
              onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
              required
            />
            <select
              value={newBoard.type}
              onChange={(e) => setNewBoard({ ...newBoard, type: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              <option value="announcement">Annonce</option>
              <option value="homework">Devoir</option>
              <option value="resource">Ressource</option>
              <option value="event">Événement</option>
            </select>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {boards.map((board) => (
          <Card key={board.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3>{board.title}</h3>
                <p className="text-muted-foreground">{board.description}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Par {board.createdByName} - {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user?.id === board.createdBy && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteBoard(board.id)}
                >
                  Supprimer
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXEMPLE 2 : Messagerie
// ============================================
export function MessagingExample() {
  const { getMessages, createMessage, markMessageAsRead, loading } = useApi();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipientId: '',
    recipientName: '',
    subject: '',
    content: '',
    type: 'school-family' as const
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages('received');
      setMessages(data.messages || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createMessage(newMessage);
      toast.success('Message envoyé !');
      setNewMessage({
        recipientId: '',
        recipientName: '',
        subject: '',
        content: '',
        type: 'school-family'
      });
      setShowCompose(false);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      loadMessages();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h2>Messages</h2>
        <Button onClick={() => setShowCompose(!showCompose)}>
          {showCompose ? 'Annuler' : 'Nouveau message'}
        </Button>
      </div>

      {showCompose && (
        <Card className="p-4">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <Input
              placeholder="Destinataire ID"
              value={newMessage.recipientId}
              onChange={(e) => setNewMessage({ ...newMessage, recipientId: e.target.value })}
              required
            />
            <Input
              placeholder="Sujet"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              required
            />
            <Textarea
              placeholder="Message"
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`p-4 ${!message.read ? 'border-primary' : ''}`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4>{message.subject}</h4>
                  <p className="text-sm text-muted-foreground">
                    De: {message.senderName} ({message.senderRole})
                  </p>
                </div>
                {!message.read && (
                  <Button 
                    size="sm" 
                    onClick={() => handleMarkAsRead(message.id)}
                  >
                    Marquer comme lu
                  </Button>
                )}
              </div>
              <p className="mt-2">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXEMPLE 3 : Devoirs avec soumissions
// ============================================
export function HomeworkExample() {
  const { getHomework, createHomework, submitHomework, loading } = useApi();
  const { user } = useAuth();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      const data = await getHomework();
      setHomeworks(data.homework || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des devoirs');
    }
  };

  const handleCreateHomework = async (homeworkData: any) => {
    try {
      await createHomework(homeworkData);
      toast.success('Devoir créé !');
      setShowForm(false);
      loadHomework();
    } catch (error) {
      toast.error('Erreur lors de la création du devoir');
    }
  };

  const handleSubmitHomework = async (homeworkId: string, submissionData: any) => {
    try {
      await submitHomework(homeworkId, submissionData);
      toast.success('Devoir soumis !');
      loadHomework();
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2>Devoirs</h2>
      {/* Implémentation similaire aux exemples précédents */}
      <div className="grid gap-4">
        {homeworks.map((homework) => (
          <Card key={homework.id} className="p-4">
            <h3>{homework.title}</h3>
            <p>{homework.description}</p>
            <p className="text-sm text-muted-foreground">
              Matière: {homework.subject} - À rendre le: {new Date(homework.dueDate).toLocaleDateString()}
            </p>
            {user?.role === 'student' && (
              <Button 
                className="mt-2"
                onClick={() => handleSubmitHomework(homework.id, { files: [] })}
              >
                Soumettre
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EXEMPLE 4 : Notes/Évaluations
// ============================================
export function GradesExample() {
  const { getGrades, createGrade, loading } = useApi();
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      // Si élève, charger ses propres notes
      // Si parent, spécifier l'ID de l'enfant
      const studentId = user?.role === 'parent' ? 'CHILD_ID' : undefined;
      const data = await getGrades(studentId);
      setGrades(data.grades || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
    }
  };

  const handleAddGrade = async (gradeData: any) => {
    try {
      await createGrade(gradeData);
      toast.success('Note ajoutée !');
      loadGrades();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2>Notes et Évaluations</h2>
      <div className="grid gap-4">
        {grades.map((grade) => (
          <Card key={grade.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4>{grade.title}</h4>
                <p className="text-muted-foreground">{grade.subject}</p>
                <p className="text-sm">
                  Note: {grade.grade}/{grade.maxGrade}
                </p>
                {grade.comment && (
                  <p className="text-sm text-muted-foreground mt-2">{grade.comment}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {((grade.grade / grade.maxGrade) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(grade.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * COMMENT UTILISER CES EXEMPLES DANS VOS COMPOSANTS EXISTANTS :
 * 
 * 1. Importez useApi et useAuth dans votre composant
 * 2. Utilisez les fonctions du hook useApi pour charger/créer/modifier les données
 * 3. Stockez les données dans le state local avec useState
 * 4. Utilisez useEffect pour charger les données au montage du composant
 * 5. Affichez l'état de chargement avec la variable loading
 * 6. Gérez les erreurs avec toast.error()
 * 7. Rafraîchissez les données après les modifications
 * 
 * Exemple minimal :
 * 
 * import { useApi } from '../hooks/useApi';
 * import { useEffect, useState } from 'react';
 * 
 * function MyComponent() {
 *   const { getBoards, loading } = useApi();
 *   const [boards, setBoards] = useState([]);
 * 
 *   useEffect(() => {
 *     const loadData = async () => {
 *       const data = await getBoards();
 *       setBoards(data.boards);
 *     };
 *     loadData();
 *   }, []);
 * 
 *   if (loading) return <div>Chargement...</div>;
 * 
 *   return (
 *     <div>
 *       {boards.map(board => (
 *         <div key={board.id}>{board.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */
