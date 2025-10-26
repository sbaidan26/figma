import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Calendar,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import { CartoonEmoji } from './CartoonEmoji';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Absence {
  id: number;
  date: string;
  period: 'morning' | 'afternoon' | 'fullday';
  status: 'justified' | 'unjustified';
  reason?: string;
  justificationDetails?: string;
  justifiedAt?: string;
}

const absenceReasons = [
  { 
    value: 'illness_child', 
    label: 'Maladie de l\'enfant',
    description: 'ou d\'un de ses proches s\'il est potentiellement contagieux'
  },
  { 
    value: 'family_event', 
    label: 'Réunion solennelle de famille',
    description: 'mariage, enterrement, etc.'
  },
  { 
    value: 'transport_accident', 
    label: 'Empêchement',
    description: 'causé par un accident durant le transport'
  },
  { 
    value: 'family_travel', 
    label: 'Déplacement',
    description: 'Enfant qui suit ses représentants légaux (déplacement en dehors des vacances scolaires)'
  },
  { 
    value: 'authorized_absence', 
    label: 'Autorisation d\'absence',
    description: 'accordée par les services de l\'Éducation nationale',
    disabled: true
  },
  { 
    value: 'other', 
    label: 'Autre',
    description: 'Tout autre motif d\'absence peut être examiné et faire l\'objet d\'une enquête.'
  },
];

const mockAbsences: Absence[] = [
  {
    id: 1,
    date: '18 Oct 2025',
    period: 'fullday',
    status: 'unjustified',
  },
  {
    id: 2,
    date: '15 Oct 2025',
    period: 'morning',
    status: 'justified',
    reason: 'illness_child',
    justificationDetails: 'Grippe avec fièvre - Certificat médical fourni',
    justifiedAt: '15 Oct 2025 à 18:30',
  },
  {
    id: 3,
    date: '12 Oct 2025',
    period: 'afternoon',
    status: 'justified',
    reason: 'family_event',
    justificationDetails: 'Mariage d\'un membre de la famille',
    justifiedAt: '11 Oct 2025 à 14:20',
  },
  {
    id: 4,
    date: '8 Oct 2025',
    period: 'fullday',
    status: 'unjustified',
  },
  {
    id: 5,
    date: '3 Oct 2025',
    period: 'morning',
    status: 'justified',
    reason: 'transport_accident',
    justificationDetails: 'Accident de circulation sur le trajet',
    justifiedAt: '3 Oct 2025 à 09:15',
  },
];

export function AbsencesView() {
  const [absences, setAbsences] = useState(mockAbsences);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [justificationReason, setJustificationReason] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleJustify = () => {
    if (!selectedAbsence || !justificationReason) return;

    const selectedReasonData = absenceReasons.find(r => r.value === justificationReason);
    let justificationText = selectedReasonData 
      ? `${selectedReasonData.label} - ${selectedReasonData.description}`
      : justificationReason;
    
    if (additionalMessage.trim()) {
      justificationText += ` | Message: ${additionalMessage}`;
    }

    const updatedAbsences = absences.map(abs => {
      if (abs.id === selectedAbsence.id) {
        return {
          ...abs,
          status: 'justified' as const,
          reason: justificationReason,
          justificationDetails: justificationText,
          justifiedAt: new Date().toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
      return abs;
    });

    setAbsences(updatedAbsences);
    setIsDialogOpen(false);
    setSelectedAbsence(null);
    setJustificationReason('');
    setAdditionalMessage('');
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'morning': return 'Matin';
      case 'afternoon': return 'Après-midi';
      case 'fullday': return 'Journée complète';
      default: return period;
    }
  };

  const getReasonLabel = (reasonValue?: string) => {
    if (!reasonValue) return '';
    const reason = absenceReasons.find(r => r.value === reasonValue);
    return reason?.label || reasonValue;
  };

  const unjustifiedCount = absences.filter(a => a.status === 'unjustified').length;
  const justifiedCount = absences.filter(a => a.status === 'justified').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
            <CartoonEmoji type="calendar" className="w-8 h-8" />
          </div>
          <div>
            <h2>Absences de Marie</h2>
            <p className="text-muted-foreground">
              Suivi et justification des absences
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 border-2 border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Total</p>
              <h3>{absences.length} absences</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-success/30 bg-success/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground">Justifiées</p>
              <h3>{justifiedCount} absences</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-muted-foreground">À justifier</p>
              <h3>{unjustifiedCount} absences</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Absences List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3>Liste des absences</h3>
        </div>

        <div className="space-y-3">
          {absences.map((absence) => (
            <Card
              key={absence.id}
              className={`p-4 border-2 ${
                absence.status === 'justified'
                  ? 'border-success/30 bg-success/5'
                  : 'border-destructive/30 bg-destructive/5'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  absence.status === 'justified' ? 'bg-success/20' : 'bg-destructive/20'
                }`}>
                  {absence.status === 'justified' ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4>{absence.date}</h4>
                      <p className="text-muted-foreground">
                        {getPeriodLabel(absence.period)}
                      </p>
                    </div>
                    <Badge
                      variant={absence.status === 'justified' ? 'default' : 'destructive'}
                      className={absence.status === 'justified' ? 'bg-success' : ''}
                    >
                      {absence.status === 'justified' ? '✓ Justifiée' : '⚠️ À justifier'}
                    </Badge>
                  </div>

                  {absence.status === 'justified' ? (
                    <div className="mt-3 p-3 bg-white/60 rounded-xl border border-border/50">
                      <div className="flex items-start gap-2 mb-2">
                        <FileText className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="opacity-70">Motif:</span>{' '}
                            {getReasonLabel(absence.reason)}
                          </p>
                          {absence.justificationDetails && (
                            <p className="text-sm mt-1 opacity-70">
                              {absence.justificationDetails}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Justifiée le {absence.justifiedAt}
                      </p>
                    </div>
                  ) : (
                    <Dialog
                      open={isDialogOpen && selectedAbsence?.id === absence.id}
                      onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (open) {
                          setSelectedAbsence(absence);
                        } else {
                          setSelectedAbsence(null);
                          setJustificationReason('');
                          setAdditionalMessage('');
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="mt-3 bg-primary w-full md:w-auto">
                          <FileText className="w-4 h-4 mr-2" />
                          Justifier cette absence
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md p-0 bg-white" aria-describedby={undefined}>
                        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
                          <DialogTitle className="text-lg">Motif d'absence</DialogTitle>
                        </DialogHeader>
                        
                        <div className="px-6 py-6 space-y-1">
                          <RadioGroup 
                            value={justificationReason} 
                            onValueChange={setJustificationReason}
                            className="space-y-0"
                          >
                            {absenceReasons.map((reason, index) => (
                              <div 
                                key={reason.value} 
                                className={`flex items-start space-x-3 py-4 px-3 -mx-3 rounded-lg transition-colors ${
                                  reason.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                                } ${
                                  justificationReason === reason.value 
                                    ? 'bg-blue-50' 
                                    : 'hover:bg-gray-50'
                                } ${
                                  index > 0 ? '' : ''
                                }`}
                              >
                                <RadioGroupItem 
                                  value={reason.value} 
                                  id={reason.value}
                                  disabled={reason.disabled}
                                  className="mt-0.5 flex-shrink-0 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                />
                                <Label
                                  htmlFor={reason.value}
                                  className={`flex-1 space-y-0 ${
                                    reason.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                                  }`}
                                >
                                  <p className={`leading-snug ${
                                    reason.disabled ? 'text-gray-400' : 'text-gray-900'
                                  }`}>
                                    {reason.label}
                                  </p>
                                  <p className={`text-sm leading-snug ${
                                    reason.disabled ? 'text-gray-300' : 'text-gray-500'
                                  }`}>
                                    {reason.description}
                                  </p>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>

                          {/* Additional message field - shown when a reason is selected */}
                          {justificationReason && !absenceReasons.find(r => r.value === justificationReason)?.disabled && (
                            <div className="pt-4 space-y-2">
                              <Label htmlFor="additional-message" className="text-sm text-gray-700">
                                Message complémentaire (optionnel)
                              </Label>
                              <textarea
                                id="additional-message"
                                value={additionalMessage}
                                onChange={(e) => setAdditionalMessage(e.target.value)}
                                placeholder="Ajoutez des précisions si nécessaire..."
                                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>

                        <div className="px-6 pb-6">
                          <Button
                            onClick={handleJustify}
                            disabled={!justificationReason}
                            className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-3"
                          >
                            Valider
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {absences.length === 0 && (
            <Card className="p-12 text-center border-2 border-border/50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <div>
                  <h3>Aucune absence enregistrée</h3>
                  <p className="text-muted-foreground">
                    Marie a une assiduité parfaite ! 🎉
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
