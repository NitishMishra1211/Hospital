
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LogIn } from 'lucide-react';

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please ensure your passwords are the same.',
      });
      return;
    }
    // In a real app, you would handle registration logic here
    console.log('Registration submitted:', { name, email, password });
    toast({
      title: 'Registration Successful (Simulated)',
      description: 'Redirecting to dashboard...',
    });
    // Simulate successful registration and redirect
    setTimeout(() => {
        router.push('/'); // Redirect to home page
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
             <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Fill in the details below to join MediCore.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} // Basic validation
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/login">
                Sign In
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

    