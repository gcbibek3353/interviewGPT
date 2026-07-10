'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebase/client'
import { signIn, signInWithOAuth } from '@/lib/actions/auth.action'

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

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      if (!idToken) {
        toast.error("Google sign in failed");
        return;
      }

      const result = await signInWithOAuth({
        uid: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? "",
        idToken,
      });

      if (!result?.success) {
        toast.error(result?.message ?? "Google sign in failed");
        return;
      }

      toast.success("Logged In successfully.");
      router.push("/dashboard");
    } catch (error: any) {
      if (error?.code === "auth/popup-closed-by-user") return;
      console.log(error);
      toast.error(`There was an error: ${error}`);
    } finally {
      setIsGoogleLoading(false);
    }
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
                          <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
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

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full py-2 px-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isGoogleLoading ? "Signing in..." : "Continue with Google"}
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