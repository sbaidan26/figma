import { useState } from 'react';
import { ParentBackground } from './ParentBackground';
import { CartoonEmoji } from './CartoonEmoji';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin?: (role: 'teacher' | 'parent' | 'student' | 'admin') => void;
}


export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'parent' | 'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, rebuildKV, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (isSignUp && !name) {
      toast.error('Veuillez entrer votre nom');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name, selectedRole);
        if (error) {
          toast.error(error);
        } else {
          toast.success('Compte créé avec succès !');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error);
        } else {
          toast.success('Connexion réussie !');

          // Wait a bit for user data to be available
          await new Promise(resolve => setTimeout(resolve, 500));

          // Check if dbUserId is missing and rebuild KV if needed
          if (user && !user.dbUserId) {
            console.log('dbUserId missing, rebuilding KV store...');
            const rebuildResult = await rebuildKV();
            if (rebuildResult.error) {
              console.error('Failed to rebuild KV:', rebuildResult.error);
              toast.error('Erreur lors de la reconstruction des données. Veuillez réessayer.');
            } else {
              toast.success('Données reconstruites avec succès !');
            }
          }
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background animé */}
      <ParentBackground />

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* En-tête avec logo et titre */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg border-2 border-white/50 mb-6">
              <CartoonEmoji type="school" className="w-16 h-16" />
              <div className="text-left">
                <h1 className="text-primary">Madrasati</h1>
                <p className="text-muted-foreground">Carnet de liaison numérique</p>
              </div>
            </div>
          </motion.div>

          {/* Carte de connexion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-white/50"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <h2 className="text-center mb-6">{isSignUp ? 'Créer un compte' : 'Connexion'}</h2>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white border-2 border-border rounded-2xl h-12"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-2 border-border rounded-2xl h-12"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-2 border-border rounded-2xl h-12"
                  disabled={loading}
                />
              </div>

              {isSignUp && (
                <div className="pt-4">
                  <p className="text-center mb-4 text-muted-foreground">Je suis :</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      variant={selectedRole === 'admin' ? 'default' : 'outline'}
                      className={`h-14 rounded-2xl ${
                        selectedRole === 'admin'
                          ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                          : 'border-2'
                      }`}
                      disabled={loading}
                    >
                      <CartoonEmoji type="school" className="w-5 h-5 mr-2" animated={false} />
                      Admin
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      variant={selectedRole === 'teacher' ? 'default' : 'outline'}
                      className={`h-14 rounded-2xl ${
                        selectedRole === 'teacher'
                          ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white'
                          : 'border-2'
                      }`}
                      disabled={loading}
                    >
                      <CartoonEmoji type="teacher" className="w-5 h-5 mr-2" animated={false} />
                      Enseignant
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setSelectedRole('parent')}
                      variant={selectedRole === 'parent' ? 'default' : 'outline'}
                      className={`h-14 rounded-2xl ${
                        selectedRole === 'parent'
                          ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white'
                          : 'border-2'
                      }`}
                      disabled={loading}
                    >
                      <CartoonEmoji type="parent" className="w-5 h-5 mr-2" animated={false} />
                      Parent
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      variant={selectedRole === 'student' ? 'default' : 'outline'}
                      className={`h-14 rounded-2xl ${
                        selectedRole === 'student'
                          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                          : 'border-2'
                      }`}
                      disabled={loading}
                    >
                      <CartoonEmoji type="student" className="w-5 h-5 mr-2" animated={false} />
                      Élève
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isSignUp ? 'Création en cours...' : 'Connexion...'}
                    </>
                  ) : (
                    isSignUp ? 'Créer mon compte' : 'Se connecter'
                  )}
                </Button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline"
                  disabled={loading}
                >
                  {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Décorations avec emojis cartoon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-4 mt-6"
          >
            <div className="bg-white/80 backdrop-blur-sm border-2 border-white/50 rounded-3xl p-4 flex items-center justify-center shadow-md">
              <CartoonEmoji type="school" className="w-8 h-8" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm border-2 border-white/50 rounded-3xl p-4 flex items-center justify-center shadow-md">
              <CartoonEmoji type="book" className="w-8 h-8" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm border-2 border-white/50 rounded-3xl p-4 flex items-center justify-center shadow-md">
              <CartoonEmoji type="star" className="w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
