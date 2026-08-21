import { useState, useEffect, useCallback } from 'react';
import VideoFeed from '@/components/VideoFeed';
import TranslationOutput from '@/components/TranslationOutput';
import GestureGuide from '@/components/GestureGuide';
import Stats from '@/components/Stats';
import Navigation from '@/components/Navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hand, Info, Type, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { RecognitionMode } from '@/utils/gestureRecognition';

interface GestureData {
  gesture: string;
  confidence: number;
  timestamp: number;
  type: 'letter' | 'word';
}

const Index = () => {
  const [translatedText, setTranslatedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [gestureHistory, setGestureHistory] = useState<GestureData[]>([]);
  const [sessionStart, setSessionStart] = useState<number>(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [recognitionMode, setRecognitionMode] = useState<RecognitionMode>('all');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStart) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, sessionStart]);

  const handleGestureDetected = useCallback((gesture: string, confidence: number, type: 'letter' | 'word') => {
    // For words, add proper spacing. For letters, just concatenate
    let newText = translatedText;
    
    if (type === 'word') {
      // Add space before word if there's already text
      const separator = translatedText ? ' ' : '';
      newText = translatedText + separator + gesture;
    } else {
      // For letters, just append
      newText = translatedText + gesture;
    }
    
    setTranslatedText(newText);
    
    setGestureHistory(prev => [...prev, {
      gesture,
      confidence,
      timestamp: Date.now(),
      type
    }]);

    toast.success(`Detected: ${gesture}`, {
      description: `${type === 'word' ? 'Word' : 'Letter'} • ${Math.round(confidence * 100)}% confidence`
    });
  }, [translatedText]);

  const handleClearText = () => {
    setTranslatedText('');
    toast.info('Translation cleared');
  };

  const handleToggleCamera = () => {
    if (!isActive) {
      setSessionStart(Date.now());
      setSessionDuration(0);
    }
    setIsActive(!isActive);
  };

  const averageConfidence = gestureHistory.length > 0
    ? gestureHistory.reduce((sum, g) => sum + g.confidence, 0) / gestureHistory.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <Hand className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            GestureTalk
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time ASL to Voice Translation System
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>Position your hand clearly in front of the camera for best results</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-6 flex justify-center">
          <Tabs value={recognitionMode} onValueChange={(v) => setRecognitionMode(v as RecognitionMode)}>
            <TabsList className="shadow-soft">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Hand className="w-4 h-4" />
                All Signs
              </TabsTrigger>
              <TabsTrigger value="alphabet" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Alphabet Only
              </TabsTrigger>
              <TabsTrigger value="words" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Words Only
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <Stats
            totalGestures={gestureHistory.length}
            averageConfidence={averageConfidence}
            sessionDuration={sessionDuration}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <VideoFeed
              onGestureDetected={handleGestureDetected}
              isActive={isActive}
              onToggle={handleToggleCamera}
              mode={recognitionMode}
            />
            <TranslationOutput
              text={translatedText}
              onClear={handleClearText}
            />
          </div>

          {/* Gesture Guide - Takes 1 column */}
          <div className="lg:col-span-1">
            <GestureGuide />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with MediaPipe • Powered by Machine Learning</p>
          <p className="mt-2">Supporting American Sign Language (ASL) Alphabet</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
