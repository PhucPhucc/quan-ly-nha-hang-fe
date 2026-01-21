"use client";

import FieldPassword from "@/components/FieldPassword";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeOff, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="max-w-sm min-w-xs lg:w-sm">
        <div className='flex items-center justify-center gap-2 text-primary text-shadow-xl mb-2'>
          <UtensilsCrossed />
          <span className='font-serif font-bold text-4xl'>FoodHub</span>
        </div>
        <form
          action=''
          method='post'
          className=' border border-primary bg-card rounded-2xl px-5 py-6 shadow-2xl'
        > 
          <p className="font-semibold text-3xl mb-6 text-center">Welcome Back</p>

          <FieldGroup>
            <Field className='gap-1'>
              <FieldLabel className='text-md' htmlFor='username'>
                Username
              </FieldLabel>
              <Input className="border-primary outline-none ring-0" type='text' id='username' placeholder='Enter Username' />
            </Field>

            <FieldPassword />

            <Button size='lg' className="cursor-pointer">Login</Button>
          </FieldGroup>


        </form>
      </div>
    </div>
  );
};

export default page;
