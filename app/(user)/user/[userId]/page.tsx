import { getUserById, getUserEval } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import UserProfile from '@/components/user-profile';

export default async function Page(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { userId } = params;
  const user = await getUserById(userId);
  console.log(user[0].avatar);
  if (!user) {
    notFound();
  }
  const userEval = (await getUserEval(userId))![0].evaluation;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <UserProfile avatar={user[0].avatar as string} email={user[0].email} evaluation={userEval} />
    </div>
  );
}