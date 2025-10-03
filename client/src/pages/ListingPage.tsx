import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, MapPin, Calendar, Ruler, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Boat } from "@shared/schema";

export default function ListingPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: boat, isLoading } = useQuery<Boat>({
    queryKey: [`/api/boats/${id}`],
    enabled: !!id,
  });

  const recordViewMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/boats/${id}/view`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/boats/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Объявление удалено",
        description: "Ваше объявление успешно удалено.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/boats"] });
      queryClient.invalidateQueries({ queryKey: [`/api/boats/${id}`] });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить объявление.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (id && !recordViewMutation.isPending) {
      recordViewMutation.mutate();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-xl"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!boat) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-muted-foreground">Объявление не найдено</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === boat.userId;
  const viewHistory = (boat.viewHistory as any) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Owner Actions */}
        {isOwner && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Управление объявлением
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setLocation(`/edit/${boat.id}`)}
                  className="gap-2"
                  data-testid="button-edit-listing"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Вы уверены, что хотите удалить это объявление?")) {
                      deleteMutation.mutate();
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="gap-2"
                  data-testid="button-delete-listing"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Просмотров</p>
                  <p className="text-2xl font-bold" data-testid="text-view-count">{boat.viewCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Уникальных пользователей</p>
                  <p className="text-2xl font-bold">{new Set(viewHistory.map((v: any) => v.userId)).size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Создано</p>
                  <p className="text-sm font-medium">{new Date(boat.createdAt!).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {boat.photoUrls && boat.photoUrls.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={boat.photoUrls[0]}
                    alt={boat.title}
                    className="w-full h-96 object-cover rounded-t-xl"
                    data-testid="img-boat-main"
                  />
                  {boat.photoUrls.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 p-4">
                      {boat.photoUrls.slice(1, 5).map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${boat.title} ${idx + 2}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Описание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap" data-testid="text-description">{boat.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Price & Title */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <h1 className="text-2xl font-black mb-4" data-testid="text-boat-title">{boat.title}</h1>
                <div className="text-4xl font-black text-primary mb-4" data-testid="text-boat-price">
                  {boat.price.toLocaleString()} {boat.currency}
                </div>
                {boat.isPromoted && (
                  <Badge variant="default" className="mb-4">
                    Продвигаемое объявление
                  </Badge>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {boat.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {boat.year} год
                  </div>
                  {boat.length && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Ruler className="w-4 h-4" />
                      {boat.length} м
                    </div>
                  )}
                  {boat.boatType && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      {boat.boatType}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Specs */}
            {(boat.manufacturer || boat.model) && (
              <Card>
                <CardHeader>
                  <CardTitle>Характеристики</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {boat.manufacturer && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Производитель:</span>
                      <span className="font-medium">{boat.manufacturer}</span>
                    </div>
                  )}
                  {boat.model && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Модель:</span>
                      <span className="font-medium">{boat.model}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            {boat.phone && (
              <Card>
                <CardHeader>
                  <CardTitle>Контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" data-testid="button-contact">
                    {boat.phone}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
