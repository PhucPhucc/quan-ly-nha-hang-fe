import FieldPassword from "@/components/shared/FieldPassword";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <form
      action=''
      method='post'
      className=' border border-primary bg-card rounded-2xl px-5 py-6 shadow-2xl'
    >
      <p className='font-semibold text-3xl mb-6 text-center'>Welcome Back</p>

      <FieldGroup>
        <Field className='gap-1'>
          <FieldLabel className='text-md' htmlFor='username'>
            Username
          </FieldLabel>
          <Input
            className='border-primary outline-none ring-0'
            type='text'
            id='username'
            name="username"
            placeholder='Enter Username'
            required
          />
        </Field>

        <FieldPassword name='password' label='Password' />
      </FieldGroup>

      <div className='text-sm flex mt-2 mb-4 justify-between '>
        <FieldGroup>
          <Field orientation='horizontal'>
            <Checkbox name='remember' id='remember' />
            <FieldLabel htmlFor='remember'>Remember me</FieldLabel>
          </Field>
        </FieldGroup>
        <Link
          className='flex-1 text-nowrap decoration-1 underline hover:text-primary-hover'
          href={"/forgot"}
        >
          Forgot Your Password?
        </Link>
      </div>

      {/* { <div className="flex items-center gap-2 p-2 mb-2 bg-danger/10 rounded-lg text-danger">
        <Info className="size-4" />
        <span>Invalid Password and Username</span>
      </div>} */}

      <Button
        size='lg'
        className='w-full cursor-pointer hover:bg-primary-hover'
      >
        Login
      </Button>
    </form>
  );
};

export default page;
