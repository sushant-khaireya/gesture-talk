import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import { 
  Camera, 
  Hand, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Video,
  Volume2,
  Settings,
  Target
} from 'lucide-react';

const HowToUse = () => {
  const steps = [
    {
      number: 1,
      title: 'Grant Camera Permission',
      description: 'Click "Start Camera" and allow browser access to your webcam when prompted',
      icon: Camera,
      color: 'text-primary'
    },
    {
      number: 2,
      title: 'Position Your Hand',
      description: 'Place your hand clearly in front of the camera, ensuring good lighting and visibility',
      icon: Hand,
      color: 'text-accent'
    },
    {
      number: 3,
      title: 'Choose Recognition Mode',
      description: 'Select "All Signs", "Alphabet Only", or "Words Only" based on what you want to communicate',
      icon: Settings,
      color: 'text-warning'
    },
    {
      number: 4,
      title: 'Make ASL Signs',
      description: 'Perform ASL letters or words - the system will detect and translate them in real-time',
      icon: Target,
      color: 'text-success'
    }
  ];

  const tips = [
    {
      icon: Lightbulb,
      title: 'Good Lighting',
      description: 'Ensure your hand is well-lit. Natural lighting works best, avoid backlighting'
    },
    {
      icon: Camera,
      title: 'Clear Background',
      description: 'Use a plain background to help the system focus on your hand movements'
    },
    {
      icon: Hand,
      title: 'Steady Hands',
      description: 'Hold each sign steady for at least 0.5 seconds for accurate detection'
    },
    {
      icon: Target,
      title: 'Center Position',
      description: 'Keep your hand centered in the camera frame for best tracking results'
    }
  ];

  const dos = [
    'Hold signs steady for half a second',
    'Keep hand within camera frame',
    'Use good lighting from the front',
    'Check the reference guide for correct hand positions',
    'Practice letters before attempting words'
  ];

  const donts = [
    "Don't move too quickly between signs",
    "Don't block your hand with other objects",
    "Avoid wearing gloves or hand accessories",
    "Don't position hand too close or too far from camera",
    "Avoid cluttered or busy backgrounds"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-accent to-primary">
              <Video className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            How to Use GestureTalk
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow these simple steps to start translating sign language in real-time
          </p>
        </div>

        {/* Quick Start Alert */}
        <Alert className="mb-12 border-primary/20 bg-primary/5">
          <AlertCircle className="h-5 w-5 text-primary" />
          <AlertDescription className="text-base">
            <strong>Quick Start:</strong> Click "Start Camera" on the home page, allow camera access, 
            and begin signing! The system will automatically detect and translate your signs.
          </AlertDescription>
        </Alert>

        {/* Step-by-Step Guide */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Step-by-Step Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="shadow-medium hover:shadow-strong transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex-shrink-0">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${step.color}`} />
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips for Best Results */}
        <Card className="mb-12 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-warning" />
              Tips for Best Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Icon className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-6 h-6" />
                Do This
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {dos.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="w-6 h-6" />
                Avoid This
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {donts.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Understanding the Interface */}
        <Card className="mb-12 shadow-medium">
          <CardHeader>
            <CardTitle>Understanding the Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Badge variant="default" className="mt-1">Live Feed</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                The video feed shows your hand with green landmarks and purple connections for tracking visualization
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Badge variant="default" className="bg-accent mt-1">Detected Sign</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                When a sign is detected, you will see a badge showing the letter/word and confidence percentage
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Badge variant="default" className="bg-primary mt-1">Translation</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                The translation box shows accumulated text. Click the speaker icon to hear it spoken aloud
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Badge variant="outline" className="mt-1">Stats</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                Track your session with gesture count, average confidence, and session duration
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Using Text-to-Speech */}
        <Card className="shadow-medium mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-accent" />
              Using Text-to-Speech
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Once you have translated text in the output box, click the speaker icon to hear it spoken aloud. 
              This feature uses your browser&apos;s built-in text-to-speech engine.
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure your device volume is up and speakers are working for the best experience
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Recognition Modes */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recognition Modes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <h3 className="font-semibold text-primary mb-2">All Signs (Recommended)</h3>
                <p className="text-sm text-muted-foreground">
                  Detects both alphabet letters and common words. Best for general communication and mixed content.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                <h3 className="font-semibold text-accent mb-2">Alphabet Only</h3>
                <p className="text-sm text-muted-foreground">
                  Focuses only on ASL alphabet letters (A-Y). Ideal for spelling names, places, or uncommon words.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
                <h3 className="font-semibold text-warning mb-2">Words Only</h3>
                <p className="text-sm text-muted-foreground">
                  Recognizes only common ASL words like HELLO, THANK YOU, etc. Best for quick conversations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Need help? Check the reference guide on the home page for all supported signs</p>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
