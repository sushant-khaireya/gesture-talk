import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, X, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TranslationOutputProps {
  text: string;
  onClear: () => void;
}

const TranslationOutput = ({ text, onClear }: TranslationOutputProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Speech synthesis failed');
      };

      window.speechSynthesis.speak(utterance);
      toast.success('Speaking...');
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <Card className="shadow-medium">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Translation</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="icon"
            disabled={!text}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            onClick={speak}
            variant="ghost"
            size="icon"
            disabled={!text || isSpeaking}
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
          </Button>
          <Button
            onClick={onClear}
            variant="ghost"
            size="icon"
            disabled={!text}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {text ? (
          <div className="space-y-4">
            <p className="text-2xl font-medium min-h-[80px] p-4 rounded-lg bg-muted">
              {text}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{text.length} characters</Badge>
              <Badge variant="outline">{text.split(' ').filter(Boolean).length} words</Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Start signing to see the translation here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationOutput;
