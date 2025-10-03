import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Anchor } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true);
      window.location.href = '/api/login';
    }
  }, [isLoading, isAuthenticated, hasRedirected]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded-xl mb-4"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header Card */}
        <Card className="mb-6 overflow-hidden border-2 shadow-xl">
          <div className="h-32 bg-gradient-to-r from-primary via-blue-600 to-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            <Anchor className="absolute top-4 right-4 w-12 h-12 text-white/20" />
          </div>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 relative z-10">
              <Avatar className="w-32 h-32 border-4 border-background shadow-2xl" data-testid="img-avatar">
                {user.profileImageUrl ? (
                  <AvatarImage src={user.profileImageUrl} alt={user.firstName || "User"} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-3xl">
                    {user.firstName?.[0] || user.email?.[0] || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 pb-4">
                <h1 className="text-3xl font-black mb-2" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm" data-testid="text-user-email">{user.email}</span>
                </div>
                <Badge variant="secondary" className="text-xs" data-testid="badge-member-since">
                  <Calendar className="w-3 h-3 mr-1" />
                  Пользователь с {new Date(user.createdAt!).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Информация о профиле
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Имя</label>
                <p className="text-lg font-semibold" data-testid="text-first-name">{user.firstName || "Не указано"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Фамилия</label>
                <p className="text-lg font-semibold" data-testid="text-last-name">{user.lastName || "Не указано"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg font-semibold" data-testid="text-email">{user.email || "Не указано"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID пользователя</label>
                <p className="text-sm font-mono text-muted-foreground truncate" data-testid="text-user-id">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
