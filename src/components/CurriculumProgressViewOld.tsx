import { useState } from 'react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';

interface CurriculumItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  weekNumber: number;
}

interface Subject {
  id: string;
  name: string;
  icon: 'book' | 'calculator' | 'science' | 'globe' | 'art' | 'music';
  color: string;
  items: CurriculumItem[];
}

export function CurriculumProgressView() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 'math',
      name: 'Mathématiques',
      icon: 'calculator',
      color: 'from-blue-400 to-blue-500',
      items: [
        { id: 1, title: 'Les nombres décimaux', description: 'Comparaison et opérations', completed: true, weekNumber: 1 },
        { id: 2, title: 'Les fractions', description: 'Introduction aux fractions simples', completed: true, weekNumber: 3 },
        { id: 3, title: 'La division', description: 'Division à deux chiffres', completed: true, weekNumber: 5 },
        { id: 4, title: 'La géométrie plane', description: 'Triangles et quadrilatères', completed: false, weekNumber: 7 },
        { id: 5, title: 'Les mesures', description: 'Unités de longueur et masse', completed: false, weekNumber: 9 },
        { id: 6, title: 'Les pourcentages', description: 'Calcul de pourcentages simples', completed: false, weekNumber: 11 },
      ],
    },
    {
      id: 'french',
      name: 'Français',
      icon: 'book',
      color: 'from-purple-400 to-purple-500',
      items: [
        { id: 1, title: 'La conjugaison', description: 'Présent, passé composé, imparfait', completed: true, weekNumber: 1 },
        { id: 2, title: 'Les adjectifs', description: 'Accord des adjectifs qualificatifs', completed: true, weekNumber: 2 },
        { id: 3, title: 'Le complément du nom', description: 'Identifier et utiliser', completed: true, weekNumber: 4 },
        { id: 4, title: 'La proposition relative', description: 'Qui, que, dont, où', completed: false, weekNumber: 6 },
        { id: 5, title: 'Le discours direct et indirect', description: 'Transformation des phrases', completed: false, weekNumber: 8 },
        { id: 6, title: 'Les homophones', description: 'a/à, et/est, son/sont', completed: false, weekNumber: 10 },
      ],
    },
    {
      id: 'science',
      name: 'Sciences',
      icon: 'science',
      color: 'from-green-400 to-green-500',
      items: [
        { id: 1, title: 'Le corps humain', description: 'Système digestif et respiratoire', completed: true, weekNumber: 1 },
        { id: 2, title: 'L\'eau dans la nature', description: 'Cycle de l\'eau et états', completed: true, weekNumber: 3 },
        { id: 3, title: 'Les volcans', description: 'Formation et éruptions', completed: false, weekNumber: 5 },
        { id: 4, title: 'L\'électricité', description: 'Circuits simples', completed: false, weekNumber: 7 },
        { id: 5, title: 'Les plantes', description: 'Photosynthèse et reproduction', completed: false, weekNumber: 9 },
        { id: 6, title: 'Le système solaire', description: 'Planètes et satellites', completed: false, weekNumber: 11 },
      ],
    },
    {
      id: 'geography',
      name: 'Géographie',
      icon: 'globe',
      color: 'from-amber-400 to-amber-500',
      items: [
        { id: 1, title: 'Les continents', description: 'Caractéristiques géographiques', completed: true, weekNumber: 2 },
        { id: 2, title: 'Les climats', description: 'Zones climatiques du monde', completed: true, weekNumber: 4 },
        { id: 3, title: 'Les villes et villages', description: 'Urbanisme et ruralité', completed: false, weekNumber: 6 },
        { id: 4, title: 'Les ressources naturelles', description: 'Eau, forêts, minerais', completed: false, weekNumber: 8 },
        { id: 5, title: 'Les transports', description: 'Moyens de transport et réseaux', completed: false, weekNumber: 10 },
      ],
    },
  ]);

  const toggleItemCompletion = (subjectId: string, itemId: number) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          items: subject.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return subject;
    }));
  };

  const calculateProgress = (items: CurriculumItem[]) => {
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <CartoonEmoji type="book" className="w-7 h-7" />
          </div>
          <div>
            <h2>Programme de l'année</h2>
            <p className="text-muted-foreground">
              Suivez la progression de vos cours par matière
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(subject => {
          const progress = calculateProgress(subject.items);
          const completed = subject.items.filter(item => item.completed).length;
          const total = subject.items.length;
          
          return (
            <div
              key={subject.id}
              className="bg-white rounded-2xl p-4 border-2 border-border/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center`}>
                  <CartoonEmoji type={subject.icon} className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4>{subject.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {completed}/{total} chapitres
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center mt-2">{progress}%</p>
            </div>
          );
        })}
      </div>

      {/* Detailed Progress by Subject */}
      <Tabs defaultValue={subjects[0].id} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50 rounded-2xl p-1">
          {subjects.map(subject => (
            <TabsTrigger 
              key={subject.id} 
              value={subject.id}
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CartoonEmoji type={subject.icon} className="w-5 h-5 mr-2" />
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {subjects.map(subject => (
          <TabsContent key={subject.id} value={subject.id} className="mt-6">
            <div className="bg-white rounded-2xl border-2 border-border/50 overflow-hidden">
              {/* Subject Header */}
              <div className={`bg-gradient-to-br ${subject.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <CartoonEmoji type={subject.icon} className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-white">{subject.name}</h3>
                      <p className="text-white/90 text-sm">
                        Année scolaire 2024-2025
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {calculateProgress(subject.items)}%
                    </div>
                    <p className="text-white/90 text-sm">Complété</p>
                  </div>
                </div>
              </div>

              {/* Curriculum Items */}
              <div className="p-6 space-y-3">
                {subject.items.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                      item.completed
                        ? 'bg-success/5 border-success/30'
                        : 'bg-muted/30 border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(subject.id, item.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <h4 className={item.completed ? 'text-success' : ''}>
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <Badge variant="outline" className="shrink-0">
                      Semaine {item.weekNumber}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <Button variant="outline" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Modifier le programme
                </Button>
                <Button className="flex-1">
                  Exporter le rapport
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
