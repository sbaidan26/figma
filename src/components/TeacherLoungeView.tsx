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
  Users,
  ImageIcon,
  Smile,
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
    author: 'M. Benali',
    authorInitials: 'MB',
    content: 'Bonjour collègues ! Quelqu\'un aurait-il des ressources pédagogiques sur la proportionnalité pour les CM2 ? Je cherche des exercices ludiques 📐',
    timestamp: 'Il y a 2 heures',
    likes: 8,
    hasLiked: false,
    avatarColor: 'from-blue-400 to-cyan-400',
    category: 'Ressources',
    comments: [
      {
        id: 1,
        author: 'Mme Karim',
        authorInitials: 'MK',
        content: 'J\'ai une super fiche avec des problèmes concrets (cuisine, distances). Je te l\'envoie par message !',
        timestamp: 'Il y a 1 heure',
        avatarColor: 'from-purple-400 to-pink-400',
      },
      {
        id: 2,
        author: 'M. Alaoui',
        authorInitials: 'MA',
        content: 'Le site \"Mathématiques magiques\" a d\'excellents jeux sur ce thème. Très efficace !',
        timestamp: 'Il y a 45 minutes',
        avatarColor: 'from-green-400 to-teal-400',
      },
    ],
  },
  {
    id: 2,
    author: 'Mme Rachidi',
    authorInitials: 'MR',
    content: 'Félicitations à toute l\'équipe pour l\'organisation de la sortie au musée ! Les élèves étaient ravis et très attentifs 🏛️✨',
    timestamp: 'Il y a 4 heures',
    likes: 15,
    hasLiked: true,
    avatarColor: 'from-pink-400 to-rose-400',
    category: 'Partage',
    comments: [
      {
        id: 3,
        author: 'M. Tazi',
        authorInitials: 'MT',
        content: 'Merci ! C\'était un vrai plaisir. Les enfants ont posé de super questions 😊',
        timestamp: 'Il y a 3 heures',
        avatarColor: 'from-yellow-400 to-orange-400',
      },
    ],
  },
  {
    id: 3,
    author: 'M. El Idrissi',
    authorInitials: 'MEI',
    content: 'Rappel : Réunion pédagogique jeudi 14h30 pour préparer la semaine culturelle. N\'oubliez pas vos propositions d\'ateliers ! 📋',
    timestamp: 'Hier à 16:45',
    likes: 12,
    hasLiked: true,
    avatarColor: 'from-indigo-400 to-blue-400',
    category: 'Organisation',
    comments: [
      {
        id: 4,
        author: 'Mme Benjelloun',
        authorInitials: 'MBj',
        content: 'Je propose un atelier calligraphie arabe et contes orientaux 🎨',
        timestamp: 'Hier à 17:20',
        avatarColor: 'from-teal-400 to-cyan-400',
      },
    ],
  },
  {
    id: 4,
    author: 'Mme Mansouri',
    authorInitials: 'MM',
    content: 'J\'ai testé une nouvelle méthode de gestion de classe avec des tickets de comportement positif. Les résultats sont très encourageants ! Je peux partager si ça vous intéresse 🌟',
    timestamp: 'Il y a 2 jours',
    likes: 18,
    hasLiked: false,
    avatarColor: 'from-amber-400 to-yellow-400',
    category: 'Pédagogie',
    comments: [],
  },
];

export function TeacherLoungeView() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Discussion');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const categories = ['Discussion', 'Ressources', 'Pédagogie', 'Organisation', 'Partage'];

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: posts.length + 1,
      author: 'M. Professeur',
      authorInitials: 'MP',
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
          author: 'M. Professeur',
          authorInitials: 'MP',
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
      case 'Ressources': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pédagogie': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Organisation': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Partage': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
            <CartoonEmoji type="teacher" className="w-8 h-8" />
          </div>
          <div>
            <h2 className="flex items-center gap-2">
              Salle des Profs
            </h2>
            <p className="text-muted-foreground">
              Espace d'échange et de collaboration entre enseignants
            </p>
          </div>
        </div>

        {/* Create Post Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg gap-2 rounded-2xl">
              <Plus className="w-5 h-5" />
              Nouvelle publication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Créer une publication
              </DialogTitle>
              <DialogDescription>
                Partagez des ressources et informations avec vos collègues enseignants
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
                  placeholder="Partagez vos idées, ressources, questions ou expériences avec vos collègues..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[120px] resize-none border-2 rounded-xl"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <ImageIcon className="w-4 h-4" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <Smile className="w-4 h-4" />
                    Emoji
                  </Button>
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
                >
                  Publier
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">ℹ️</span>
          </div>
          <div>
            <h4 className="mb-1">Bienvenue dans la Salle des Profs !</h4>
            <p className="text-sm text-muted-foreground">
              Cet espace est dédié aux échanges entre enseignants. Partagez vos ressources pédagogiques, vos questions, vos réussites ou vos idées d'activités. 
              Ensemble, faisons grandir notre communauté éducative 💙
            </p>
          </div>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 border-2 border-border/50 hover:shadow-lg transition-all rounded-2xl">
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
                className={`flex-1 gap-2 rounded-xl ${post.hasLiked ? 'text-destructive' : ''}`}
              >
                <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-destructive' : ''}`} />
                J'aime
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComments(post.id)}
                className="flex-1 gap-2 rounded-xl"
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
                        MP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Écrivez un commentaire..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        className="min-h-[60px] resize-none rounded-xl"
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
                        className="bg-primary hover:bg-primary/90 flex-shrink-0 rounded-xl"
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
          <Card className="p-12 text-center border-2 border-border/50 rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3>Pas encore de publications</h3>
                <p className="text-muted-foreground mt-2">
                  Soyez le premier à partager quelque chose avec vos collègues !
                </p>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white mt-4 gap-2 rounded-2xl"
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
