import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Anchor, Waves, Ship, Compass } from "lucide-react";

const loginSchema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, "Введите номер в формате +7XXXXXXXXXX"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await apiRequest("POST", "/api/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "🚢 Вход выполнен!",
        description: "Добро пожаловать обратно",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка входа",
        description: error.message || "Проверьте номер телефона и пароль",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated ocean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
          <Compass className="absolute top-16 left-16 w-28 h-28 text-white/10 animate-spin" style={{ animationDuration: '20s' }} />
          <Ship className="absolute bottom-32 right-24 w-32 h-32 text-white/10 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <Waves className="absolute top-1/2 right-1/3 w-24 h-24 text-white/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="white" className="animate-[wave_10s_ease-in-out_infinite]" />
          </svg>
        </div>
      </div>

      {/* Login card */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Anchor className="h-9 w-9 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Вход
          </CardTitle>
          <CardDescription className="text-center text-base">
            Войдите в свой аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Номер телефона</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+79991234567"
                        className="h-11 text-base"
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Пароль</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Введите пароль"
                        className="h-11 text-base"
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? "Вход..." : "Войти"}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Нет аккаунта?{" "}
                <button
                  type="button"
                  onClick={() => setLocation("/register")}
                  className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline"
                  data-testid="link-register"
                >
                  Зарегистрироваться
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-50px);
          }
        }
      `}</style>
    </div>
  );
}
