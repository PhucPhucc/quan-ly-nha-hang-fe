import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col ml-12 mt-12">
      <Link href='/staff'>Staff Management</Link>
      <Link href='/Login'>Login</Link>
      <Link href='/forgot'>Forgot</Link>
    </div>
  );
}
