import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { UserPlus, Mail, Lock, User, Globe, Eye, EyeOff, Bot } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRegister, useListLanguages, getListLanguagesQueryKey } from "@workspace/api-client-react";
import { useAuthContext } from "@/hooks/use-auth";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  preferredLanguage: z.string().default("en"),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuthContext();
  const { toast } = useToast();
  const registerMutation = useRegister();
  const [showPw, setShowPw] = useState(false);

  const { data: languagesData } = useListLanguages({
    query: { queryKey: getListLanguagesQueryKey() }
  });
  const languages = languagesData?.languages || [];

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", preferredLanguage: "en" },
  });

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(
      { data },
      {
        onSuccess: (res: any) => {
          login(res.token);
          toast({ title: "Account created!", description: `Welcome to AssistAI, ${res.user.name}!` });
          setLocation("/search");
        },
        onError: (err: any) => {
          const msg = err?.data?.error || "Registration failed. Please try again.";
          toast({ title: "Registration failed", description: msg, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-md">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create account</h1>
            <p className="text-muted-foreground mt-1">Join AssistAI for free today</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Create account form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" aria-hidden />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" autoComplete="name" {...field} data-testid="input-name" aria-label="Full name" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" aria-hidden />
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} data-testid="input-email" aria-label="Email address" className="h-11" />
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
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" aria-hidden />
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPw ? "text" : "password"} placeholder="Min 6 characters" autoComplete="new-password" {...field} data-testid="input-password" aria-label="Password" className="h-11 pr-11" />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPw ? "Hide password" : "Show password"}>
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" aria-hidden />
                      Preferred Language
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-language" aria-label="Select preferred language" className="h-11">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.length > 0 ? (
                          languages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name} ({lang.nativeName})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="en">English</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 gap-2 mt-2" disabled={registerMutation.isPending} data-testid="button-submit-register" aria-label="Create your account">
                <UserPlus className="w-4 h-4" />
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-to-login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
