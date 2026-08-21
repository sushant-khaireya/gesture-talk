import { Results } from '@mediapipe/hands';

export interface GestureResult {
  gesture: string;
  confidence: number;
  type: 'letter' | 'word';
}

export type RecognitionMode = 'alphabet' | 'words' | 'all';

let lastGesture = "";
let framesStable = 0;

// ASL alphabet gesture definitions (improved with more precise conditions for accuracy)
const ASL_GESTURES: Record<string, (landmarks: any[]) => number> = {
  'A': (landmarks) => {
    const fingersCurled = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbCurled = landmarks[4].y > landmarks[3].y;
    const palmFacing = landmarks[0].z < landmarks[9].z; // Rough palm orientation
    return (fingersCurled && thumbCurled && palmFacing) ? 0.95 : 0.1;
  },

  'B': (landmarks) => {
    const fingersExtended = landmarks[8].y < landmarks[6].y && landmarks[12].y < landmarks[10].y && landmarks[16].y < landmarks[14].y && landmarks[20].y < landmarks[18].y;
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    const straight = Math.abs(landmarks[8].x - landmarks[12].x) < 0.05; // Fingers aligned
    return (fingersExtended && thumbExtended && straight) ? 0.9 : 0.1;
  },

  'C': (landmarks) => {
    const curvature = Math.abs(landmarks[8].x - landmarks[4].x) < 0.1 && Math.abs(landmarks[12].x - landmarks[4].x) < 0.1;
    const fingersCurved = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    return (curvature && fingersCurved && othersCurled) ? 0.9 : 0.1;
  },

  'D': (landmarks) => {
    const indexUp = landmarks[8].y < landmarks[6].y;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbAcross = Math.abs(landmarks[4].x - landmarks[6].x) < 0.05;
    const palmSide = landmarks[0].x > landmarks[9].x;
    return (indexUp && othersCurled && thumbAcross && palmSide) ? 0.9 : 0.1;
  },

  'E': (landmarks) => {
    const folded = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbInside = landmarks[4].x > landmarks[3].x;
    const tightFist = Math.abs(landmarks[8].x - landmarks[4].x) < 0.05;
    return (folded && thumbInside && tightFist) ? 0.9 : 0.1;
  },

  'F': (landmarks) => {
    const indexThumbTouch = Math.abs(landmarks[8].x - landmarks[4].x) < 0.03 && Math.abs(landmarks[8].y - landmarks[4].y) < 0.03;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbBent = landmarks[4].y > landmarks[3].y;
    return (indexThumbTouch && othersCurled && thumbBent) ? 0.95 : 0.1;
  },

  'G': (landmarks) => {
    const indexForward = landmarks[8].x < landmarks[6].x;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbSide = landmarks[4].x > landmarks[3].x;
    const extended = landmarks[8].y < landmarks[0].y;
    return (indexForward && othersCurled && thumbSide && extended) ? 0.9 : 0.1;
  },

  'H': (landmarks) => {
    const twoForward = landmarks[8].x < landmarks[6].x && landmarks[12].x < landmarks[10].x;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const parallel = Math.abs(landmarks[8].y - landmarks[12].y) < 0.05;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (twoForward && othersCurled && parallel && palmOut) ? 0.85 : 0.1;
  },

  'I': (landmarks) => {
    const pinkyUp = landmarks[20].y < landmarks[18].y;
    const othersCurled = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y;
    const thumbCurled = landmarks[4].y > landmarks[3].y;
    const straightPinky = landmarks[20].y < landmarks[0].y;
    return (pinkyUp && othersCurled && thumbCurled && straightPinky) ? 0.9 : 0.1;
  },

  'J': (landmarks) => {
    const pinkyUp = landmarks[20].y < landmarks[18].y;
    const othersCurled = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y;
    const thumbCurled = landmarks[4].y > landmarks[3].y;
    // J is motion-based, but static approximation
    return (pinkyUp && othersCurled && thumbCurled) ? 0.8 : 0.1;
  },

  'K': (landmarks) => {
    const indexUp = landmarks[8].y < landmarks[6].y;
    const middleUp = landmarks[12].y < landmarks[10].y;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbBetween = Math.abs(landmarks[4].x - landmarks[6].x) < 0.05;
    const palmSide = landmarks[0].x > landmarks[9].x;
    return (indexUp && middleUp && othersCurled && thumbBetween && palmSide) ? 0.9 : 0.1;
  },

  'L': (landmarks) => {
    const indexUp = landmarks[8].y < landmarks[6].y;
    const thumbSide = Math.abs(landmarks[4].x - landmarks[3].x) > 0.03;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const perpendicular = Math.abs(landmarks[8].x - landmarks[4].x) > 0.05;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (indexUp && thumbSide && othersCurled && perpendicular && palmOut) ? 0.95 : 0.1;
  },

  'M': (landmarks) => {
    const threeOverThumb = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y;
    const pinkyCurled = landmarks[20].y > landmarks[18].y;
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    const palmIn = landmarks[0].x > landmarks[9].x;
    return (threeOverThumb && pinkyCurled && thumbExtended && palmIn) ? 0.9 : 0.1;
  },

  'N': (landmarks) => {
    const twoCurled = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    const palmIn = landmarks[0].x > landmarks[9].x;
    return (twoCurled && othersCurled && thumbExtended && palmIn) ? 0.9 : 0.1;
  },

  'O': (landmarks) => {
    const circle = Math.abs(landmarks[8].x - landmarks[4].x) < 0.05 && Math.abs(landmarks[12].x - landmarks[4].x) < 0.05 && Math.abs(landmarks[16].x - landmarks[4].x) < 0.05 && Math.abs(landmarks[20].x - landmarks[4].x) < 0.05;
    const fingersCurved = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbCurled = landmarks[4].y > landmarks[3].y;
    return (circle && fingersCurved && thumbCurled) ? 0.95 : 0.1;
  },

  'P': (landmarks) => {
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const middleDown = landmarks[12].y > landmarks[10].y;
    const thumbForward = landmarks[4].x < landmarks[3].x;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const palmSide = landmarks[0].x > landmarks[9].x;
    return (indexExtended && middleDown && thumbForward && othersCurled && palmSide) ? 0.9 : 0.1;
  },

  'Q': (landmarks) => {
    const thumbDown = landmarks[4].y > landmarks[3].y;
    const indexDown = landmarks[8].y > landmarks[6].y;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const palmIn = landmarks[0].x > landmarks[9].x;
    return (thumbDown && indexDown && othersCurled && palmIn) ? 0.85 : 0.1;
  },

  'R': (landmarks) => {
    const fingersCrossed = landmarks[8].x > landmarks[12].x;
    const indexUp = landmarks[8].y < landmarks[6].y;
    const middleUp = landmarks[12].y < landmarks[10].y;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbSide = landmarks[4].x > landmarks[3].x;
    return (fingersCrossed && indexUp && middleUp && othersCurled && thumbSide) ? 0.9 : 0.1;
  },

  'S': (landmarks) => {
    const fist = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbOver = landmarks[4].x > landmarks[3].x;
    const tight = Math.abs(landmarks[8].x - landmarks[4].x) < 0.05;
    return (fist && thumbOver && tight) ? 0.95 : 0.1;
  },

  'T': (landmarks) => {
    const thumbBetween = Math.abs(landmarks[4].x - landmarks[6].x) < 0.03 && Math.abs(landmarks[4].y - landmarks[6].y) < 0.03;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (thumbBetween && othersCurled && palmOut) ? 0.9 : 0.1;
  },

  'U': (landmarks) => {
    const twoUp = landmarks[8].y < landmarks[6].y && landmarks[12].y < landmarks[10].y;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const parallel = Math.abs(landmarks[8].x - landmarks[12].x) < 0.05;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (twoUp && othersCurled && parallel && palmOut) ? 0.9 : 0.1;
  },

  'V': (landmarks) => {
    const split = landmarks[8].x < landmarks[12].x;
    const indexUp = landmarks[8].y < landmarks[6].y;
    const middleUp = landmarks[12].y < landmarks[10].y;
    const othersCurled = landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (split && indexUp && middleUp && othersCurled && palmOut) ? 0.95 : 0.1;
  },

  'W': (landmarks) => {
    const threeUp = landmarks[8].y < landmarks[6].y && landmarks[12].y < landmarks[10].y && landmarks[16].y < landmarks[14].y;
    const pinkyCurled = landmarks[20].y > landmarks[18].y;
    const spread = Math.abs(landmarks[8].x - landmarks[12].x) > 0.05 && Math.abs(landmarks[12].x - landmarks[16].x) > 0.05;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (threeUp && pinkyCurled && spread && palmOut) ? 0.95 : 0.1;
  },

  'X': (landmarks) => {
    const indexHook = landmarks[8].y > landmarks[6].y;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const thumbCurled = landmarks[4].y > landmarks[3].y;
    const palmIn = landmarks[0].x > landmarks[9].x;
    return (indexHook && othersCurled && thumbCurled && palmIn) ? 0.9 : 0.1;
  },

  'Y': (landmarks) => {
    const pinkyUpThumbOut = landmarks[20].y < landmarks[18].y && Math.abs(landmarks[4].x - landmarks[3].x) > 0.04;
    const othersCurled = landmarks[8].y > landmarks[6].y && landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (pinkyUpThumbOut && othersCurled && palmOut) ? 0.95 : 0.1;
  },

  'Z': (landmarks) => {
    // Z is motion-based, but static: index extended, others curled
    const indexExtended = landmarks[8].y < landmarks[6].y;
    const othersCurled = landmarks[12].y > landmarks[10].y && landmarks[16].y > landmarks[14].y && landmarks[20].y > landmarks[18].y;
    const palmSide = landmarks[0].x > landmarks[9].x;
    return (indexExtended && othersCurled && palmSide) ? 0.75 : 0.1; // Lower due to motion
  }
};

// ASL common words hand landmarks patterns (improved with more precise conditions for accuracy, including palm orientation, position, and additional checks; added new words for better coverage)
const ASL_WORDS: Record<string, (landmarks: any[]) => number> = {
  'HELLO': (landmarks) => {
    // Open hand, palm facing out, slight wave motion
    const fingersExtended = landmarks[8].y < landmarks[6].y &&
                           landmarks[12].y < landmarks[10].y &&
                           landmarks[16].y < landmarks[14].y &&
                           landmarks[20].y < landmarks[18].y;
    const palmOut = landmarks[0].x < landmarks[9].x;
    const waving = landmarks[0].y < 0.6; // Approximate position
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    return (fingersExtended && palmOut && waving && thumbExtended) ? 0.9 : 0.1;
  },

  'THANK YOU': (landmarks) => {
    // Flat hand near chin, fingers extended
    const fingersExtended = landmarks[8].y < landmarks[6].y &&
                           landmarks[12].y < landmarks[10].y;
    const nearChin = landmarks[0].y > 0.3 && landmarks[0].y < 0.5;
    const palmIn = landmarks[0].x > landmarks[9].x;
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    return (fingersExtended && nearChin && palmIn && thumbExtended) ? 0.9 : 0.1;
  },

  'YES': (landmarks) => {
    // Fist with slight nodding motion
    const fistClosed = landmarks[8].y > landmarks[6].y &&
                      landmarks[12].y > landmarks[10].y &&
                      landmarks[16].y > landmarks[14].y &&
                      landmarks[20].y > landmarks[18].y;
    const thumbOver = landmarks[4].x > landmarks[3].x;
    const onChest = landmarks[0].y > 0.4 && landmarks[0].y < 0.7;
    return (fistClosed && thumbOver && onChest) ? 0.85 : 0.1;
  },

  'NO': (landmarks) => {
    // Index and middle finger extended, others closed
    const twoFingers = landmarks[8].y < landmarks[6].y &&
                      landmarks[12].y < landmarks[10].y;
    const othersClosed = landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    const closing = Math.abs(landmarks[8].y - landmarks[12].y) < 0.05;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (twoFingers && othersClosed && closing && palmOut) ? 0.85 : 0.1;
  },

  'PLEASE': (landmarks) => {
    // Flat hand, circular motion on chest
    const flatHand = landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y &&
                    landmarks[16].y < landmarks[14].y &&
                    landmarks[20].y < landmarks[18].y;
    const onChest = landmarks[0].y > 0.4 && landmarks[0].y < 0.7;
    const palmDown = landmarks[8].y > landmarks[0].y;
    return (flatHand && onChest && palmDown) ? 0.85 : 0.1;
  },

  'SORRY': (landmarks) => {
    // Fist making circular motion on chest
    const fistClosed = landmarks[8].y > landmarks[6].y &&
                      landmarks[12].y > landmarks[10].y;
    const onChest = landmarks[0].y > 0.4 && landmarks[0].y < 0.7;
    const palmIn = landmarks[0].x > landmarks[9].x;
    return (fistClosed && onChest && palmIn) ? 0.85 : 0.1;
  },

  'HELP': (landmarks) => {
    // Thumbs up on flat palm
    const thumbUp = landmarks[4].y < landmarks[3].y;
    const othersClosed = landmarks[8].y > landmarks[6].y &&
                        landmarks[12].y > landmarks[10].y &&
                        landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    const palmUp = landmarks[0].y < landmarks[9].y;
    return (thumbUp && othersClosed && palmUp) ? 0.85 : 0.1;
  },

  'MORE': (landmarks) => {
    // Fingertips together, tapping
    const fingertipsTogether = Math.abs(landmarks[8].x - landmarks[4].x) < 0.08 &&
                               Math.abs(landmarks[12].x - landmarks[4].x) < 0.08;
    const fingersExtended = landmarks[8].y < landmarks[6].y &&
                           landmarks[12].y < landmarks[10].y;
    const othersCurled = landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    return (fingertipsTogether && fingersExtended && othersCurled) ? 0.85 : 0.1;
  },

  'STOP': (landmarks) => {
    // Flat hand, palm out, firm position
    const flatHand = landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y &&
                    landmarks[16].y < landmarks[14].y &&
                    landmarks[20].y < landmarks[18].y;
    const palmOut = landmarks[0].x < landmarks[9].x;
    const vertical = landmarks[8].y < landmarks[0].y;
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    return (flatHand && palmOut && vertical && thumbExtended) ? 0.9 : 0.1;
  },

  'GO': (landmarks) => {
    // Index fingers pointing forward/outward
    const indexUp = landmarks[8].y < landmarks[6].y;
    const pointingOut = landmarks[8].x < landmarks[6].x;
    const othersClosed = landmarks[12].y > landmarks[10].y &&
                        landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    const thumbCurled = landmarks[4].y > landmarks[3].y;
    return (indexUp && pointingOut && othersClosed && thumbCurled) ? 0.85 : 0.1;
  },

  'GOOD': (landmarks) => {
    // Flat hand moving from chin outward
    const flatHand = landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y;
    const nearChin = landmarks[0].y > 0.3 && landmarks[0].y < 0.6;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (flatHand && nearChin && palmOut) ? 0.85 : 0.1;
  },

  'BAD': (landmarks) => {
    // Flat hand at chin, then turning down
    const flatHand = landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y;
    const atChin = landmarks[0].y > 0.3 && landmarks[0].y < 0.5;
    const palmDown = landmarks[8].y > landmarks[0].y;
    const thumbExtended = landmarks[4].y < landmarks[3].y;
    return (flatHand && atChin && palmDown && thumbExtended) ? 0.8 : 0.1;
  },

  'WANT': (landmarks) => {
    // Open hands, palms up, pulling toward body
    const fingersSpread = landmarks[8].y < landmarks[6].y &&
                         landmarks[20].y < landmarks[18].y;
    const palmsUp = landmarks[0].y < landmarks[9].y;
    const pulling = landmarks[0].x > 0.5; // Approximate pulling motion
    return (fingersSpread && palmsUp && pulling) ? 0.8 : 0.1;
  },

  'LOVE': (landmarks) => {
    // Fists crossed over chest
    const fistClosed = landmarks[8].y > landmarks[6].y &&
                      landmarks[12].y > landmarks[10].y;
    const onChest = landmarks[0].y > 0.4 && landmarks[0].y < 0.7;
    const centered = landmarks[0].x > 0.4 && landmarks[0].x < 0.6;
    const thumbOver = landmarks[4].x > landmarks[3].x;
    return (fistClosed && onChest && centered && thumbOver) ? 0.85 : 0.1;
  },

  'FRIEND': (landmarks) => {
    // Index fingers hooking together
    const indexUp = landmarks[8].y < landmarks[6].y;
    const othersClosed = landmarks[12].y > landmarks[10].y &&
                        landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    const hooked = landmarks[8].x > landmarks[6].x;
    const palmOut = landmarks[0].x < landmarks[9].x;
    return (indexUp && othersClosed && hooked && palmOut) ? 0.8 : 0.1;
  },

  // New words added for better coverage
  'HOME': (landmarks) => {
    // Flat hand at side of face, palm in
    const flatHand = landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y &&
                    landmarks[16].y < landmarks[14].y &&
                    landmarks[20].y < landmarks[18].y;
    const atFace = landmarks[0].y > 0.2 && landmarks[0].y < 0.5;
    const palmIn = landmarks[0].x > landmarks[9].x;
    return (flatHand && atFace && palmIn) ? 0.85 : 0.1;
  },

  'EAT': (landmarks) => {
    // Fingers to mouth
    const fingersCurled = landmarks[8].y > landmarks[6].y &&
                         landmarks[12].y > landmarks[10].y &&
                         landmarks[16].y > landmarks[14].y &&
                         landmarks[20].y > landmarks[18].y;
    const toMouth = landmarks[0].y > 0.1 && landmarks[0].y < 0.4;
    const palmIn = landmarks[0].x > landmarks[9].x;
    return (fingersCurled && toMouth && palmIn) ? 0.85 : 0.1;
  },

  'DRINK': (landmarks) => {
    // Thumb to mouth, others closed
    const thumbUp = landmarks[4].y < landmarks[3].y;
    const othersClosed = landmarks[8].y > landmarks[6].y &&
                        landmarks[12].y > landmarks[10].y &&
                        landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    const toMouth = landmarks[0].y > 0.1 && landmarks[0].y < 0.4;
    return (thumbUp && othersClosed && toMouth) ? 0.85 : 0.1;
  },

  'WATER': (landmarks) => {
    // W shape, tapping chest
    const threeUp = landmarks[8].y < landmarks[6].y &&
                   landmarks[12].y < landmarks[10].y &&
                   landmarks[16].y < landmarks[14].y;
    const pinkyCurled = landmarks[20].y > landmarks[18].y;
    const onChest = landmarks[0].y > 0.4 && landmarks[0].y < 0.7;
    return (threeUp && pinkyCurled && onChest) ? 0.85 : 0.1;
  },

  'FAMILY': (landmarks) => {
    // F shape, circling
    const indexThumbTouch = Math.abs(landmarks[8].x - landmarks[4].x) < 0.03 &&
                           Math.abs(landmarks[8].y - landmarks[4].y) < 0.03;
    const othersCurled = landmarks[12].y > landmarks[10].y &&
                        landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    const circling = landmarks[0].y > 0.3 && landmarks[0].y < 0.6;
    return (indexThumbTouch && othersCurled && circling) ? 0.8 : 0.1;
  },

  'SCHOOL': (landmarks) => {
    // A shape, rocking
    const fingersCurled = landmarks[8].y > landmarks[6].y &&
                         landmarks[12].y > landmarks[10].y &&
                         landmarks[16].y > landmarks[14].y &&
                         landmarks[20].y > landmarks[18].y;
    const thumbCurled = landmarks[4].y > landmarks[3].y;
    const rocking = landmarks[0].x > 0.3 && landmarks[0].x < 0.7;
    return (fingersCurled && thumbCurled && rocking) ? 0.8 : 0.1;
  },

  'WORK': (landmarks) => {
    // Fists alternating
    const fistClosed = landmarks[8].y > landmarks[6].y &&
                      landmarks[12].y > landmarks[10].y &&
                      landmarks[16].y > landmarks[14].y &&
                      landmarks[20].y > landmarks[18].y;
    const thumbOver = landmarks[4].x > landmarks[3].x;
    const alternating = landmarks[0].y > 0.4 && landmarks[0].y < 0.6;
    return (fistClosed && thumbOver && alternating) ? 0.8 : 0.1;
  },

  'TIME': (landmarks) => {
    // Index tapping wrist
    const indexUp = landmarks[8].y < landmarks[6].y;
    const othersClosed = landmarks[12].y > landmarks[10].y &&
                        landmarks[16].y > landmarks[14].y &&
                        landmarks[20].y > landmarks[18].y;
    const atWrist = landmarks[0].y > 0.6 && landmarks[0].y < 0.9;
    return (indexUp && othersClosed && atWrist) ? 0.85 : 0.1;
  },

  'DAY': (landmarks) => {
    // Flat hand, arching up
    const flatHand = landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y &&
                    landmarks[16].y < landmarks[14].y &&
                    landmarks[20].y < landmarks[18].y;
    const arching = landmarks[0].y < 0.5;
    const palmUp = landmarks[0].y < landmarks[9].y;
    return (flatHand && arching && palmUp) ? 0.8 : 0.1;
  },

  'NIGHT': (landmarks) => {
    // Flat hand, arching down
    const flatHand = landmarks[8].y < landmarks[6].y &&
                    landmarks[12].y < landmarks[10].y &&
                    landmarks[16].y < landmarks[14].y &&
                    landmarks[20].y < landmarks[18].y;
    const arching = landmarks[0].y > 0.5;
    const palmDown = landmarks[8].y > landmarks[0].y;
    return (flatHand && arching && palmDown) ? 0.8 : 0.1;
  }
};


export function recognizeGesture(results: Results, mode: RecognitionMode = 'all'): GestureResult | null {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    return null;
  }

  const landmarks = results.multiHandLandmarks[0];
  let bestGesture = '';
  let bestConfidence = 0;
  let gestureType: 'letter' | 'word' = 'letter';

  // Check words first (higher priority for better UX)
  if (mode === 'words' || mode === 'all') {
    for (const [gesture, checkFunction] of Object.entries(ASL_WORDS)) {
      const confidence = checkFunction(landmarks);
      if (confidence > bestConfidence && confidence > 0.65) { // Slightly lower threshold for words to allow more detection
        bestConfidence = confidence;
        bestGesture = gesture;
        gestureType = 'word';
      }
    }
  }

  // Check alphabet letters
  if (mode === 'alphabet' || mode === 'all') {
    for (const [gesture, checkFunction] of Object.entries(ASL_GESTURES)) {
      const confidence = checkFunction(landmarks);
      if (confidence > bestConfidence && confidence > 0.65) { // Slightly lower threshold for letters
        bestConfidence = confidence;
        bestGesture = gesture;
        gestureType = 'letter';
      }
    }
  }

  // Stability check over multiple frames for precision
  if (bestGesture === lastGesture) {
    framesStable++;
  } else {
    framesStable = 0;
    lastGesture = bestGesture;
  }

  if (bestGesture && bestConfidence > 0.7 && framesStable >= 3) { // Require stability for 3+ frames
    return {
      gesture: bestGesture,
      confidence: bestConfidence,
      type: gestureType
    };
  }

  return null;
}

export function getGestureList(type?: 'letter' | 'word'): string[] {
  if (type === 'letter') {
    return Object.keys(ASL_GESTURES).sort();
  }
  if (type === 'word') {
    return Object.keys(ASL_WORDS).sort();
  }
  return [...Object.keys(ASL_GESTURES), ...Object.keys(ASL_WORDS)].sort();
}
