import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col ml-12 mt-12">
      <Link href='/employee'>Staff Management</Link>
      <Link href='/login'>Login</Link>
      <Link href='/forgot'>Forgot</Link>
    </div>
  );
}
