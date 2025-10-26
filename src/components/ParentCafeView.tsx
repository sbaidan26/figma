import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Heart,
  MessageCircle,
  Send,
  Plus,
  Coffee,
  ImageIcon,
  Smile,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { CartoonEmoji } from './CartoonEmoji';

interface Comment {
  id: number;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  avatarColor: string;
}

interface Post {
  id: number;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked: boolean;
  comments: Comment[];
  image?: string;
  avatarColor: string;
  category?: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: 'Sophie Martin',
    authorInitials: 'SM',
    content: 'Bonjour à tous ! Quelqu\'un aurait-il des recommandations pour des activités extra-scolaires en arts plastiques ? Ma fille adore dessiner et peindre 🎨',
    timestamp: 'Il y a 2 heures',
    likes: 12,
    hasLiked: false,
    avatarColor: 'from-pink-400 to-purple-400',
    category: 'Question',
    comments: [
      {
        id: 1,
        author: 'Marie Dupont',
        authorInitials: 'MD',
        content: 'Je recommande l\'atelier "Les petits créatifs" près de l\'école. Mes enfants y vont depuis 2 ans et adorent !',
        timestamp: 'Il y a 1 heure',
        avatarColor: 'from-blue-400 to-cyan-400',
      },
      {
        id: 2,
        author: 'Claire Bernard',
        authorInitials: 'CB',
        content: 'Super idée Marie ! Il y a aussi l\'atelier municipal le mercredi après-midi, c\'est très bien aussi.',
        timestamp: 'Il y a 30 minutes',
        avatarColor: 'from-green-400 to-teal-400',
      },
    ],
  },
  {
    id: 2,
    author: 'Thomas Rousseau',
    authorInitials: 'TR',
    content: 'Merci à l\'équipe enseignante pour la magnifique sortie au musée d\'hier ! Les enfants sont revenus enchantés 🏛️✨',
    timestamp: 'Il y a 5 heures',
    likes: 24,
    hasLiked: true,
    avatarColor: 'from-indigo-400 to-blue-400',
    category: 'Remerciement',
    comments: [
      {
        id: 3,
        author: 'Isabelle Petit',
        authorInitials: 'IP',
        content: 'Oui vraiment ! Mon fils n\'arrête pas d\'en parler depuis hier soir 😊',
        timestamp: 'Il y a 4 heures',
        avatarColor: 'from-yellow-400 to-orange-400',
      },
    ],
  },
  {
    id: 3,
    author: 'Nadia Benali',
    authorInitials: 'NB',
    content: 'Bonjour ! Je cherche à organiser un covoiturage pour les activités du mercredi. Si ça intéresse quelqu\'un, n\'hésitez pas à me contacter 🚗',
    timestamp: 'Hier à 18:30',
    likes: 8,
    hasLiked: false,
    avatarColor: 'from-rose-400 to-pink-400',
    category: 'Organisation',
    comments: [],
  },
  {
    id: 4,
    author: 'Pierre Durand',
    authorInitials: 'PD',
    content: 'Rappel : La réunion parents-professeurs aura lieu vendredi prochain. N\'oubliez pas de vous inscrire sur le planning ! 📅',
    timestamp: 'Hier à 14:20',
    likes: 15,
    hasLiked: true,
    avatarColor: 'from-teal-400 to-cyan-400',
    category: 'Information',
    comments: [
      {
        id: 4,
        author: 'Anne Leroy',
        authorInitials: 'AL',
        content: 'Merci pour le rappel ! Je viens de m\'inscrire 👍',
        timestamp: 'Hier à 15:45',
        avatarColor: 'from-purple-400 to-pink-400',
      },
    ],
  },
];

export function ParentCafeView() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Discussion');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ['Discussion', 'Question', 'Remerciement', 'Organisation', 'Information'];

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: posts.length + 1,
      author: 'Mme Dupont',
      authorInitials: 'MD',
      content: newPostContent,
      timestamp: 'À l\'instant',
      likes: 0,
      hasLiked: false,
      comments: [],
      avatarColor: 'from-primary to-secondary',
      category: newPostCategory,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostCategory('Discussion');
    setIsDialogOpen(false);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          hasLiked: !post.hasLiked,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: number) => {
    const commentContent = commentInputs[postId]?.trim();
    if (!commentContent) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: post.comments.length + 1,
          author: 'Mme Dupont',
          authorInitials: 'MD',
          content: commentContent,
          timestamp: 'À l\'instant',
          avatarColor: 'from-primary to-secondary',
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const toggleComments = (postId: number) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Question': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Remerciement': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Organisation': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Information': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center shadow-md">
            <Coffee className="w-8 h-8 text-amber-800" />
          </div>
          <div>
            <h2 className="flex items-center gap-2">
              ☕ Le Café des Parents
            </h2>
            <p className="text-muted-foreground">
              Espace d'échange et de partage entre parents
            </p>
          </div>
        </div>

        {/* Create Post Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg gap-2">
              <Plus className="w-5 h-5" />
              Nouvelle publication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-600" />
                Créer une publication
              </DialogTitle>
              <DialogDescription>
                Partagez vos questions, expériences ou informations avec la communauté des parents
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Catégorie
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setNewPostCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                        newPostCategory === category
                          ? getCategoryColor(category)
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Input */}
              <div>
                <Textarea
                  placeholder="Partagez vos pensées, questions ou informations avec les autres parents..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[120px] resize-none border-2"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Smile className="w-4 h-4" />
                    Emoji
                  </Button>
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  Publier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">ℹ️</span>
          </div>
          <div>
            <h4 className="mb-1">Bienvenue au Café des Parents !</h4>
            <p className="text-sm text-muted-foreground">
              Cet espace est dédié aux échanges entre parents. Partagez vos questions, conseils, idées d'activités ou remerciements. 
              Restons bienveillants et respectueux dans nos échanges 💙
            </p>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 border-2 border-border/50 hover:shadow-lg transition-all">
            {/* Post Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                <AvatarFallback className={`bg-gradient-to-br ${post.avatarColor} text-white`}>
                  {post.authorInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4>{post.author}</h4>
                  {post.category && (
                    <Badge variant="outline" className={`${getCategoryColor(post.category)} text-xs`}>
                      {post.category}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{post.timestamp}</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="leading-relaxed">{post.content}</p>
              {post.image && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  <img src={post.image} alt="Post" className="w-full" />
                </div>
              )}
            </div>

            {/* Post Stats */}
            <div className="flex items-center gap-4 py-2 border-t border-b border-border/50 mb-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-destructive fill-destructive" />
                <span>{post.likes} J'aime</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.length} Commentaires</span>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={`flex-1 gap-2 ${post.hasLiked ? 'text-destructive' : ''}`}
              >
                <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-destructive' : ''}`} />
                J'aime
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComments(post.id)}
                className="flex-1 gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Commenter
              </Button>
            </div>

            {/* Comments Section */}
            {(showComments[post.id] || post.comments.length > 0) && (
              <div className="space-y-3 pt-3 border-t border-border/50">
                {/* Existing Comments */}
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 border-2 border-white shadow-sm flex-shrink-0">
                      <AvatarFallback className={`bg-gradient-to-br ${comment.avatarColor} text-white text-xs`}>
                        {comment.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted/50 rounded-2xl px-4 py-2">
                        <p className="text-sm mb-1">{comment.author}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-4">{comment.timestamp}</p>
                    </div>
                  </div>
                ))}

                {/* Add Comment Input */}
                {showComments[post.id] && (
                  <div className="flex gap-3 mt-3">
                    <Avatar className="w-8 h-8 border-2 border-white shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                        MD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Écrivez un commentaire..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        className="min-h-[60px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="bg-primary hover:bg-primary/90 flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}

        {/* Empty State */}
        {posts.length === 0 && (
          <Card className="p-12 text-center border-2 border-border/50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center shadow-md">
                <Coffee className="w-10 h-10 text-amber-800" />
              </div>
              <div>
                <h3>Pas encore de publications</h3>
                <p className="text-muted-foreground mt-2">
                  Soyez le premier à partager quelque chose avec les autres parents !
                </p>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white mt-4 gap-2"
              >
                <Plus className="w-5 h-5" />
                Créer la première publication
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
