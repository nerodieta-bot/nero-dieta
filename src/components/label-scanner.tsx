'use client';
import { useActionState, useState, useRef, useEffect } from 'react';
import { analyzeLabelAction, type ScanFormState } from '@/app/scan/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Camera, Sparkles, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const initialState: ScanFormState = {
  message: '',
};

export function LabelScanner() {
  const [formState, formAction, isPending] = useActionState(analyzeLabelAction, initialState);
  const [image, setImage] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Brak wsparcia dla kamery',
          description: 'Twoja przeglądarka nie obsługuje dostępu do kamery.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
      // Wyłącz kamerę przy opuszczaniu komponentu
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Ustaw rozmiar canvas na taki sam jak video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Narysuj klatkę wideo na canvas
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        // Uzyskaj dane obrazu jako data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);

        // Zatrzymaj wideo po zrobieniu zdjęcia
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRetake = () => {
    setImage(null);
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error(err));
    }
  };
  
  const getHtml = (html?: string) => {
    if (!html) return { __html: '' };
    return { __html: html };
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (image) {
      const formData = new FormData();
      const file = dataURLtoFile(image, 'capture.jpg');
      if(file) {
        formData.append('image', file);
        formAction(formData);
      }
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Podgląd z kamery</CardTitle>
          <CardDescription>
            Nakieruj aparat na etykietę ze składem i naciśnij "Zrób zdjęcie", aby rozpocząć analizę.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden border">
            {hasCameraPermission === null && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="ml-4">Uruchamianie kamery...</p>
              </div>
            )}
            {hasCameraPermission === false && (
              <div className="flex items-center justify-center h-full p-4">
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Dostęp do kamery jest wymagany</AlertTitle>
                    <AlertDescription>
                        Aby korzystać ze skanera, zezwól na dostęp do aparatu w ustawieniach przeglądarki.
                    </AlertDescription>
                 </Alert>
              </div>
            )}
            {hasCameraPermission && (
                <>
                <video
                    ref={videoRef}
                    className={cn('w-full h-full object-cover', image ? 'hidden' : 'block')}
                    autoPlay
                    playsInline
                    muted
                />
                {image && (
                    <img src={image} alt="Przechwycona etykieta" className="w-full h-full object-contain" />
                )}
                <canvas ref={canvasRef} className="hidden" />
                </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          {!image ? (
             <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission || isPending} className="w-full md:w-auto">
                <Camera className="mr-2 h-4 w-4" />
                Zrób zdjęcie
            </Button>
          ) : (
            <div className='flex flex-col sm:flex-row gap-2 w-full'>
                 <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analizowanie...
                    </>
                    ) : (
                        <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analizuj skład
                        </>
                    )}
                </Button>
                <Button type="button" variant="outline" onClick={handleRetake} disabled={isPending} className="w-full sm:w-auto">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Zrób ponownie
                </Button>
            </div>
          )}

          {formState.message && !formState.analysisHtml && !formState.errors && (
            <p className="text-sm text-destructive">{formState.message}</p>
          )}

          {isPending && (
            <div className="w-full text-center p-8 flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Skanuję obraz i porównuję składniki... To może potrwać chwilę.
              </p>
            </div>
          )}
        
          {formState.analysisHtml && !isPending && (
            <Card className="w-full bg-primary/5 dark:bg-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent"/>
                    Wyniki Analizy
                </CardTitle>
                 <CardDescription>
                  Poniżej znajduje się analiza składu produktu przeprowadzona przez AI. Pamiętaj, że jest to sugestia i nie zastępuje porady weterynarza.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <style>
                  {`
                    .prose-custom ul { list-style: none; padding-left: 0; }
                    .prose-custom li { 
                        display: flex; 
                        align-items: start;
                        gap: 0.75rem; 
                        padding: 0.5rem; 
                        border-radius: 0.5rem;
                        margin-bottom: 0.5rem;
                     }
                    .prose-custom li::before { display: none; }
                    .prose-custom li.status-safe { background-color: hsl(var(--status-safe)); color: hsl(var(--status-safe-foreground)); }
                    .prose-custom li.status-warning { background-color: hsl(var(--status-warning)); color: hsl(var(--status-warning-foreground)); }
                    .prose-custom li.status-danger { background-color: hsl(var(--status-danger)); color: hsl(var(--status-danger-foreground)); }
                    .prose-custom li.status-unknown { background-color: hsl(var(--muted)); color: hsl(var(--muted-foreground)); }
                  `}
                </style>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none prose-custom"
                  dangerouslySetInnerHTML={getHtml(formState.analysisHtml)}
                />
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
