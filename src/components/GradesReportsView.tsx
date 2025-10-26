import { useState } from 'react';
import { CartoonEmoji } from './CartoonEmoji';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Download, FileText, TrendingUp, TrendingDown, Award, AlertCircle } from 'lucide-react';

interface StudentGrade {
  studentId: number;
  studentName: string;
  class: string;
  subjects: {
    name: string;
    grade: number;
    coefficient: number;
  }[];
  average: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

interface ClassReport {
  className: string;
  totalStudents: number;
  averageGrade: number;
  passRate: number;
  topStudent: string;
}

export function GradesReportsView() {
  const [selectedClass, setSelectedClass] = useState('CM2-A');
  const [selectedTrimester, setSelectedTrimester] = useState('1');

  const classReports: ClassReport[] = [
    { className: 'CM2-A', totalStudents: 25, averageGrade: 14.5, passRate: 92, topStudent: 'Yasmine Alaoui' },
    { className: 'CM2-B', totalStudents: 23, averageGrade: 13.8, passRate: 87, topStudent: 'Mehdi Tazi' },
    { className: 'CM1-A', totalStudents: 24, averageGrade: 15.2, passRate: 95, topStudent: 'Sara Idrissi' },
    { className: 'CE2-B', totalStudents: 22, averageGrade: 14.1, passRate: 90, topStudent: 'Omar Benjelloun' },
  ];

  const studentGrades: StudentGrade[] = [
    {
      studentId: 1,
      studentName: 'Yasmine Alaoui',
      class: 'CM2-A',
      average: 16.5,
      rank: 1,
      trend: 'up',
      subjects: [
        { name: 'Mathématiques', grade: 17, coefficient: 4 },
        { name: 'Français', grade: 16, coefficient: 4 },
        { name: 'Sciences', grade: 17.5, coefficient: 3 },
        { name: 'Géographie', grade: 15.5, coefficient: 2 },
      ],
    },
    {
      studentId: 2,
      studentName: 'Mehdi Alaoui',
      class: 'CM2-A',
      average: 14.2,
      rank: 5,
      trend: 'stable',
      subjects: [
        { name: 'Mathématiques', grade: 15, coefficient: 4 },
        { name: 'Français', grade: 13.5, coefficient: 4 },
        { name: 'Sciences', grade: 14, coefficient: 3 },
        { name: 'Géographie', grade: 14.5, coefficient: 2 },
      ],
    },
    {
      studentId: 3,
      studentName: 'Sara Benjelloun',
      class: 'CM2-A',
      average: 15.8,
      rank: 2,
      trend: 'up',
      subjects: [
        { name: 'Mathématiques', grade: 16, coefficient: 4 },
        { name: 'Français', grade: 16.5, coefficient: 4 },
        { name: 'Sciences', grade: 15, coefficient: 3 },
        { name: 'Géographie', grade: 15.5, coefficient: 2 },
      ],
    },
    {
      studentId: 4,
      studentName: 'Omar Tazi',
      class: 'CM2-A',
      average: 12.3,
      rank: 8,
      trend: 'down',
      subjects: [
        { name: 'Mathématiques', grade: 11.5, coefficient: 4 },
        { name: 'Français', grade: 13, coefficient: 4 },
        { name: 'Sciences', grade: 12, coefficient: 3 },
        { name: 'Géographie', grade: 13.5, coefficient: 2 },
      ],
    },
  ];

  const filteredGrades = studentGrades.filter(student => student.class === selectedClass);

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-success';
    if (grade >= 14) return 'text-primary';
    if (grade >= 12) return 'text-warning';
    if (grade >= 10) return 'text-muted-foreground';
    return 'text-destructive';
  };

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 16) return 'default';
    if (grade >= 14) return 'secondary';
    if (grade >= 10) return 'outline';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <CartoonEmoji type="star" className="w-7 h-7" />
          </div>
          <div>
            <h2>Notes et bulletins</h2>
            <p className="text-muted-foreground">
              Consolidation des notes et rapports scolaires
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1er Trimestre</SelectItem>
              <SelectItem value="2">2ème Trimestre</SelectItem>
              <SelectItem value="3">3ème Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Exporter tout
          </Button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {classReports.map(report => (
          <div
            key={report.className}
            className="bg-white rounded-2xl p-5 border-2 border-border/50 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setSelectedClass(report.className)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4>{report.className}</h4>
              <Badge variant={selectedClass === report.className ? 'default' : 'outline'}>
                {report.totalStudents} élèves
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Moyenne</span>
                <span className={`font-bold ${getGradeColor(report.averageGrade)}`}>
                  {report.averageGrade}/20
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de réussite</span>
                <span className="font-bold text-success">{report.passRate}%</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Meilleur élève</p>
                <p className="text-sm font-medium">{report.topStudent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Grades */}
      <div className="bg-white rounded-2xl border-2 border-border/50 overflow-hidden">
        {/* Tab Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b-2 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3>Classe {selectedClass}</h3>
              <p className="text-muted-foreground">{selectedTrimester}er Trimestre 2024-2025</p>
            </div>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Générer les bulletins
            </Button>
          </div>
        </div>

        {/* Students List */}
        <div className="p-6 space-y-4">
          {filteredGrades.map(student => (
            <div
              key={student.studentId}
              className="bg-muted/30 rounded-2xl p-5 border-2 border-border/50 hover:border-primary/50 transition-all"
            >
              {/* Student Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {student.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4>{student.studentName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="gap-1">
                        <Award className="w-3 h-3" />
                        Rang {student.rank}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                        {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
                        {student.trend === 'stable' && <span className="w-4 h-4 text-muted-foreground">→</span>}
                        <span className="text-sm text-muted-foreground">
                          {student.trend === 'up' ? 'En progression' : student.trend === 'down' ? 'En baisse' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Moyenne générale</p>
                  <div className={`text-3xl font-bold ${getGradeColor(student.average)}`}>
                    {student.average}/20
                  </div>
                </div>
              </div>

              {/* Subjects Grades */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {student.subjects.map(subject => (
                  <div
                    key={subject.name}
                    className="bg-white rounded-xl p-3 border border-border/50"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{subject.name}</p>
                    <div className="flex items-baseline justify-between">
                      <span className={`text-xl font-bold ${getGradeColor(subject.grade)}`}>
                        {subject.grade}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Coef. {subject.coefficient}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button size="sm" variant="outline" className="flex-1 gap-2">
                  <FileText className="w-4 h-4" />
                  Voir le bulletin
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Télécharger PDF
                </Button>
              </div>

              {/* Alert for struggling students */}
              {student.average < 12 && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                  <p className="text-sm text-warning-foreground">
                    Cet élève nécessite un suivi particulier
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
