import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Sparkles, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AiSetting } from "@shared/schema";

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
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});

  const { data: settings, isLoading } = useQuery<AiSetting[]>({
    queryKey: ['/api/admin/ai-settings'],
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

        <Tabs defaultValue="models" className="space-y-4">
          <TabsList>
            <TabsTrigger value="models" data-testid="tab-models">
              <Sparkles className="w-4 h-4 mr-2" />
              Модели OpenAI
            </TabsTrigger>
            <TabsTrigger value="prompts" data-testid="tab-prompts">
              Промпты
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </div>
  );
}
