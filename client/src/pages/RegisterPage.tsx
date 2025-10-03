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
import { Sparkles, Shield, Zap } from "lucide-react";

const registerSchema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, "Введите номер в формате +7XXXXXXXXXX"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data;
      const res = await apiRequest("POST", "/api/register", registerData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "✨ Добро пожаловать!",
        description: "Ваш аккаунт успешно создан",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Произошла ошибка";
      
      let displayMessage = errorMessage;
      if (errorMessage.includes("уже существует") || errorMessage.includes("already exists")) {
        displayMessage = "Пользователь с таким номером телефона уже существует";
      } else if (errorMessage.includes("400:")) {
        try {
          const jsonMatch = errorMessage.match(/\{[^}]+\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            displayMessage = parsed.message || displayMessage;
          }
        } catch {
          displayMessage = "Ошибка при регистрации";
        }
      }
      
      toast({
        title: "Не удалось зарегистрироваться",
        description: displayMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* AI-style animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        <Sparkles className="absolute top-20 left-[15%] w-6 h-6 text-blue-400/40 animate-pulse" />
        <Zap className="absolute bottom-32 right-[20%] w-8 h-8 text-cyan-400/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <Shield className="absolute top-1/3 right-[15%] w-7 h-7 text-blue-300/40 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Registration card */}
      <Card className="w-full max-w-md relative z-10 border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-blue-500/20">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Создать аккаунт
            </h1>
            <p className="text-slate-400 text-sm">
              AI-платформа нового поколения
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
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
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
                        placeholder="Минимум 6 символов"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Подтвердите пароль</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Повторите пароль"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                        data-testid="input-confirm-password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Создание аккаунта...
                  </div>
                ) : (
                  "Зарегистрироваться"
                )}
              </Button>

              <div className="text-center text-sm text-slate-400 pt-2">
                Уже есть аккаунт?{" "}
                <button
                  type="button"
                  onClick={() => setLocation("/login")}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  data-testid="link-login"
                >
                  Войти
                </button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
