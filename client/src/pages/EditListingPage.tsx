import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Boat } from "@shared/schema";

const editFormSchema = z.object({
  title: z.string().min(5, "Название должно быть не менее 5 символов"),
  description: z.string().min(20, "Описание должно быть не менее 20 символов"),
  price: z.coerce.number().positive("Цена должна быть больше нуля"),
  year: z.coerce.number()
    .int("Год должен быть целым числом")
    .min(1900, "Год должен быть не раньше 1900")
    .max(new Date().getFullYear() + 1, "Год не может быть в будущем"),
  location: z.string().min(2, "Укажите местоположение"),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  boatType: z.string().optional(),
  length: z.coerce.number().positive("Длина должна быть больше нуля").optional().or(z.literal("")),
  phone: z.string().optional(),
  contactType: z.enum(["phone", "whatsapp", "telegram"]).default("phone"),
  contactPhone: z.string().regex(/^\+7\d{10}$/, "Номер телефона должен быть в формате +7XXXXXXXXXX"),
});

type EditFormValues = z.infer<typeof editFormSchema>;

export default function EditListingPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  const { data: boat, isLoading } = useQuery<Boat>({
    queryKey: [`/api/boats/${id}`],
    enabled: !!id,
  });

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      year: new Date().getFullYear(),
      location: "",
      manufacturer: "",
      model: "",
      boatType: "",
      length: "",
      phone: "",
      contactType: "phone" as const,
      contactPhone: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated && !hasRedirected) {
      setHasRedirected(true);
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите чтобы редактировать объявление.",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [isAuthenticated, hasRedirected, toast, setLocation]);

  useEffect(() => {
    if (boat) {
      if (user?.id !== boat.userId) {
        toast({
          title: "Нет доступа",
          description: "Вы не можете редактировать чужие объявления.",
          variant: "destructive",
        });
        setLocation(`/listing/${boat.id}`);
        return;
      }

      form.reset({
        title: boat.title,
        description: boat.description,
        price: boat.price,
        year: boat.year,
        location: boat.location,
        manufacturer: boat.manufacturer || "",
        model: boat.model || "",
        boatType: boat.boatType || "",
        length: boat.length ? Number(boat.length) : ("" as any),
        phone: boat.phone || "",
        contactType: (boat.contactType as "phone" | "whatsapp" | "telegram") || "phone",
        contactPhone: boat.contactPhone || "",
      });
    }
  }, [boat, user, form, toast, setLocation]);

  const updateMutation = useMutation({
    mutationFn: async (data: EditFormValues) => {
      return await apiRequest("PUT", `/api/boats/${id}`, {
        ...data,
        length: data.length ? Number(data.length) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boats"] });
      queryClient.invalidateQueries({ queryKey: [`/api/boats/${id}`] });
      toast({
        title: "Объявление обновлено!",
        description: "Изменения успешно сохранены.",
      });
      setLocation(`/listing/${id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-xl"></div>
            <div className="h-96 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!boat) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-muted-foreground">Объявление не найдено</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Редактирование объявления</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название *</FormLabel>
                      <FormControl>
                        <Input placeholder="Например: Катер Sea Ray 320 Sundancer" {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Опишите лодку подробно..."
                          className="min-h-32"
                          {...field}
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
                        <FormLabel>Цена (₽) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3500000" {...field} data-testid="input-price" />
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
                        <FormLabel>Год выпуска *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2018" {...field} data-testid="input-year" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Местоположение *</FormLabel>
                      <FormControl>
                        <Input placeholder="Москва" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Производитель</FormLabel>
                        <FormControl>
                          <Input placeholder="Sea Ray" {...field} data-testid="input-manufacturer" />
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
                        <FormLabel>Модель</FormLabel>
                        <FormControl>
                          <Input placeholder="320 Sundancer" {...field} data-testid="input-model" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="boatType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип</FormLabel>
                        <FormControl>
                          <Input placeholder="Катер, Яхта, Моторная лодка" {...field} data-testid="input-boat-type" />
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
                        <FormLabel>Длина (м)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="9.8" {...field} data-testid="input-length" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <Input placeholder="+7 (999) 123-45-67" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип связи</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-contact-type">
                              <SelectValue placeholder="Выберите тип связи" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="phone">Телефон</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="telegram">Telegram</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Контактный телефон</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+79991234567"
                            data-testid="input-contact-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 gap-2"
                    data-testid="button-save"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Сохранить изменения
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation(`/listing/${id}`)}
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
