import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/article'); // Redirect to the Dashboard page
  return null; // This line is never reached due to redirect
}