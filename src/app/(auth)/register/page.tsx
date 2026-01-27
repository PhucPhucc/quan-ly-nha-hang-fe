import FieldPassword from '@/components/shared/FieldPassword'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

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
            placeholder='Enter Username'
            required
          />
        </Field>

        <Field >
           <FieldLabel className='text-md' htmlFor='fullName'>
            Full Name
          </FieldLabel>
          <Input
            className='border-primary outline-none ring-0'
            type='text'
            id='fullName'
            placeholder='Enter Full Name'
            required
          />
        </Field>

        <FieldPassword name='password' label='Password' />
      </FieldGroup>

      <div className='text-sm flex mt-2 mb-4 flex-row-reverse justify-between'>
        <Link
          className='decoration-1 underline hover:text-primary-hover'
          href={"/forgot"}
        >
          Forgot Password
        </Link>
        {/* <span className='flex items-center gap-1 text-danger'>
              <Info className='size-4' />
              Invalid username or password
            </span> */}
      </div>
      <Button
        size='lg'
        className='w-full cursor-pointer hover:bg-primary-hover'
      >
        Login
      </Button>
    </form>
  )
}

export default page