import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  File, 
  Download, 
  Eye, 
  Trash2,
  Plus,
  Search,
  Filter,
  Book,
  Folder,
  Calendar
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { CartoonEmoji } from './CartoonEmoji';

interface CourseResource {
  id: number;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'document' | 'exercise' | 'presentation';
  subject: 'math' | 'french' | 'science' | 'history' | 'geography' | 'english' | 'general';
  uploadDate: string;
  size: string;
  uploadedBy: string;
  downloads: number;
  tags: string[];
  thumbnail?: string;
}

const mockResources: CourseResource[] = [
  {
    id: 1,
    title: "Les fractions - Leçon complète",
    description: "Support de cours sur les fractions avec exemples et exercices",
    type: 'pdf',
    subject: 'math',
    uploadDate: "15 Oct 2025",
    size: "2.3 MB",
    uploadedBy: "Mme Benali",
    downloads: 24,
    tags: ["CM2", "Chapitre 3", "Fractions"]
  },
  {
    id: 2,
    title: "La révolution française - Vidéo",
    description: "Documentaire éducatif sur la révolution française",
    type: 'video',
    subject: 'history',
    uploadDate: "12 Oct 2025",
    size: "45 MB",
    uploadedBy: "M. Dubois",
    downloads: 18,
    tags: ["CM2", "Histoire", "XVIIIe siècle"]
  },
  {
    id: 3,
    title: "Dictée préparée n°5",
    description: "Texte de dictée avec mots à apprendre",
    type: 'document',
    subject: 'french',
    uploadDate: "10 Oct 2025",
    size: "156 KB",
    uploadedBy: "Mme Benali",
    downloads: 32,
    tags: ["CM2", "Dictée", "Orthographe"]
  },
  {
    id: 4,
    title: "Le cycle de l'eau",
    description: "Schéma explicatif du cycle de l'eau avec légendes",
    type: 'image',
    subject: 'science',
    uploadDate: "8 Oct 2025",
    size: "850 KB",
    uploadedBy: "Mme Martin",
    downloads: 21,
    tags: ["CM2", "Sciences", "Eau"]
  },
  {
    id: 5,
    title: "Exercices de conjugaison",
    description: "Fiche d'exercices sur le passé composé et l'imparfait",
    type: 'exercise',
    subject: 'french',
    uploadDate: "5 Oct 2025",
    size: "420 KB",
    uploadedBy: "Mme Benali",
    downloads: 28,
    tags: ["CM2", "Conjugaison", "Passé"]
  },
  {
    id: 6,
    title: "Les régions de France",
    description: "Carte interactive des régions françaises",
    type: 'presentation',
    subject: 'geography',
    uploadDate: "3 Oct 2025",
    size: "5.2 MB",
    uploadedBy: "M. Dubois",
    downloads: 15,
    tags: ["CM2", "Géographie", "France"]
  },
  {
    id: 7,
    title: "English vocabulary - School",
    description: "Liste de vocabulaire anglais sur le thème de l'école",
    type: 'pdf',
    subject: 'english',
    uploadDate: "1 Oct 2025",
    size: "680 KB",
    uploadedBy: "Ms. Smith",
    downloads: 19,
    tags: ["CM2", "Anglais", "Vocabulaire"]
  },
  {
    id: 8,
    title: "Problèmes mathématiques - Niveau 2",
    description: "Série de problèmes à résoudre avec correction",
    type: 'exercise',
    subject: 'math',
    uploadDate: "28 Sep 2025",
    size: "1.1 MB",
    uploadedBy: "Mme Benali",
    downloads: 35,
    tags: ["CM2", "Problèmes", "Mathématiques"]
  }
];

const resourceTypeConfig = {
  pdf: { icon: FileText, color: 'bg-destructive', label: 'PDF' },
  video: { icon: Video, color: 'bg-purple-500', label: 'Vidéo' },
  image: { icon: ImageIcon, color: 'bg-blue-500', label: 'Image' },
  document: { icon: File, color: 'bg-primary', label: 'Document' },
  exercise: { icon: Book, color: 'bg-warning', label: 'Exercice' },
  presentation: { icon: Folder, color: 'bg-amber-500', label: 'Présentation' }
};

const subjectConfig = {
  math: { label: 'Mathématiques', emoji: '➕' },
  french: { label: 'Français', emoji: '📝' },
  science: { label: 'Sciences', emoji: '🔬' },
  history: { label: 'Histoire', emoji: '🏛️' },
  geography: { label: 'Géographie', emoji: '🌍' },
  english: { label: 'Anglais', emoji: '🇬🇧' },
  general: { label: 'Général', emoji: '📚' }
};

interface CourseResourcesViewProps {
  isTeacher?: boolean;
}

export function CourseResourcesView({ isTeacher = false }: CourseResourcesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const ResourceCard = ({ resource }: { resource: CourseResource }) => {
    const typeConfig = resourceTypeConfig[resource.type];
    const TypeIcon = typeConfig.icon;
    const subjectInfo = subjectConfig[resource.subject];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-5 hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-2xl">
          {/* En-tête avec type et matière */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`${typeConfig.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md`}>
                <TypeIcon className="w-5 h-5" />
              </div>
              <div>
                <Badge variant="secondary" className="text-xs">
                  {subjectInfo.emoji} {subjectInfo.label}
                </Badge>
              </div>
            </div>
            <Badge className={`${typeConfig.color} text-white text-xs border-0`}>
              {typeConfig.label}
            </Badge>
          </div>

          {/* Titre et description */}
          <h4 className="mb-2 line-clamp-1">{resource.title}</h4>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {resource.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{resource.uploadDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{resource.downloads}</span>
            </div>
            <span className="ml-auto">{resource.size}</span>
          </div>

          {/* Auteur */}
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {resource.uploadedBy.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{resource.uploadedBy}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 rounded-xl">
              <Eye className="w-4 h-4 mr-1" />
              Voir
            </Button>
            <Button size="sm" className="flex-1 rounded-xl bg-primary">
              <Download className="w-4 h-4 mr-1" />
              Télécharger
            </Button>
            {isTeacher && (
              <Button size="sm" variant="destructive" className="rounded-xl">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec icône */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <CartoonEmoji type="book" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <h2>Supports de cours</h2>
          <p className="text-muted-foreground">
            {isTeacher 
              ? "Gérez et partagez vos ressources pédagogiques" 
              : "Accédez aux supports de cours mis à disposition"}
          </p>
        </div>
        {isTeacher && (
          <Button className="rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une ressource
          </Button>
        )}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/50 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-2"
            />
          </div>

          {/* Filtre matière */}
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="rounded-xl border-2">
              <SelectValue placeholder="Toutes les matières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {Object.entries(subjectConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.emoji} {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtre type */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="rounded-xl border-2">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {Object.entries(resourceTypeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistiques rapides (pour enseignant) */}
      {isTeacher && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-100 to-blue-150 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total ressources</p>
                <p className="text-2xl font-bold text-blue-900">{mockResources.length}</p>
              </div>
              <Folder className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary">Téléchargements</p>
                <p className="text-2xl font-bold text-primary">192</p>
              </div>
              <Download className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-warning/20 to-warning/10 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning">Cette semaine</p>
                <p className="text-2xl font-bold text-warning">3</p>
              </div>
              <Upload className="w-8 h-8 text-warning" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-100 to-purple-150 border-2 border-white/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Vues totales</p>
                <p className="text-2xl font-bold text-purple-900">456</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Liste des ressources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted-foreground">
            {filteredResources.length} ressource{filteredResources.length > 1 ? 's' : ''} trouvée{filteredResources.length > 1 ? 's' : ''}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2">Aucune ressource trouvée</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
