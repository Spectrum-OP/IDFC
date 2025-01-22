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




const AuthForm = ({ type }: { type: string }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setisLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof authFormSchema>>({
        resolver: zodResolver(authFormSchema),
        defaultValues: {
            email: "",
            password: ''
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof authFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setisLoading(true)
        console.log(values)
        setisLoading(false)
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
                    {/* PlaidLink */}
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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