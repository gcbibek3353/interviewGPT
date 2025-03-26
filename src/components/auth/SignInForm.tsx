'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import FormField from '../FormField'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { signIn } from '@/lib/actions/auth.action'

const SignInFormSchema = () => {
  return z.object({
    email: z.string().email(),
    password: z.string().min(6).max(50)
  })
}

const SignInForm = () => {
  const router = useRouter();
  const formSchema = SignInFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { email, password } = data;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      if (!idToken) {
        toast.error('sign in failed')
        return;
      }

      await signIn({
        email, idToken
      })

      toast.success("Logged In successfully.");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
      <div className="flex justify-center mb-6">
        {/* Replace with your logo/image */}
        <div className="flex justify-center mb-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-blue-500"
          >
            {/* Speech bubble shape */}
            <path
              d="M32 12C19.8497 12 10 21.8497 10 34C10 46.1503 19.8497 56 32 56C38.0207 56 43.4829 53.5346 47.5 49.5L54 52L51.5 45.5C54.5346 41.4829 57 36.0207 57 30C57 17.8497 47.1503 8 35 8H32Z"
              fill="currentColor"
              opacity="0.2"
            />

            {/* Circuit/neural network pattern */}
            <path
              d="M24 24H28V28H24V24Z"
              fill="currentColor"
            />
            <path
              d="M36 24H40V28H36V24Z"
              fill="currentColor"
            />
            <path
              d="M30 30H34V34H30V30Z"
              fill="currentColor"
            />
            <path
              d="M24 36H28V40H24V36Z"
              fill="currentColor"
            />
            <path
              d="M36 36H40V40H36V36Z"
              fill="currentColor"
            />

            {/* Connecting lines */}
            <path
              d="M28 24L30 26L28 28"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M34 24L32 26L34 28"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M28 36L30 34L32 36L34 34L36 36"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M30 30L30 34"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M34 30L34 34"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M28 28L26 30L28 32"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M36 28L38 30L36 32"
              stroke="currentColor"
              strokeWidth="2"
            />

            {/* Dot at the bottom of speech bubble */}
            <circle
              cx="32"
              cy="50"
              r="2"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center text-white mb-2">Sign In</h1>
      <h3 className="text-sm text-center text-gray-400 mb-8">Start practicing for job interviews with AI</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            label="email"
            placeholder="john@gmail.com"
            type="email"
          />

          <FormField
            control={form.control}
            name="password"
            label="password"
            placeholder="********"
            type="password"
          />


          <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            Sign In
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account?{' '}
        <Link href="/sign-up" className="text-blue-500 hover:text-blue-400 hover:underline">
          Register now
        </Link>
      </p>
    </div>
  )
}

export default SignInForm