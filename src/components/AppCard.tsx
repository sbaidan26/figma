import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface AppCardProps {
  icon: LucideIcon;
  title: string;
  color: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AppCard({ icon: Icon, title, color, onClick, disabled = false }: AppCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all rounded-[20px] border border-border shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04)] ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-lg'
      }`}
      onClick={disabled ? undefined : onClick}
      style={{
        backgroundColor: disabled ? '#f6fbf9' : color,
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="w-5 h-5 text-white" />
        <p className="text-center text-white text-sm">{title}</p>
      </div>
    </Card>
  );
}
