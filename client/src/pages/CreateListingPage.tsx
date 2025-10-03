import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";

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
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<Record<string, string>>({});
  const [uploadUrlToNormalizedPath, setUploadUrlToNormalizedPath] = useState<Record<string, string>>({});
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true);
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите чтобы разместить объявление.",
        variant: "destructive",
      });
      window.location.href = '/api/login';
    }
  }, [isLoading, isAuthenticated, hasRedirected, toast]);

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
    
    setUploadUrlToNormalizedPath((prev) => ({
      ...prev,
      [data.uploadURL]: data.normalizedPath,
    }));
    
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (!result.successful || result.successful.length === 0) return;
    
    const normalizedPaths = result.successful
      .map((file) => {
        const uploadUrl = file.uploadURL;
        if (!uploadUrl) return null;
        return uploadUrlToNormalizedPath[uploadUrl] || uploadUrl;
      })
      .filter((url): url is string => typeof url === 'string' && url.startsWith('/objects/'));
    
    if (normalizedPaths.length > 0) {
      const remainingSlots = 30 - photoUrls.length;
      const pathsToAdd = normalizedPaths.slice(0, remainingSlots);
      
      setPhotoUrls((prev) => [...prev, ...pathsToAdd]);
      
      const newPreviewUrls: Record<string, string> = {};
      await Promise.all(
        pathsToAdd.map(async (path) => {
          try {
            const response = await fetch("/api/objects/download-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ objectPath: path }),
            });
            if (response.ok) {
              const data = await response.json();
              newPreviewUrls[path] = data.downloadURL;
            } else {
              console.error("Failed to get download URL for", path, await response.text());
            }
          } catch (error) {
            console.error("Error getting download URL for", path, error);
          }
        })
      );
      
      setPhotoPreviewUrls((prev) => ({ ...prev, ...newPreviewUrls }));
      
      toast({
        title: "Фотографии загружены",
        description: `Загружено ${pathsToAdd.length} фото`,
      });
    }
  };

  const removePhoto = (index: number) => {
    const urlToRemove = photoUrls[index];
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[urlToRemove];
      return newUrls;
    });
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
                      <p className="text-sm text-muted-foreground">Добавьте фото вашей лодки (до 30 фото)</p>
                    </div>
                    <ObjectUploader
                      maxNumberOfFiles={30}
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
                      {photoUrls.map((url, index) => {
                        const previewUrl = photoPreviewUrls[url];
                        return (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt={`Фото ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover-elevate"
                              data-testid={`button-remove-photo-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                              {index + 1}
                            </div>
                          </div>
                        );
                      })}
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
