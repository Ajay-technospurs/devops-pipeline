"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Toaster } from '../../components/ui/toaster';
import { toast } from '../../hooks/use-toast';

// Form validation schema
const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be less than 50 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(50, { message: 'Password must be less than 50 characters' }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    // Static credentials for demo
    const VALID_USERNAME = 'ajaydharmarajck@gmail.com';
    const VALID_PASSWORD = 'NotSimple9999!';

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (data.username === VALID_USERNAME && data.password === VALID_PASSWORD) {
        toast({
          title: "Login Successful",
          description: "Welcome back, " + data.username + "!",
          variant: "default",
        });

        // Reset form and redirect
        reset();
        router.push("/develop");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/assets/login_bg.svg')] bg-cover bg-center bg-no-repeat">
      <Card className="w-[400px] bg-[#001014] text-slate-100">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="w-8 h-8 mb-2">
            <img src="/assets/logo.svg" alt="Logo" className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl font-semibold text-cyan-500">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-200">
                User Name
              </Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="Enter username (hint: demo)"
                className="bg-slate-900 border-slate-800 text-slate-100"
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter password (hint: password123)"
                className="bg-slate-900 border-slate-800 text-slate-100"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                {...register('rememberMe')}
                className="border-slate-700 data-[state=checked]:bg-cyan-500"
              />
              <Label htmlFor="rememberMe" className="text-sm text-slate-200">
                Remember Me
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary"
              disabled={isSubmitting}
              data-testid="login-action-button"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default LoginForm;