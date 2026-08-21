import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGestureList } from '@/utils/gestureRecognition';
import { Hand, MessageSquare } from 'lucide-react';

const GestureGuide = () => {
  const letters = getGestureList('letter');
  const words = getGestureList('word');

  const letterDescriptions: Record<string, string> = {
    'A': 'Closed fist with thumb on side',
    'B': 'Flat hand, fingers together',
    'C': 'Curved hand forming C shape',
    'D': 'Index finger up, thumb touching middle',
    'E': 'All fingers curled tightly',
    'F': 'Thumb and index form circle',
    'G': 'Index pointing horizontally',
    'H': 'Index and middle pointing horizontally',
    'I': 'Pinky finger extended',
    'K': 'Index and middle up in V with thumb',
    'L': 'Thumb and index forming L',
    'M': 'Three fingers over thumb',
    'O': 'All fingers touching thumb',
    'R': 'Index and middle crossed',
    'T': 'Thumb between index and middle',
    'U': 'Index and middle up together',
    'V': 'Index and middle up in V',
    'W': 'Three fingers up in W',
    'Y': 'Thumb and pinky extended'
  };

  const wordDescriptions: Record<string, string> = {
    'HELLO': 'Open hand, palm out (wave motion)',
    'THANK YOU': 'Flat hand from chin outward',
    'YES': 'Fist nodding motion',
    'NO': 'Index and middle fingers closing',
    'PLEASE': 'Flat hand, circular motion on chest',
    'SORRY': 'Fist, circular motion on chest',
    'HELP': 'Thumbs up on flat palm',
    'MORE': 'Fingertips together, tapping',
    'STOP': 'Flat hand, palm out, firm',
    'GO': 'Index fingers pointing forward',
    'GOOD': 'Flat hand from chin outward',
    'BAD': 'Flat hand at chin, turning down',
    'WANT': 'Open hands, palms up, pulling in',
    'LOVE': 'Fists crossed over chest',
    'FRIEND': 'Index fingers hooking together'
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-primary" />
          ASL Reference Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alphabet" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="alphabet" className="flex items-center gap-2">
              <Hand className="w-4 h-4" />
              Alphabet ({letters.length})
            </TabsTrigger>
            <TabsTrigger value="words" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Words ({words.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alphabet">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {letters.map((letter) => (
                  <div
                    key={letter}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Badge variant="default" className="text-xl font-bold w-12 h-12 flex items-center justify-center">
                      {letter}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {letterDescriptions[letter] || 'Standard ASL sign'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="words">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {words.map((word) => (
                  <div
                    key={word}
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors border border-accent/20"
                  >
                    <Badge variant="default" className="bg-accent text-accent-foreground font-bold px-3 py-2">
                      {word}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {wordDescriptions[word] || 'Common ASL word'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GestureGuide;
