import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { recognizeGesture, GestureResult, RecognitionMode } from '@/utils/gestureRecognition';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, VideoOff } from 'lucide-react';
import { toast } from 'sonner';

interface VideoFeedProps {
  onGestureDetected: (gesture: string, confidence: number, type: 'letter' | 'word') => void;
  isActive: boolean;
  onToggle: () => void;
  mode: RecognitionMode;
}

const VideoFeed = ({ onGestureDetected, isActive, onToggle, mode }: VideoFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentGesture, setCurrentGesture] = useState<GestureResult | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults((results: Results) => {
      if (!canvasRef.current) return;
      
      const canvasCtx = canvasRef.current.getContext('2d');
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: 'rgba(139, 92, 246, 0.5)',
            lineWidth: 3
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: 'rgba(34, 197, 94, 0.8)',
            lineWidth: 1,
            radius: 3
          });
        }

        const gestureResult = recognizeGesture(results, mode);
        if (gestureResult) {
          setCurrentGesture(gestureResult);
          
          // Clear existing timeout
          if (gestureTimeoutRef.current) {
            clearTimeout(gestureTimeoutRef.current);
          }

          // Set new timeout to emit gesture after stable detection
          gestureTimeoutRef.current = setTimeout(() => {
            onGestureDetected(gestureResult.gesture, gestureResult.confidence, gestureResult.type);
          }, 500);
        }
      } else {
        setCurrentGesture(null);
        if (gestureTimeoutRef.current) {
          clearTimeout(gestureTimeoutRef.current);
          gestureTimeoutRef.current = null;
        }
      }

      canvasCtx.restore();
    });

    handsRef.current = hands;

    return () => {
      hands.close();
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current);
      }
    };
  }, [onGestureDetected, mode]);

  useEffect(() => {
    if (!isActive) {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      setCameraReady(false);
      setCurrentGesture(null);
      return;
    }

    if (!videoRef.current || !handsRef.current) return;

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (handsRef.current && videoRef.current) {
          await handsRef.current.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480
    });

    camera.start().then(() => {
      setCameraReady(true);
      toast.success('Camera started successfully');
    }).catch((error) => {
      console.error('Camera error:', error);
      toast.error('Failed to access camera. Please check permissions.');
    });

    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [isActive]);

  return (
    <Card className="overflow-hidden shadow-medium">
      <div className="relative bg-muted">
        <video
          ref={videoRef}
          className="hidden"
          playsInline
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-auto"
        />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/95">
            <div className="text-center space-y-4">
              <VideoOff className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Camera is off</p>
              <Button onClick={onToggle} variant="default">
                <Video className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            </div>
          </div>
        )}

        {isActive && !cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/95">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground">Initializing camera...</p>
            </div>
          </div>
        )}

        {isActive && cameraReady && currentGesture && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="default" 
                className="text-lg px-4 py-2 bg-primary/90 backdrop-blur-sm"
              >
                {currentGesture.gesture}
              </Badge>
              <Badge 
                variant={currentGesture.type === 'word' ? 'default' : 'secondary'}
                className={`text-xs px-2 py-1 ${
                  currentGesture.type === 'word' 
                    ? 'bg-accent/90' 
                    : 'bg-muted/90'
                } backdrop-blur-sm`}
              >
                {currentGesture.type}
              </Badge>
            </div>
            <Badge 
              variant="secondary"
              className="px-3 py-2 bg-background/90 backdrop-blur-sm"
            >
              {Math.round(currentGesture.confidence * 100)}%
            </Badge>
          </div>
        )}

        {isActive && cameraReady && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={onToggle}
              variant="destructive"
              size="icon"
              className="rounded-full"
            >
              <VideoOff className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoFeed;
