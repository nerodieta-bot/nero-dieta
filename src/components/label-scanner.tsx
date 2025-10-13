'use client';
import { useActionState, useState, useRef } from 'react';
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
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Loader2, Camera, Sparkles, Check, AlertTriangle, X } from 'lucide-react';
import Image from 'next/image';

const initialState: ScanFormState = {
  message: '',
};

export function LabelScanner() {
  const [formState, formAction, isPending] = useActionState(analyzeLabelAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const getHtml = (html?: string) => {
    if (!html) return { __html: '' };
    return { __html: html };
  };

  return (
    <Card className="w-full">
      <form action={(formData) => {
        // Reset preview for new submissions if needed, or keep it
        formAction(formData);
      }}>
        <CardHeader>
          <CardTitle>Prześlij zdjęcie</CardTitle>
          <CardDescription>
            Wybierz wyraźne zdjęcie etykiety ze składem produktu. Im lepsza jakość, tym dokładniejsza analiza.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="sr-only">Upload Image</Label>
            <div className="flex flex-col items-center gap-4">
               <Button
                type="button"
                variant="outline"
                className="w-full h-auto py-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className='flex flex-col items-center gap-2'>
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <span className="text-base font-medium">{preview ? "Zmień zdjęcie" : "Zrób lub wybierz zdjęcie"}</span>
                </div>
              </Button>
              <Input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              {formState.errors?.image && (
                <p className="text-sm text-destructive">{formState.errors.image[0]}</p>
              )}
            </div>
          </div>

          {preview && (
            <div className="border rounded-lg p-2 bg-muted/50">
              <Image
                src={preview}
                alt="Podgląd etykiety"
                width={700}
                height={400}
                className="rounded-md object-contain max-h-60 w-full"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button type="submit" disabled={isPending || !preview} className="w-full md:w-auto">
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
