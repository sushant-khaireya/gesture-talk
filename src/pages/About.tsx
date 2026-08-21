import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { Hand, Brain, Camera, Volume2, Zap, Shield, Users, Target } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Camera,
      title: 'Real-time Recognition',
      description: 'Advanced computer vision using MediaPipe for instant hand tracking and gesture detection'
    },
    {
      icon: Brain,
      title: 'AI-Powered Accuracy',
      description: 'Machine learning algorithms trained on ASL patterns for 85%+ recognition accuracy'
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Instant voice output using Web Speech API to convert signs into spoken language'
    },
    {
      icon: Zap,
      title: 'Low Latency',
      description: 'Sub-500ms detection time with stable gesture recognition and confidence scoring'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens in your browser - no video data is sent to servers'
    },
    {
      icon: Users,
      title: 'Accessible Design',
      description: 'Built with accessibility in mind to bridge communication gaps'
    }
  ];

  const technologies = [
    { name: 'MediaPipe Hands', description: 'Google\'s hand tracking solution' },
    { name: 'React + TypeScript', description: 'Modern web framework' },
    { name: 'TailwindCSS', description: 'Utility-first styling' },
    { name: 'Web Speech API', description: 'Browser-native text-to-speech' },
    { name: 'Canvas API', description: 'Real-time video rendering' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <Hand className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            About GestureTalk
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Breaking down communication barriers with AI-powered sign language recognition
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              GestureTalk is designed to empower deaf and hard-of-hearing individuals by providing 
              real-time translation of American Sign Language (ASL) into voice and text. Our goal is 
              to create more inclusive communication environments in education, healthcare, workplace, 
              and everyday interactions.
            </p>
            <p className="text-muted-foreground">
              Built with cutting-edge computer vision and machine learning technologies, GestureTalk 
              recognizes both individual ASL letters and common words, making it suitable for spelling 
              names, learning sign language, and communicating complete thoughts.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="mb-12 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-accent" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {technologies.map((tech, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant="default" className="bg-accent">
                    {tech.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground flex-1">{tech.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">19+</div>
              <p className="text-muted-foreground">ASL Letters</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-accent mb-2">15+</div>
              <p className="text-muted-foreground">Common Words</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-success mb-2">85%+</div>
              <p className="text-muted-foreground">Accuracy Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Use Cases */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Education</h3>
                <p className="text-sm text-muted-foreground">
                  Help students learn ASL alphabet and practice sign language in an interactive way
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Communication</h3>
                <p className="text-sm text-muted-foreground">
                  Bridge communication gaps in meetings, appointments, and everyday conversations
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Healthcare</h3>
                <p className="text-sm text-muted-foreground">
                  Assist healthcare providers in understanding deaf patients more effectively
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Workplace</h3>
                <p className="text-sm text-muted-foreground">
                  Enable inclusive work environments with real-time sign language translation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>GestureTalk is continuously improving with better recognition patterns and expanded vocabulary</p>
          <p className="mt-2">Built with ❤️ for the deaf and hard-of-hearing community</p>
        </div>
      </div>
    </div>
  );
};

export default About;
