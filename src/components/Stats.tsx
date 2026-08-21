import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock } from 'lucide-react';

interface StatsProps {
  totalGestures: number;
  averageConfidence: number;
  sessionDuration: number;
}

const Stats = ({ totalGestures, averageConfidence, sessionDuration }: StatsProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Gestures Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {totalGestures}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            Avg Confidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-accent">
              {Math.round(averageConfidence * 100)}%
            </div>
            {averageConfidence >= 0.85 && (
              <Badge variant="default" className="bg-success">Excellent</Badge>
            )}
            {averageConfidence >= 0.7 && averageConfidence < 0.85 && (
              <Badge variant="secondary">Good</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" />
            Session Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-warning">
            {formatDuration(sessionDuration)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
