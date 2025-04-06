'use client'
import React, { useState } from 'react'
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

import { Mic, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

const SignInFormSchema = () => {
  return z.object({
    email: z.string().email(),
    password: z.string().min(6).max(50)
  })
}

const SignInForm = () => {
  const router = useRouter();
  const formSchema = SignInFormSchema();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      // console.log(idToken);

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md relative">
        {/* Left decorative element */}
        <div className="absolute -left-10 top-1/4 w-20 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
        {/* Right decorative element */}
        <div className="absolute -right-10 bottom-1/4 w-20 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>

        <div className="relative bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          {/* Purple accent top bar */}
          <div className="h-2 bg-purple-600 w-full"></div>

          {/* Split design with decorative element */}
          <div className="flex flex-col md:flex-row">
            {/* Left section with visual element */}
            <div className="bg-gray-900 p-8 flex items-center justify-center md:w-2/5">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                  <Mic className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold text-white">InterviewGPT</h2>
                <p className="text-gray-400 text-sm mt-2">Your personal interview coach</p>

                {/* Visual representation of voice waves */}
                <div className="flex justify-center items-center gap-1 mt-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-1 bg-purple-600/80 rounded-full animate-pulse"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: `${16 + i * 4}px`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right section with form */}
            <div className="p-8 md:w-3/5">
              <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
              <p className="text-gray-400 text-sm mb-6">Sign in to continue your interview practice</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <div className="relative ">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-300">Password</label>
                      {/* <Link href="" className="text-sm text-purple-500 hover:text-purple-400">
                        Forgot password?
                      </Link> */}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <div>
                            <span>{showPassword.toString()}</span>
                            <Eye className="h-5 w-5 text-gray-500" />
                          </div>
                        ) : (
                          <div>
                            <span>{showPassword.toString()}</span>
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"
                      />
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-purple-500 hover:text-purple-400 hover:underline font-medium">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm