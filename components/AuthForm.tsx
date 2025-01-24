/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'




const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false);


    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ''
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)

        try {
            //SIGN Upwith APPWRItE & CREATE A PLAID LINK TOKEN

            if (type === 'sign-up') {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password
                }
                const newUser = await signUp(userData);

                setUser(newUser);
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                })

                if (response) router.push('/')
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className='auth-form'>{type}
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link href="/" className='cursor-pointer flex items-center gap-1'>
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt='IDFC'

                    />
                    <h1 className='text-26font-ibm-plex-serif font-bold text-black-1'>IDFC</h1>
                </Link>
                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-36 font-bold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                        <p className='text-16 font-normal text-gray-600'>
                            {user
                                ? 'Link your Account to get Started'
                                : 'Please enter your details.'
                            }
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className='flex flex-col gap-4'>
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {type === 'sign-up' && (
                                <>
                                    <div className='flex gap-4'>
                                        <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter Your First Name" />
                                        <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter Your Last Name" />
                                    </div>

                                    <CustomInput control={form.control} name="address1" label="Address" placeholder="Enter Your Specific Address" />
                                    <CustomInput control={form.control} name="city" label="City" placeholder="Enter Your City" />

                                    <div className='flex gap-4'>
                                        <CustomInput control={form.control} name="state" label="State" placeholder="Ex : Bihar" />
                                        <CustomInput control={form.control} name="postalCode" label="Pin Code" placeholder="Ex : 11100110" />
                                    </div>

                                    <div className='flex gap-4'>
                                        <CustomInput control={form.control} name="dateOfBirth" label="Date Of Birth" placeholder="Ex : DD/MM/YYYY" />
                                        <CustomInput control={form.control} name="ssn" label="SSN" placeholder="Ex : 1234" />
                                    </div>
                                </>
                            )}

                            <CustomInput control={form.control} name="email" label="Email" placeholder="Enter Your email" />
                            <CustomInput control={form.control} name="password" label="Password" placeholder="Enter Your password" />

                            <div className='flex flex-col gap-4'>
                                <Button type="submit" disabled={isLoading} className='form-btn'>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin' /> &nbsp;
                                            Loading...
                                        </>
                                    ) : type === 'sign-in'
                                        ? 'Sign In'
                                        : 'Sign Up'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className="flex justify-center gap-1">
                        <p className='text-14 font-norml text-gray-600'>
                            {type === 'sign-in'
                                ? "Don't have an Account?"
                                : "Already an User?"}
                        </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>

                            {type === 'sign-in' ? 'Sign up' : 'Sign in'}

                        </Link>
                    </footer>
                </>
             )} 
        </section>
    )
}

export default AuthForm