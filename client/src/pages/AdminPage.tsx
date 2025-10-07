import { useState, useEffect } from "react";
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
import { Settings, Sparkles, Save, RefreshCw, Package, Edit, Trash2, Eye, Users, Check, X, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AiSetting, Boat, PublicUser, BoatContact } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const DEFAULT_SETTINGS = {
  validationModel: "gpt-4o-mini",
  validationPrompt: `Ты помощник для проверки объявлений о продаже водной техники. 
Проверь, что пользователь предоставил все необходимые данные для публикации объявления:

Обязательные поля:
- Описание лодки/катера (хотя бы несколько слов)
- Цена (в рублях)
- Местоположение (город)

Верни результат в формате JSON:
{
  "isValid": true/false,
  "missingFields": ["поле1", "поле2"],
  "extractedData": {
    "price": число,
    "location": "город"
  }
}`,
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

function getStatusBadge(status: string) {
  switch (status) {
    case "ai_processing":
      return <Badge className="bg-blue-500 hover:bg-blue-600 gap-1"><Loader2 className="w-3 h-3 animate-spin" />AI обрабатывает</Badge>;
    case "ai_ready":
      return <Badge className="bg-green-500 hover:bg-green-600 gap-1"><Check className="w-3 h-3" />Готово к модерации</Badge>;
    case "approved":
      return <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1"><Check className="w-3 h-3" />Опубликовано</Badge>;
    case "rejected":
      return <Badge variant="destructive" className="gap-1"><X className="w-3 h-3" />Отклонено</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function AdminPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery<AiSetting[]>({
    queryKey: ['/api/admin/ai-settings'],
  });

  const { data: adminBoats, isLoading: boatsLoading } = useQuery<Boat[]>({
    queryKey: ['/api/admin/boats'],
  });

  const { data: users, isLoading: usersLoading } = useQuery<PublicUser[]>({
    queryKey: ['/api/admin/users'],
  });

  // WebSocket connection for real-time updates with reconnection logic
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | undefined;
    let reconnectAttempts = 0;
    let shouldReconnect = true;
    const maxReconnectAttempts = 10;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0;
        reconnectTimeout = undefined;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'boat_update') {
          console.log('Boat update received:', data);
          // Invalidate queries to refetch updated data
          queryClient.invalidateQueries({ queryKey: ['/api/admin/boats'] });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        
        // Only reconnect if component is still mounted
        if (shouldReconnect && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectAttempts++;
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
          reconnectTimeout = setTimeout(connect, delay);
        } else if (!shouldReconnect) {
          console.log('Component unmounted, skipping reconnection');
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const updateBoatMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Boat> }) => {
      return await apiRequest('PUT', `/api/admin/boats/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/boats'] });
      toast({
        title: "Объявление обновлено",
        description: "Изменения успешно сохранены",
      });
      setEditingBoat(null);
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить объявление",
        variant: "destructive",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('POST', `/api/admin/boats/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/boats'] });
      toast({
        title: "Объявление одобрено",
        description: "Объявление успешно опубликовано",
      });
      setSelectedBoat(null);
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
    mutationFn: async (data: { id: string; reason: string }) => {
      return await apiRequest('POST', `/api/admin/boats/${data.id}/reject`, { reason: data.reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/boats'] });
      toast({
        title: "Объявление отклонено",
        description: "Объявление успешно отклонено",
      });
      setSelectedBoat(null);
      setRejectReason("");
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отклонить объявление",
        variant: "destructive",
      });
    },
  });

  const updateSettingsMutation = useMutation({
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
    updateSettingsMutation.mutate({ key, value });
  };

  // Get contacts for selected boat
  const { data: contacts } = useQuery<BoatContact[]>({
    queryKey: ['/api/boats', selectedBoat?.id, 'contacts'],
    enabled: !!selectedBoat,
  });

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

  const aiProcessingBoats = adminBoats?.filter(b => b.status === "ai_processing") || [];
  const aiReadyBoats = adminBoats?.filter(b => b.status === "ai_ready") || [];
  const approvedBoats = adminBoats?.filter(b => b.status === "approved") || [];
  const rejectedBoats = adminBoats?.filter(b => b.status === "rejected") || [];

  // Filtered boats based on status filter
  const filteredBoats = statusFilter 
    ? adminBoats?.filter(b => b.status === statusFilter) || []
    : adminBoats || [];

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
          <p className="text-muted-foreground">Управление объявлениями и настройками</p>
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
          </TabsList>

          <TabsContent value="moderation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card 
                className={`cursor-pointer hover-elevate transition-all ${statusFilter === "ai_processing" ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setStatusFilter(statusFilter === "ai_processing" ? null : "ai_processing")}
                data-testid="filter-ai-processing"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Loader2 className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-muted-foreground">AI обрабатывает</p>
                  </div>
                  <p className="text-2xl font-bold">{aiProcessingBoats.length}</p>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer hover-elevate transition-all ${statusFilter === "ai_ready" ? "ring-2 ring-green-500" : ""}`}
                onClick={() => setStatusFilter(statusFilter === "ai_ready" ? null : "ai_ready")}
                data-testid="filter-ai-ready"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-muted-foreground">Готово к модерации</p>
                  </div>
                  <p className="text-2xl font-bold">{aiReadyBoats.length}</p>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer hover-elevate transition-all ${statusFilter === "approved" ? "ring-2 ring-emerald-500" : ""}`}
                onClick={() => setStatusFilter(statusFilter === "approved" ? null : "approved")}
                data-testid="filter-approved"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <p className="text-sm text-muted-foreground">Опубликовано</p>
                  </div>
                  <p className="text-2xl font-bold">{approvedBoats.length}</p>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer hover-elevate transition-all ${statusFilter === "rejected" ? "ring-2 ring-destructive" : ""}`}
                onClick={() => setStatusFilter(statusFilter === "rejected" ? null : "rejected")}
                data-testid="filter-rejected"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <X className="w-4 h-4 text-destructive" />
                    <p className="text-sm text-muted-foreground">Отклонено</p>
                  </div>
                  <p className="text-2xl font-bold">{rejectedBoats.length}</p>
                </CardContent>
              </Card>
            </div>

            {statusFilter && (
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="gap-1">
                  Фильтр: {
                    statusFilter === "ai_processing" ? "AI обрабатывает" :
                    statusFilter === "ai_ready" ? "Готово к модерации" :
                    statusFilter === "approved" ? "Опубликовано" :
                    "Отклонено"
                  }
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatusFilter(null)}
                  data-testid="button-clear-filter"
                >
                  <X className="w-3 h-3" />
                  Сбросить
                </Button>
              </div>
            )}

            {boatsLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredBoats.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {statusFilter ? `Нет объявлений со статусом "${statusFilter}"` : "Нет объявлений"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBoats.map((boat) => (
                  <Card 
                    key={boat.id} 
                    className={
                      boat.status === "ai_processing" ? "border-blue-200 bg-blue-50/50" :
                      boat.status === "ai_ready" ? "border-green-200 bg-green-50/50" :
                      boat.status === "approved" ? "border-emerald-200 bg-emerald-50/50" :
                      "border-destructive/30 bg-destructive/5"
                    }
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-lg">{boat.title}</h3>
                              {getStatusBadge(boat.status)}
                            </div>
                            {boat.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{boat.description}</p>
                            )}
                          </div>
                        </div>

                        {boat.aiError && (
                          <div className="bg-destructive/10 p-3 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-destructive">Ошибка AI:</p>
                              <p className="text-sm text-destructive">{boat.aiError}</p>
                            </div>
                          </div>
                        )}

                        {boat.rawDescription && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Промпт пользователя:</p>
                            <p className="text-sm whitespace-pre-wrap">{boat.rawDescription}</p>
                          </div>
                        )}

                        {boat.rejectionReason && (
                          <div className="bg-destructive/10 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Причина отклонения:</p>
                            <p className="text-sm text-destructive">{boat.rejectionReason}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{boat.price.toLocaleString()} {boat.currency}</Badge>
                          <Badge variant="outline">{boat.year} год</Badge>
                          <Badge variant="outline">{boat.location}</Badge>
                          {boat.manufacturer && <Badge variant="outline">{boat.manufacturer}</Badge>}
                          {boat.model && <Badge variant="outline">{boat.model}</Badge>}
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            onClick={() => setSelectedBoat(boat)}
                            className="gap-1"
                            data-testid={`button-view-${boat.id}`}
                          >
                            <Eye className="w-4 h-4" />
                            Просмотр и модерация
                          </Button>
                          {boat.status === "ai_ready" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingBoat(boat)}
                              className="gap-1"
                              data-testid={`button-edit-${boat.id}`}
                            >
                              <Edit className="w-4 h-4" />
                              Редактировать
                            </Button>
                          )}
                          {boat.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setLocation(`/listing/${boat.id}`)}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              На сайте
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Модель для валидации данных</CardTitle>
                <CardDescription>
                  Используется для первичной проверки данных перед созданием объявления
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode['validationModel'] ? (
                  <div className="space-y-2">
                    <Label htmlFor="validationModel">Модель</Label>
                    <Input
                      id="validationModel"
                      defaultValue={getSetting('validationModel')}
                      placeholder="gpt-4o-mini"
                      data-testid="input-validation-model"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('validationModel') as HTMLInputElement;
                          handleSave('validationModel', input.value);
                        }}
                        data-testid="button-save-validation-model"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditMode({ ...editMode, validationModel: false })}
                        data-testid="button-cancel-validation-model"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm">{getSetting('validationModel')}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode({ ...editMode, validationModel: true })}
                      data-testid="button-edit-validation-model"
                    >
                      Изменить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

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

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Промпт для валидации данных</CardTitle>
                <CardDescription>
                  Системный промпт для первичной проверки данных перед созданием объявления
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode['validationPrompt'] ? (
                  <div className="space-y-2">
                    <Label htmlFor="validationPrompt">Промпт</Label>
                    <Textarea
                      id="validationPrompt"
                      defaultValue={getSetting('validationPrompt')}
                      rows={10}
                      className="font-mono text-sm"
                      data-testid="textarea-validation-prompt"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById('validationPrompt') as HTMLTextAreaElement;
                          handleSave('validationPrompt', textarea.value);
                        }}
                        data-testid="button-save-validation-prompt"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditMode({ ...editMode, validationPrompt: false })}
                        data-testid="button-cancel-validation-prompt"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-60">
                      {getSetting('validationPrompt')}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode({ ...editMode, validationPrompt: true })}
                      data-testid="button-edit-validation-prompt"
                    >
                      Изменить
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

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

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Пользователи</CardTitle>
                <CardDescription>Зарегистрированные пользователи платформы</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-4 bg-muted rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">Всего пользователей</p>
                      <p className="text-2xl font-bold">{users?.length || 0}</p>
                    </div>

                    {users?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            Зарегистрирован: {new Date(user.createdAt!).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Moderation Dialog */}
      <Dialog open={!!selectedBoat} onOpenChange={(open) => !open && setSelectedBoat(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Модерация объявления</DialogTitle>
            <DialogDescription>
              Проверьте информацию и примите решение
            </DialogDescription>
          </DialogHeader>

          {selectedBoat && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">{selectedBoat.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedBoat.description}</p>
              </div>

              {selectedBoat.rawDescription && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Промпт пользователя:</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedBoat.rawDescription}</p>
                </div>
              )}

              {selectedBoat.aiError && (
                <div className="bg-destructive/10 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-destructive mb-2">Ошибка AI:</p>
                  <p className="text-sm text-destructive">{selectedBoat.aiError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Цена</p>
                  <p className="font-semibold">{selectedBoat.price.toLocaleString()} {selectedBoat.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Год</p>
                  <p className="font-semibold">{selectedBoat.year}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Местоположение</p>
                  <p className="font-semibold">{selectedBoat.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Тип</p>
                  <p className="font-semibold">{selectedBoat.boatType || "Не указано"}</p>
                </div>
              </div>

              {contacts && contacts.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">Контакты:</p>
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="flex items-center gap-2">
                        <Badge variant="outline">{contact.contactType}</Badge>
                        <span className="font-mono text-sm">{contact.contactValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBoat.photoUrls && selectedBoat.photoUrls.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Фотографии:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedBoat.photoUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Фото ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    onClick={() => approveMutation.mutate(selectedBoat.id)}
                    disabled={approveMutation.isPending}
                    className="flex-1 gap-2"
                    data-testid="button-approve-modal"
                  >
                    <Check className="w-4 h-4" />
                    Одобрить и опубликовать
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingBoat(selectedBoat)}
                    className="gap-2"
                    data-testid="button-edit-modal"
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rejectReason">Причина отклонения (опционально)</Label>
                  <Textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Укажите причину отклонения..."
                    rows={3}
                    data-testid="textarea-reject-reason"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => rejectMutation.mutate({ id: selectedBoat.id, reason: rejectReason })}
                    disabled={rejectMutation.isPending}
                    className="w-full gap-2"
                    data-testid="button-reject-modal"
                  >
                    <X className="w-4 h-4" />
                    Отклонить объявление
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingBoat} onOpenChange={(open) => !open && setEditingBoat(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать объявление</DialogTitle>
          </DialogHeader>

          {editingBoat && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Заголовок</Label>
                <Input
                  id="edit-title"
                  defaultValue={editingBoat.title}
                  data-testid="input-edit-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={editingBoat.description}
                  rows={5}
                  data-testid="textarea-edit-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Цена</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    defaultValue={editingBoat.price}
                    data-testid="input-edit-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Год</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    defaultValue={editingBoat.year}
                    data-testid="input-edit-year"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Местоположение</Label>
                <Input
                  id="edit-location"
                  defaultValue={editingBoat.location}
                  data-testid="input-edit-location"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const title = (document.getElementById('edit-title') as HTMLInputElement).value;
                    const description = (document.getElementById('edit-description') as HTMLTextAreaElement).value;
                    const price = parseInt((document.getElementById('edit-price') as HTMLInputElement).value);
                    const year = parseInt((document.getElementById('edit-year') as HTMLInputElement).value);
                    const location = (document.getElementById('edit-location') as HTMLInputElement).value;

                    updateBoatMutation.mutate({
                      id: editingBoat.id,
                      updates: { title, description, price, year, location }
                    });
                  }}
                  disabled={updateBoatMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-edit"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить изменения
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingBoat(null)}
                  data-testid="button-cancel-edit"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
