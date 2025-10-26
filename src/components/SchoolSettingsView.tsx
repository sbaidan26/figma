import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { School, Calendar, Mail, Phone, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SchoolSettingsView() {
  const [settings, setSettings] = useState({
    schoolName: 'École Madrasati',
    schoolType: 'primaire',
    address: '123 Avenue Mohammed V, Casablanca',
    phone: '+212 522 123 456',
    email: 'contact@madrasati.ma',
    website: 'www.madrasati.ma',
    academicYear: '2024-2025',
    semester: '1',
    vacationStart: '2024-12-20',
    vacationEnd: '2025-01-05',
    motto: 'Apprendre, Grandir, Réussir ensemble',
    description: 'École primaire bilingue offrant un enseignement de qualité dans un environnement chaleureux et bienveillant.'
  });

  const handleSave = () => {
    toast.success('Paramètres enregistrés avec succès');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-admin-text mb-1">Paramètres généraux</h2>
        <p className="text-admin-text-light">
          Configurez les informations de votre établissement
        </p>
      </div>

      {/* School Information */}
      <Card className="border-admin-border">
        <div className="p-6 border-b border-admin-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-admin-primary to-admin-accent-green flex items-center justify-center">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-admin-text">Informations de l'école</h3>
              <p className="text-sm text-admin-text-light">Identité de votre établissement</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="text-admin-text">
                Nom de l'école *
              </Label>
              <Input
                id="schoolName"
                value={settings.schoolName}
                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                className="border-admin-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolType" className="text-admin-text">
                Type d'établissement
              </Label>
              <Select value={settings.schoolType} onValueChange={(val) => setSettings({ ...settings, schoolType: val })}>
                <SelectTrigger className="border-admin-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maternelle">Maternelle</SelectItem>
                  <SelectItem value="primaire">Primaire</SelectItem>
                  <SelectItem value="college">Collège</SelectItem>
                  <SelectItem value="lycee">Lycée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motto" className="text-admin-text">
              Devise de l'école
            </Label>
            <Input
              id="motto"
              value={settings.motto}
              onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
              className="border-admin-border"
              placeholder="Ex: Apprendre, Grandir, Réussir"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-admin-text">
              Description
            </Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="border-admin-border resize-none"
              rows={3}
              placeholder="Brève description de votre établissement"
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="border-admin-border">
        <div className="p-6 border-b border-admin-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-admin-text">Coordonnées</h3>
              <p className="text-sm text-admin-text-light">Informations de contact</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-admin-text flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Adresse complète
            </Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="border-admin-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-admin-text flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="border-admin-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-admin-text flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="border-admin-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-admin-text">
              Site web
            </Label>
            <Input
              id="website"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="border-admin-border"
              placeholder="www.votreecole.ma"
            />
          </div>
        </div>
      </Card>

      {/* Academic Year */}
      <Card className="border-admin-border">
        <div className="p-6 border-b border-admin-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-admin-text">Année scolaire</h3>
              <p className="text-sm text-admin-text-light">Configuration du calendrier</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-admin-text">
                Année scolaire
              </Label>
              <Select value={settings.academicYear} onValueChange={(val) => setSettings({ ...settings, academicYear: val })}>
                <SelectTrigger className="border-admin-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester" className="text-admin-text">
                Trimestre actuel
              </Label>
              <Select value={settings.semester} onValueChange={(val) => setSettings({ ...settings, semester: val })}>
                <SelectTrigger className="border-admin-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1er Trimestre</SelectItem>
                  <SelectItem value="2">2ème Trimestre</SelectItem>
                  <SelectItem value="3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-admin-border" />

          <div>
            <h4 className="text-admin-text mb-4">Prochaines vacances</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vacationStart" className="text-admin-text">
                  Début des vacances
                </Label>
                <Input
                  id="vacationStart"
                  type="date"
                  value={settings.vacationStart}
                  onChange={(e) => setSettings({ ...settings, vacationStart: e.target.value })}
                  className="border-admin-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vacationEnd" className="text-admin-text">
                  Fin des vacances
                </Label>
                <Input
                  id="vacationEnd"
                  type="date"
                  value={settings.vacationEnd}
                  onChange={(e) => setSettings({ ...settings, vacationEnd: e.target.value })}
                  className="border-admin-border"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-admin-bg/95 backdrop-blur-sm p-4 rounded-lg border border-admin-border">
        <Button variant="outline" className="border-admin-border">
          Annuler
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-admin-primary hover:bg-admin-primary-hover text-white gap-2"
        >
          <Save className="w-4 h-4" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
