import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MoreVertical } from 'lucide-react';

interface BoardCardProps {
  title: string;
  description?: string;
  color: string;
  contentCount?: number;
  onClick?: () => void;
}

export function BoardCard({ title, description, color, contentCount = 0, onClick }: BoardCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg overflow-hidden rounded-[20px] border border-border shadow-[0px_2px_10px_0px_rgba(0,0,0,0.04)]"
      onClick={onClick}
    >
      <div className="h-24 relative" style={{ backgroundColor: color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="mb-1 text-sm">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-xs line-clamp-2">{description}</p>
            )}
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3">
          <Badge variant="secondary" className="text-xs rounded-[20px]">{contentCount} contenus</Badge>
        </div>
      </div>
    </Card>
  );
}
