import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Sparkles, Save, RefreshCw, Package, Edit, Trash2, Eye, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AiSetting, Boat, PublicUser } from "@shared/schema";

const DEFAULT_SETTINGS = {
  listingModel: "gpt-4o-mini",
  searchModel: "gpt-4o-mini",
  listingPrompt: `Ты профессиональный копирайтер для премиального маркетплейса водной техники. 
Пользователь хочет разместить объявление о продаже лодки/катера/яхты.

Твоя задача:
1. Извлечь и нормализовать данные (производитель, модель, тип лодки, длина и т.д.)
2. Создать красивое, привлекательное описание на русском языке (2-4 предложения)
3. Создать короткий, но информативный заголовок`,
  searchPrompt: `Ты помощник для маркетплейса водной техники. Пользователь ищет лодку/катер/яхту.

Твоя задача - извлечь параметры поиска из запроса. Анализируй:
- Цену (минимальную и максимальную в рублях)
- Год выпуска
- Тип лодки (Катер, Яхта, Гидроцикл, Лодка)
- Местоположение (город)
- Ключевые слова для текстового поиска (производитель, модель, характеристики, особенности)`
};

export default function AdminPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});

  const { data: settings, isLoading } = useQuery<AiSetting[]>({
    queryKey: ['/api/admin/ai-settings'],
  });

  const { data: boats, isLoading: boatsLoading } = useQuery<Boat[]>({
    queryKey: ['/api/boats'],
  });

  const { data: users, isLoading: usersLoading } = useQuery<PublicUser[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: pendingBoats, isLoading: pendingLoading } = useQuery<Boat[]>({
    queryKey: ['/api/admin/pending'],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('PUT', `/api/boats/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/boats'] });
      toast({
        title: "Объявление одобрено",
        description: "Объявление успешно опубликовано",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось одобрить объявление",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('PUT', `/api/boats/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending'] });
      toast({
        title: "Объявление отклонено",
        description: "Объявление успешно отклонено",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отклонить объявление",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      const response = await apiRequest('PUT', '/api/admin/ai-settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-settings'] });
      toast({
        title: "Настройки сохранены",
        description: "Изменения успешно применены",
      });
      setEditMode({});
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    },
  });

  const getSetting = (key: string) => {
    const setting = settings?.find(s => s.settingKey === key);
    return setting?.settingValue || (DEFAULT_SETTINGS as any)[key] || '';
  };

  const handleSave = (key: string, value: string) => {
    updateMutation.mutate({ key, value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black">Админ-панель</h1>
          </div>
          <p className="text-muted-foreground">Настройки AI моделей и промптов</p>
        </div>

        <Tabs defaultValue="moderation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="moderation" data-testid="tab-moderation">
              <Eye className="w-4 h-4 mr-2" />
              Модерация
            </TabsTrigger>
            <TabsTrigger value="models" data-testid="tab-models">
              <Sparkles className="w-4 h-4 mr-2" />
              Модели OpenAI
            </TabsTrigger>
            <TabsTrigger value="prompts" data-testid="tab-prompts">
              Промпты
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="listings" data-testid="tab-listings">
              <Package className="w-4 h-4 mr-2" />
              Объявления
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Модерация объявлений</CardTitle>
                <CardDescription>
                  Объявления ожидающие проверки и публикации
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Ожидает модерации</p>
                      <p className="text-2xl font-bold">{pendingBoats?.length || 0}</p>
                    </div>

                    <div className="space-y-3">
                      {pendingBoats?.map((boat) => (
                        <Card key={boat.id} className="border-orange-200">
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg">{boat.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {boat.description}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="ml-2 border-orange-400 text-orange-600">
                                    На модерации
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 text-xs mt-3">
                                  <Badge variant="secondary">
                                    {boat.price.toLocaleString()} {boat.currency}
                                  </Badge>
                                  <Badge variant="outline">{boat.year} год</Badge>
                                  <Badge variant="outline">{boat.location}</Badge>
                                  {boat.boatType && <Badge variant="outline">{boat.boatType}</Badge>}
                                  {boat.manufacturer && <Badge variant="outline">{boat.manufacturer}</Badge>}
                                  {boat.model && <Badge variant="outline">{boat.model}</Badge>}
                                </div>
                              </div>

                              {boat.originalDescription && (
                                <div className="bg-muted p-3 rounded-lg">
                                  <p className="text-xs text-muted-foreground mb-1">Исходное описание от пользователя:</p>
                                  <p className="text-sm whitespace-pre-wrap">{boat.originalDescription}</p>
                                </div>
                              )}

                              <div className="flex gap-2 pt-2 border-t">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => approveMutation.mutate(boat.id)}
                                  disabled={approveMutation.isPending}
                                  className="gap-1"
                                  data-testid={`button-approve-${boat.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                  Одобрить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectMutation.mutate(boat.id)}
                                  disabled={rejectMutation.isPending}
                                  className="gap-1"
                                  data-testid={`button-reject-${boat.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Отклонить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setLocation(`/edit/${boat.id}`)}
                                  className="gap-1"
                                  data-testid={`button-edit-pending-${boat.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                  Редактировать
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setLocation(`/listing/${boat.id}`)}
                                  className="gap-1"
                                  data-testid={`button-view-pending-${boat.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                  Просмотр
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {pendingBoats?.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          Нет объявлений на модерации
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Модель для создания объявлений</CardTitle>
                <CardDescription>
                  Используется при генерации заголовков и описаний
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode['listingModel'] ? (
                  <div className="space-y-2">
                    <Label htmlFor="listingModel">Модель</Label>
                    <Input
                      id="listingModel"
                      defaultValue={getSetting('listingModel')}
                      placeholder="gpt-4o-mini"
                      data-testid="input-listing-model"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('listingModel') as HTMLInputElement;
                          handleSave('listingModel', input.value);
                        }}
                        data-testid="button-save-listing-model"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditMode({ ...editMode, listingModel: false })}
                        data-testid="button-cancel-listing-model"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm">{getSetting('listingModel')}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode({ ...editMode, listingModel: true })}
                      data-testid="button-edit-listing-model"
                    >
                      Изменить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Модель для поиска</CardTitle>
                <CardDescription>
                  Используется при интерпретации поисковых запросов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode['searchModel'] ? (
                  <div className="space-y-2">
                    <Label htmlFor="searchModel">Модель</Label>
                    <Input
                      id="searchModel"
                      defaultValue={getSetting('searchModel')}
                      placeholder="gpt-4o-mini"
                      data-testid="input-search-model"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('searchModel') as HTMLInputElement;
                          handleSave('searchModel', input.value);
                        }}
                        data-testid="button-save-search-model"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditMode({ ...editMode, searchModel: false })}
                        data-testid="button-cancel-search-model"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm">{getSetting('searchModel')}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode({ ...editMode, searchModel: true })}
                      data-testid="button-edit-search-model"
                    >
                      Изменить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Промпт для создания объявлений</CardTitle>
                <CardDescription>
                  Системный промпт для генерации заголовков и описаний
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode['listingPrompt'] ? (
                  <div className="space-y-2">
                    <Label htmlFor="listingPrompt">Промпт</Label>
                    <Textarea
                      id="listingPrompt"
                      defaultValue={getSetting('listingPrompt')}
                      rows={10}
                      className="font-mono text-sm"
                      data-testid="textarea-listing-prompt"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById('listingPrompt') as HTMLTextAreaElement;
                          handleSave('listingPrompt', textarea.value);
                        }}
                        data-testid="button-save-listing-prompt"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditMode({ ...editMode, listingPrompt: false })}
                        data-testid="button-cancel-listing-prompt"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-60">
                      {getSetting('listingPrompt')}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode({ ...editMode, listingPrompt: true })}
                      data-testid="button-edit-listing-prompt"
                    >
                      Изменить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Промпт для поиска</CardTitle>
                <CardDescription>
                  Системный промпт для интерпретации поисковых запросов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode['searchPrompt'] ? (
                  <div className="space-y-2">
                    <Label htmlFor="searchPrompt">Промпт</Label>
                    <Textarea
                      id="searchPrompt"
                      defaultValue={getSetting('searchPrompt')}
                      rows={10}
                      className="font-mono text-sm"
                      data-testid="textarea-search-prompt"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById('searchPrompt') as HTMLTextAreaElement;
                          handleSave('searchPrompt', textarea.value);
                        }}
                        data-testid="button-save-search-prompt"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditMode({ ...editMode, searchPrompt: false })}
                        data-testid="button-cancel-search-prompt"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-60">
                      {getSetting('searchPrompt')}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode({ ...editMode, searchPrompt: true })}
                      data-testid="button-edit-search-prompt"
                    >
                      Изменить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Пользователи системы</CardTitle>
                <CardDescription>
                  Все зарегистрированные пользователи
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Всего пользователей</p>
                        <p className="text-2xl font-bold">{users?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Новых за сегодня</p>
                        <p className="text-2xl font-bold">
                          {users?.filter(u => {
                            const createdDate = new Date(u.createdAt!);
                            const today = new Date();
                            return createdDate.toDateString() === today.toDateString();
                          }).length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {users?.map((user) => (
                        <Card key={user.id} className="hover-elevate">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">{user.phone}</p>
                                    <p className="text-xs text-muted-foreground">
                                      ID: {user.id}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  Зарегистрирован
                                </p>
                                <p className="text-sm font-medium">
                                  {new Date(user.createdAt!).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {users && users.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          Пока нет зарегистрированных пользователей
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление объявлениями</CardTitle>
                <CardDescription>
                  Все объявления на платформе с статистикой просмотров
                </CardDescription>
              </CardHeader>
              <CardContent>
                {boatsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Всего объявлений</p>
                        <p className="text-2xl font-bold">{boats?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Всего просмотров</p>
                        <p className="text-2xl font-bold">
                          {boats?.reduce((sum, boat) => sum + (boat.viewCount || 0), 0) || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Средняя цена</p>
                        <p className="text-2xl font-bold">
                          {boats && boats.length > 0
                            ? Math.round(boats.reduce((sum, boat) => sum + boat.price, 0) / boats.length).toLocaleString()
                            : 0}{" "}
                          ₽
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {boats?.map((boat) => (
                        <Card key={boat.id} className="hover-elevate">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-bold mb-1">{boat.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                                  {boat.description}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <Badge variant="secondary">
                                    {boat.price.toLocaleString()} {boat.currency}
                                  </Badge>
                                  <Badge variant="outline">{boat.year} год</Badge>
                                  <Badge variant="outline">{boat.location}</Badge>
                                  {boat.boatType && <Badge variant="outline">{boat.boatType}</Badge>}
                                  <Badge variant="outline" className="gap-1">
                                    <Eye className="w-3 h-3" />
                                    {boat.viewCount || 0} просмотров
                                  </Badge>
                                  {boat.isPromoted && <Badge>Продвигается</Badge>}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setLocation(`/listing/${boat.id}`)}
                                  className="gap-1"
                                  data-testid={`button-view-${boat.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                  Просмотр
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setLocation(`/edit/${boat.id}`)}
                                  className="gap-1"
                                  data-testid={`button-admin-edit-${boat.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                  Изменить
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {boats?.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          Объявлений пока нет
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
