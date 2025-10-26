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

// Comptes de démonstration
const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@madrasati.com',
    password: 'demo123',
    name: 'Admin Principal',
    role: 'admin' as const
  },
  teacher: {
    email: 'prof.martin@madrasati.com',
    password: 'demo123',
    name: 'M. Martin',
    role: 'teacher' as const
  },
  parent: {
    email: 'parent.dupont@madrasati.com',
    password: 'demo123',
    name: 'Mme Dupont',
    role: 'parent' as const
  },
  student: {
    email: 'eleve.sarah@madrasati.com',
    password: 'demo123',
    name: 'Sarah Dupont',
    role: 'student' as const
  }
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'parent' | 'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { signIn, signUp } = useAuth();

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
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Connexion rapide avec compte démo
  const handleDemoLogin = async (accountType: keyof typeof DEMO_ACCOUNTS) => {
    setLoading(true);
    const account = DEMO_ACCOUNTS[accountType];
    
    try {
      // Essayer de se connecter d'abord
      const { error: signInError } = await signIn(account.email, account.password);
      
      if (signInError) {
        // Si le compte n'existe pas (Invalid credentials), le créer
        if (signInError.includes('Invalid login credentials') || signInError.includes('Invalid')) {
          toast.info('Création du compte de démonstration en cours...');
          
          const { error: signUpError } = await signUp(
            account.email,
            account.password,
            account.name,
            account.role
          );
          
          if (signUpError) {
            // Si le compte existe déjà, essayer de se reconnecter
            if (signUpError.includes('already') || signUpError.includes('User already registered')) {
              toast.info('Connexion au compte existant...');
              const { error: retryError } = await signIn(account.email, account.password);
              if (!retryError) {
                toast.success(`Connecté en tant que ${account.name} !`);
              } else {
                toast.error(`Erreur: ${retryError}`);
              }
            } else {
              toast.error(`Erreur lors de la création: ${signUpError}`);
            }
          } else {
            // SignUp réussit et connecte automatiquement
            toast.success(`Compte créé ! Connecté en tant que ${account.name} !`);
          }
        } else {
          // Autre type d'erreur de connexion
          toast.error(`Erreur de connexion: ${signInError}`);
        }
      } else {
        // Connexion réussie du premier coup
        toast.success(`Connecté en tant que ${account.name} !`);
      }
    } catch (error) {
      console.error('Exception lors de la connexion démo:', error);
      toast.error('Une erreur inattendue est survenue');
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

              <div className="text-center pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline"
                  disabled={loading}
                >
                  {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
                </button>
                
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDemo(!showDemo)}
                    className="text-muted-foreground hover:text-foreground text-sm underline"
                    disabled={loading}
                  >
                    {showDemo ? '✕ Fermer les comptes démo' : '🎯 Accès rapide - Comptes démo'}
                  </button>
                </div>
              </div>
            </form>

            {/* Section des comptes démo */}
            {showDemo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t-2 border-border/50"
              >
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Connexion rapide avec comptes de démonstration
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={loading}
                    className="bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-2xl h-14"
                  >
                    <CartoonEmoji type="school" className="w-5 h-5 mr-2" animated={false} />
                    Admin
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleDemoLogin('teacher')}
                    disabled={loading}
                    className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl h-14"
                  >
                    <CartoonEmoji type="teacher" className="w-5 h-5 mr-2" animated={false} />
                    Enseignant
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleDemoLogin('parent')}
                    disabled={loading}
                    className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-2xl h-14"
                  >
                    <CartoonEmoji type="parent" className="w-5 h-5 mr-2" animated={false} />
                    Parent
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleDemoLogin('student')}
                    disabled={loading}
                    className="bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl h-14"
                  >
                    <CartoonEmoji type="student" className="w-5 h-5 mr-2" animated={false} />
                    Élève
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Email: demo@madrasati.com | Mot de passe: demo123
                </p>
              </motion.div>
            )}
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
