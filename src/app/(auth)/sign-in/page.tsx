'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client';
import { signInSchema } from '@/schemas/AuthSchema';
import { redirect } from 'next/navigation';


export default function SignIn() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const { email, password } = values;

    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: 'http://localhost:3000/sign-in',
      },
      {
        onRequest: () => {
          toast({
            title: 'Criando conta...',
          });
        },
        onSuccess: () => {
          form.reset();
          redirect('/');
        },
        onError: (context) => {
          toast({
            title: 'Erro ao criar conta',
            description: context.error.message,
            variant: 'destructive',
          });
        },
      }
    );
  }

  return (
    <Card className="max-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Fazer login</CardTitle>
        <CardDescription>Insira seus dados para entrar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Entrar
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="mr-2 text-sm text-muted-foreground">Não tem uma conta?</p>
        <Link
          href="/sign-up"
          className="text-sm font-medium underline underline-offset-4"
        >
          Criar uma conta
        </Link>
      </CardFooter>
    </Card>
  );
}
