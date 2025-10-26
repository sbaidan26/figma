import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Image as ImageIcon,
  Video,
  Calendar,
  ArrowLeft,
  Download,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Media {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}

interface Board {
  id: number;
  title: string;
  description: string;
  date: string;
  teacher: string;
  category: string;
  mediaCount: number;
  coverImage: string;
  media: Media[];
}

const mockBoards: Board[] = [
  {
    id: 1,
    title: 'Atelier Peinture 🎨',
    description: 'Les élèves ont créé de magnifiques tableaux inspirés de l\'automne. Ils ont expérimenté différentes techniques : éponge, brosse, et même peinture au doigt !',
    date: '18 Oct 2025',
    teacher: 'Mme Benali',
    category: 'Arts plastiques',
    mediaCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    media: [
      { 
        id: 1, 
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Marie travaille sur son tableau d\'automne'
      },
      { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 7, type: 'image', url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 8, type: 'image', url: 'https://images.unsplash.com/photo-1751031388376-b963848a043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2MDg3NjgwMnww&ixlib=rb-4.1.0&q=80&w=1080' },
    ]
  },
  {
    id: 2,
    title: 'Activité Lecture 📚',
    description: 'Séance de lecture interactive avec des jeux de rôles. Les élèves ont joué différents personnages de leur livre préféré.',
    date: '16 Oct 2025',
    teacher: 'Mme Benali',
    category: 'Français',
    mediaCount: 5,
    coverImage: 'https://images.unsplash.com/photo-1564429097439-e400382dc893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xhc3Nyb29tJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzYwODg0ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    media: [
      { id: 9, type: 'image', url: 'https://images.unsplash.com/photo-1564429097439-e400382dc893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xhc3Nyb29tJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzYwODg0ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 10, type: 'image', url: 'https://images.unsplash.com/photo-1564429097439-e400382dc893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xhc3Nyb29tJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzYwODg0ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 11, type: 'image', url: 'https://images.unsplash.com/photo-1564429097439-e400382dc893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xhc3Nyb29tJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzYwODg0ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 12, type: 'image', url: 'https://images.unsplash.com/photo-1564429097439-e400382dc893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xhc3Nyb29tJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzYwODg0ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 13, type: 'image', url: 'https://images.unsplash.com/photo-1564429097439-e400382dc893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xhc3Nyb29tJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzYwODg0ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    ]
  },
  {
    id: 3,
    title: 'Projet Jardinage 🌱',
    description: 'Les élèves ont planté des graines et appris le cycle de vie des plantes. Chacun a son propre pot à surveiller quotidiennement.',
    date: '14 Oct 2025',
    teacher: 'Mme Benali',
    category: 'Sciences',
    mediaCount: 6,
    coverImage: 'https://images.unsplash.com/photo-1613688365965-8abc666fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBnYXJkZW4lMjBwbGFudHN8ZW58MXx8fHwxNzYwODg0ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    media: [
      { id: 14, type: 'image', url: 'https://images.unsplash.com/photo-1613688365965-8abc666fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBnYXJkZW4lMjBwbGFudHN8ZW58MXx8fHwxNzYwODg0ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 15, type: 'image', url: 'https://images.unsplash.com/photo-1613688365965-8abc666fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBnYXJkZW4lMjBwbGFudHN8ZW58MXx8fHwxNzYwODg0ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 16, type: 'image', url: 'https://images.unsplash.com/photo-1613688365965-8abc666fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBnYXJkZW4lMjBwbGFudHN8ZW58MXx8fHwxNzYwODg0ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 17, type: 'image', url: 'https://images.unsplash.com/photo-1613688365965-8abc666fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBnYXJkZW4lMjBwbGFudHN8ZW58MXx8fHwxNzYwODg0ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 18, type: 'image', url: 'https://images.unsplash.com/photo-1613688365965-8abc666fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBnYXJkZW4lMjBwbGFudHN8ZW58MXx8fHwxNzYwODg0ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 19, type: 'image', url: 'https://images.unsplash.com/photo-1613688365965-8abc666fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBnYXJkZW4lMjBwbGFudHN8ZW58MXx8fHwxNzYwODg0ODAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    ]
  },
  {
    id: 4,
    title: 'Expériences Scientifiques 🔬',
    description: 'Aujourd\'hui, nous avons découvert les propriétés de l\'eau et réalisé des expériences fascinantes sur la densité et la flottabilité.',
    date: '12 Oct 2025',
    teacher: 'Mme Benali',
    category: 'Sciences',
    mediaCount: 7,
    coverImage: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    media: [
      { id: 20, type: 'image', url: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 21, type: 'image', url: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 22, type: 'image', url: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 23, type: 'image', url: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 24, type: 'image', url: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 25, type: 'image', url: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 26, type: 'image', url: 'https://images.unsplash.com/photo-1542666836-b0b37e7e22d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaWVuY2UlMjBleHBlcmltZW50fGVufDF8fHx8MTc2MDg4NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080' },
    ]
  },
];

export function BoardsGallery() {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);

  const handleMediaClick = (boardId: number, mediaIndex: number) => {
    const board = mockBoards.find(b => b.id === boardId);
    if (board) {
      setSelectedBoard(board);
      setSelectedMediaIndex(mediaIndex);
      setIsMediaDialogOpen(true);
    }
  };

  // Gallery view
  if (!selectedBoard || !isMediaDialogOpen) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>🎨 Pancartes de la Classe</h2>
            <p className="text-muted-foreground">
              Découvrez les activités et créations de Marie
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockBoards.map((board) => (
            <Card
              key={board.id}
              className="overflow-hidden border-2 border-border/50 hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => {
                setSelectedBoard(board);
                setSelectedMediaIndex(0);
                setIsMediaDialogOpen(true);
              }}
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted to-accent/30">
                <ImageWithFallback
                  src={board.coverImage}
                  alt={board.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Media count badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  <span>{board.mediaCount}</span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white">{board.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {board.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{board.date}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {board.description}
                </p>

                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm">👩‍🏫</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Par {board.teacher}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mockBoards.length === 0 && (
          <Card className="p-12 text-center border-2 border-border/50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3>Aucune pancarte disponible</h3>
                <p className="text-muted-foreground">
                  Les pancartes des activités apparaîtront ici
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Media viewer dialog
  const currentMedia = selectedBoard.media[selectedMediaIndex];
  
  return (
    <Dialog open={isMediaDialogOpen} onOpenChange={(open) => {
      setIsMediaDialogOpen(open);
      if (!open) {
        setSelectedBoard(null);
      }
    }}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle>{selectedBoard.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  Galerie de médias de la pancarte
                </DialogDescription>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {selectedBoard.category}
                  </Badge>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedBoard.date}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Par {selectedBoard.teacher}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsMediaDialogOpen(false);
                  setSelectedBoard(null);
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Description */}
          <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
            <p className="leading-relaxed">{selectedBoard.description}</p>
          </div>

          {/* Main media viewer */}
          <div className="flex-1 overflow-hidden bg-black/5 flex items-center justify-center p-6">
            <div className="relative max-w-4xl max-h-[500px] w-full">
              {currentMedia.type === 'image' ? (
                <ImageWithFallback
                  src={currentMedia.url}
                  alt={currentMedia.caption || selectedBoard.title}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center">
                  <Video className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              
              {currentMedia.caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-sm">{currentMedia.caption}</p>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="p-4 bg-white border-t border-border/50">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedBoard.media.map((media, idx) => (
                <button
                  key={media.id}
                  onClick={() => setSelectedMediaIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedMediaIndex
                      ? 'border-primary scale-105 shadow-lg'
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <ImageWithFallback
                    src={media.url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Photo {selectedMediaIndex + 1} sur {selectedBoard.media.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMediaIndex(Math.max(0, selectedMediaIndex - 1))}
                  disabled={selectedMediaIndex === 0}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMediaIndex(Math.min(selectedBoard.media.length - 1, selectedMediaIndex + 1))}
                  disabled={selectedMediaIndex === selectedBoard.media.length - 1}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
