import { useState, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Sparkles, Loader2, Image as ImageIcon, X, Phone, MessageCircle, Send } from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

const descriptionFormSchema = z.object({
  description: z.string().min(50, "Опишите вашу лодку подробнее (минимум 50 символов)"),
});

const contactFormSchema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, "Номер телефона должен быть в формате +7XXXXXXXXXX"),
  whatsappEnabled: z.boolean(),
  whatsappPhone: z.string().optional(),
  telegramEnabled: z.boolean(),
  telegramUsername: z.string().optional(),
  inAppChatEnabled: z.boolean(),
}).refine(
  (data) => !data.whatsappEnabled || (data.whatsappPhone && data.whatsappPhone.length > 0),
  { message: "Укажите номер телефона для WhatsApp", path: ["whatsappPhone"] }
).refine(
  (data) => !data.telegramEnabled || (data.telegramUsername && data.telegramUsername.length > 0),
  { message: "Укажите username или номер для Telegram", path: ["telegramUsername"] }
);

type DescriptionFormValues = z.infer<typeof descriptionFormSchema>;
type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function CreateListingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"description" | "form" | "contacts" | "generating">("description");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<Record<string, string>>({});
  const fileIdToNormalizedPathRef = useRef<Record<string, string>>({});
  const [validationData, setValidationData] = useState<any>(null);

  const descriptionForm = useForm<DescriptionFormValues>({
    resolver: zodResolver(descriptionFormSchema),
    defaultValues: {
      description: "",
    },
  });

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      phone: "",
      whatsappEnabled: false,
      whatsappPhone: "",
      telegramEnabled: false,
      telegramUsername: "",
      inAppChatEnabled: false,
    },
  });

  const validateMutation = useMutation({
    mutationFn: async (data: DescriptionFormValues) => {
      const response = await fetch("/api/boats/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: data.description }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка валидации");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.isValid) {
        setValidationData(data.extractedData);
        setStep("contacts");
        toast({
          title: "Отлично!",
          description: "Все необходимые данные найдены. Теперь укажите контакты.",
        });
      } else {
        setValidationData({
          price: data.extractedData?.price || 0,
          year: data.extractedData?.year || 0,
          manufacturer: data.extractedData?.manufacturer || null,
          model: data.extractedData?.model || null,
        });
        setStep("form");
        toast({
          title: "Нужна дополнительная информация",
          description: `Пожалуйста, заполните оставшиеся поля`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (contactData: ContactFormValues) => {
      const contacts = [];
      contacts.push({ contactType: "phone", contactValue: contactData.phone });
      
      if (contactData.whatsappEnabled && contactData.whatsappPhone) {
        contacts.push({ contactType: "whatsapp", contactValue: contactData.whatsappPhone });
      }
      
      if (contactData.telegramEnabled && contactData.telegramUsername) {
        contacts.push({ contactType: "telegram", contactValue: contactData.telegramUsername });
      }
      
      if (contactData.inAppChatEnabled) {
        contacts.push({ contactType: "in_app_chat", contactValue: contactData.phone });
      }

      const response = await fetch("/api/boats/create-with-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawDescription: descriptionForm.getValues("description"),
          extractedData: validationData,
          photoUrls,
          contacts,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Не удалось создать объявление");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const boatId = data.boat.id;
      localStorage.setItem("myListings", JSON.stringify([
        ...(JSON.parse(localStorage.getItem("myListings") || "[]")),
        { localId: crypto.randomUUID(), boatId, status: "pending_moderation", canEdit: true }
      ]));
      
      queryClient.invalidateQueries({ queryKey: ["/api/boats"] });
      toast({
        title: "Объявление создано!",
        description: "Запрос на создание отправлен AI. Объявление будет обработано и отправлено на модерацию.",
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
  });

  const handleGetUploadParameters = async (file: any) => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const data = await response.json();
    
    fileIdToNormalizedPathRef.current[file.id] = data.normalizedPath;
    
    return {
      method: "PUT" as const,
      url: data.uploadURL as string,
      headers: { "Content-Type": file.type },
    };
  };

  const handleUploadComplete = async (result: UploadResult<any, any>) => {
    if (!result.successful || result.successful.length === 0) return;
    
    const normalizedPaths = result.successful
      .map((file: any) => fileIdToNormalizedPathRef.current[file.id])
      .filter(Boolean) as string[];

    const previewRequests = normalizedPaths.map(async (path: string) => {
      const response = await fetch("/api/objects/download-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectPath: path }),
      });
      const data = await response.json();
      return { path, url: data.downloadURL };
    });

    const previews = await Promise.all(previewRequests);
    const newPhotoPreviewUrls: Record<string, string> = {};
    previews.forEach(({ path, url }: { path: string; url: string }) => {
      newPhotoPreviewUrls[path] = url;
    });

    setPhotoUrls(prev => [...prev, ...normalizedPaths]);
    setPhotoPreviewUrls(prev => ({ ...prev, ...newPhotoPreviewUrls }));

    toast({
      title: "Фото загружены",
      description: `Загружено ${result.successful.length} фото`,
    });
  };

  const handleRemovePhoto = (photoUrl: string) => {
    setPhotoUrls(prev => prev.filter(url => url !== photoUrl));
    setPhotoPreviewUrls(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[photoUrl];
      return newPreviews;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Разместить объявление
            </CardTitle>
            <CardDescription>
              {step === "description" && "Опишите вашу лодку подробно, включая цену, год, производителя и модель"}
              {step === "form" && "Заполните дополнительную информацию"}
              {step === "contacts" && "Укажите контактную информацию"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "description" && (
              <Form {...descriptionForm}>
                <form onSubmit={descriptionForm.handleSubmit((data) => validateMutation.mutate(data))} className="space-y-6">
                  <FormField
                    control={descriptionForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-gray-900">
                          Описание вашей лодки
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={8}
                            placeholder="Продаю Sea Ray 320 Sundancer 2015 года за 3 500 000₽. Длина 9.8м, находится в Краснодаре. Два двигателя Mercruiser 8.2L, круиз-контроль, автопилот, GPS, эхолот. Каюта с кондиционером, камбуз, санузел. В отличном состоянии, все ТО пройдены."
                            className="text-base bg-white border-blue-300 text-gray-900 placeholder:text-gray-400"
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        Фотографии (до 30 фото)
                      </h3>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {photoUrls.map((url, index) => (
                          <div key={url} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-blue-200">
                              {photoPreviewUrls[url] ? (
                                <img
                                  src={photoPreviewUrls[url]}
                                  alt={`Фото ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                              {index + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(url)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                              data-testid={`button-remove-photo-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={validateMutation.isPending}
                    className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    data-testid="button-generate"
                  >
                    {validateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Проверка...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Сгенерировать объявление
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {step === "form" && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    Пожалуйста, заполните недостающую информацию для завершения объявления
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Цена (₽)</label>
                    <Input
                      type="number"
                      placeholder="Например: 3500000"
                      defaultValue={validationData?.price || ""}
                      onChange={(e) => setValidationData({...validationData, price: parseInt(e.target.value) || 0})}
                      className="text-base bg-white border-blue-300"
                      data-testid="input-price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Год выпуска</label>
                    <Input
                      type="number"
                      placeholder="Например: 2015"
                      defaultValue={validationData?.year || ""}
                      onChange={(e) => setValidationData({...validationData, year: parseInt(e.target.value) || 0})}
                      className="text-base bg-white border-blue-300"
                      data-testid="input-year"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Местоположение</label>
                    <Input
                      type="text"
                      placeholder="Например: Москва"
                      defaultValue={validationData?.location || ""}
                      onChange={(e) => setValidationData({...validationData, location: e.target.value})}
                      className="text-base bg-white border-blue-300"
                      data-testid="input-location"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("description")}
                    className="flex-1"
                  >
                    Назад
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep("contacts")}
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-blue-700"
                    data-testid="button-continue"
                  >
                    Продолжить
                  </Button>
                </div>
              </div>
            )}

            {step === "contacts" && (
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
                  <FormField
                    control={contactForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-gray-900">
                          Контактный телефон (обязательно)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+79991234567"
                            className="text-base bg-white border-blue-300"
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900">Дополнительные способы связи</h3>
                    
                    <FormField
                      control={contactForm.control}
                      name="whatsappEnabled"
                      render={({ field }) => (
                        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-whatsapp"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-green-600" />
                              <label className="font-medium text-gray-900">WhatsApp</label>
                            </div>
                            {field.value && (
                              <FormField
                                control={contactForm.control}
                                name="whatsappPhone"
                                render={({ field: innerField }) => (
                                  <Input
                                    {...innerField}
                                    placeholder="+79991234567"
                                    className="mt-2"
                                    data-testid="input-whatsapp-phone"
                                  />
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="telegramEnabled"
                      render={({ field }) => (
                        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-telegram"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Send className="w-4 h-4 text-blue-500" />
                              <label className="font-medium text-gray-900">Telegram</label>
                            </div>
                            {field.value && (
                              <FormField
                                control={contactForm.control}
                                name="telegramUsername"
                                render={({ field: innerField }) => (
                                  <Input
                                    {...innerField}
                                    placeholder="@username или +79991234567"
                                    className="mt-2"
                                    data-testid="input-telegram-username"
                                  />
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="inAppChatEnabled"
                      render={({ field }) => (
                        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-in-app-chat"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-blue-600" />
                              <label className="font-medium text-gray-900">Внутренний чат</label>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Покупатели смогут написать вам прямо на сайте
                            </p>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("description")}
                      className="flex-1"
                      data-testid="button-back"
                    >
                      Назад
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-blue-700"
                      data-testid="button-create"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Создание...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Создать объявление
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
