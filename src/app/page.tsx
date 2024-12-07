import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <div>
      <h1>Home</h1>
      {session ? (
        <div>
          <p>
            Logged:
            {user?.email}
            {user?.name}
          </p>
          <form
            action={async () => {
              'use server';
              await auth.api.signOut({ headers: await headers() });
              redirect('/');
            }}
          >
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      ) : (
        <div>
          <a href="/sign-in">Sign in</a>
          <p>Not logged</p>
        </div>
      )}
    </div>
  );
}
