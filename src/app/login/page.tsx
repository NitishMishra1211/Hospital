
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle authentication here
    console.log('Login submitted:', { email, password });
    toast({
      title: 'Login Successful (Simulated)',
      description: 'Redirecting to dashboard...',
    });
    // Simulate successful login and redirect
    // In a real app, this would happen after successful authentication
    setTimeout(() => {
        router.push('/'); // Redirect to home page
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
             <LogIn className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your MediCore account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/register">
                Sign Up
              </Link>
            </Button>
          </p>
           <Button variant="link" size="sm" asChild className="text-xs text-muted-foreground hover:text-primary">
                <Link href="/">Back to Home (Dashboard)</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    