import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sparkles, Loader2, Image as ImageIcon, X } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

const listingFormSchema = z.object({
  rawDescription: z.string().min(10, "Опишите вашу лодку хотя бы в нескольких словах"),
  price: z.coerce.number().positive("Цена должна быть больше нуля"),
  year: z.coerce.number()
    .int("Год должен быть целым числом")
    .min(1900, "Год должен быть не раньше 1900")
    .max(new Date().getFullYear() + 1, "Год не может быть в будущем"),
  location: z.string().min(2, "Укажите местоположение"),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  length: z.coerce.number().positive("Длина должна быть больше нуля").optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

export default function CreateListingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      rawDescription: "",
      price: 0,
      year: new Date().getFullYear(),
      location: "",
      manufacturer: "",
      model: "",
      length: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ListingFormValues) => {
      setIsProcessing(true);
      const response = await fetch("/api/boats/ai-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          photoUrls,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create listing");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boats"] });
      toast({
        title: "Объявление создано!",
        description: "Ваше объявление успешно опубликовано.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const onSubmit = (data: ListingFormValues) => {
    createMutation.mutate(data);
  };

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", {
      method: "POST",
    });
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (!result.successful || result.successful.length === 0) return;
    
    const newUrls = result.successful
      .map((file) => {
        return (file.response as any)?.body?.normalizedPath || file.uploadURL;
      })
      .filter((url): url is string => typeof url === 'string');
    
    if (newUrls.length > 0) {
      const remainingSlots = 10 - photoUrls.length;
      const urlsToAdd = newUrls.slice(0, remainingSlots);
      
      setPhotoUrls((prev) => [...prev, ...urlsToAdd]);
      toast({
        title: "Фотографии загружены",
        description: `Загружено ${urlsToAdd.length} фото`,
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Card className="border-2 hover-elevate">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black">Создать объявление</CardTitle>
                <CardDescription className="text-base mt-2">
                  AI поможет создать идеальное описание для вашей лодки
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="rawDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Описание вашей лодки</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Например: Продаю катер Sea Ray, 2015 года, в отличном состоянии. Длина 9.8 метров, недавно обновили двигатели..."
                          className="min-h-32 text-base"
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Цена (₽)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="3490000"
                            className="text-base"
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Год выпуска</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="2015"
                            className="text-base"
                            data-testid="input-year"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Местоположение</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Краснодар"
                            className="text-base"
                            data-testid="input-location"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Длина (м)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.1"
                            placeholder="9.8"
                            className="text-base"
                            data-testid="input-length"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Производитель (опционально)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Sea Ray"
                            className="text-base"
                            data-testid="input-manufacturer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Модель (опционально)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="320 Sundancer"
                            className="text-base"
                            data-testid="input-model"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold">Фотографии</h3>
                      <p className="text-sm text-muted-foreground">Добавьте фото вашей лодки (до 10 фото)</p>
                    </div>
                    <ObjectUploader
                      maxNumberOfFiles={10}
                      maxFileSize={10485760}
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      buttonVariant="outline"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Загрузить фото
                    </ObjectUploader>
                  </div>

                  {photoUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photoUrls.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={url}
                            alt={`Фото ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`button-remove-photo-${index}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isProcessing}
                    className="flex-1 text-lg font-bold"
                    data-testid="button-create-listing"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        AI обрабатывает...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Создать объявление
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="text-lg font-bold"
                    data-testid="button-cancel"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
