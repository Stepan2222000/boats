import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Lock, Zap } from "lucide-react";

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
        title: "✨ С возвращением!",
        description: "Вы успешно вошли в систему",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Произошла ошибка";
      
      let displayMessage = errorMessage;
      if (errorMessage.includes("не найден") || errorMessage.includes("not found") || errorMessage.includes("Invalid")) {
        displayMessage = "Неверный номер телефона или пароль";
      } else if (errorMessage.includes("401:")) {
        displayMessage = "Неверный номер телефона или пароль";
      }
      
      toast({
        title: "Ошибка входа",
        description: displayMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* AI-style animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        <Lock className="absolute top-24 right-[20%] w-6 h-6 text-indigo-400/40 animate-pulse" />
        <Zap className="absolute bottom-40 left-[25%] w-7 h-7 text-purple-400/40 animate-pulse" style={{ animationDelay: '0.7s' }} />
        <Sparkles className="absolute top-1/2 left-[15%] w-6 h-6 text-indigo-300/40 animate-pulse" style={{ animationDelay: '1.2s' }} />
      </div>

      {/* Login card */}
      <Card className="w-full max-w-md relative z-10 border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-indigo-500/20">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Вход в систему
            </h1>
            <p className="text-slate-400 text-sm">
              Войдите для доступа к AI-функциям
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Номер телефона</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+79991234567"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Пароль</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Введите пароль"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-indigo-500/50"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Вход...
                  </div>
                ) : (
                  "Войти"
                )}
              </Button>

              <div className="text-center text-sm text-slate-400 pt-2">
                Нет аккаунта?{" "}
                <button
                  type="button"
                  onClick={() => setLocation("/register")}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  data-testid="link-register"
                >
                  Зарегистрироваться
                </button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
