"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import FormField from "../FormField"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signUp } from "@/lib/actions/auth.action"

import { Mic, User, Lock, Mail, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react"

const SignUpFormSchema = () => {
    return z.object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(6).max(50)
    })
}

const SignUpForm = () => {
    const router = useRouter();
    const formSchema = SignUpFormSchema();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const { name, email, password } = data;
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const result = await signUp({
                uid: userCredentials.user.uid,
                name: name!,
                email: email,
                password
            })
            if (!result?.success) {
                toast.error(result?.message);
                return;
            }
            toast.success("Account created successfully. Please sign in.");
            router.push("/sign-in");
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-5xl relative">
                {/* Background decorative elements */}
                <div className="absolute -left-4 top-1/3 w-24 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
                <div className="absolute -right-4 bottom-1/3 w-24 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>

                <div className="relative bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                    {/* Color accent on top */}
                    <div className="h-2 bg-purple-600 w-full"></div>

                    <div className="flex flex-col md:flex-row">
                        {/* Left section - Illustration and benefits */}
                        <div className="hidden lg:block lg:w-1/2 bg-gray-900 p-12">
                            <div className="mb-8 flex items-center">
                                <div className="bg-purple-600/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                    <Mic className="text-purple-500 w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">InterviewGPT</h2>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-6">Elevate your interview skills</h3>

                            {/* Illustration */}
                            <div className="mb-8">
                                <div className="relative h-64 w-full bg-gray-800 rounded-lg p-4 overflow-hidden">
                                    {/* Decorative gradient */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/30 rounded-full blur-xl"></div>

                                    {/* Chat interface illustration */}
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div className="flex items-start mb-4">
                                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-3 shrink-0">
                                                <Mic className="text-white w-4 h-4" />
                                            </div>
                                            <div className="bg-gray-700 rounded-lg rounded-tl-none p-3 max-w-xs">
                                                <p className="text-sm text-white">Tell me about a challenging project you worked on and how you handled it.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start mb-4">
                                            <div className="bg-gray-900 rounded-lg rounded-tr-none p-3 max-w-xs mr-3">
                                                <p className="text-sm text-gray-300">I led a team to redesign our product's UI, facing tight deadlines and changing requirements...</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
                                                <User className="text-white w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-3 shrink-0">
                                                <Mic className="text-white w-4 h-4" />
                                            </div>
                                            <div className="bg-gray-700 rounded-lg rounded-tl-none p-3 max-w-xs">
                                                <p className="text-sm text-white">Great start! Can you describe the specific challenges and your solution in more detail?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits list */}
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="mt-1 bg-purple-600/20 rounded-full p-1 mr-3">
                                        <Check className="text-purple-500 w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Real-time feedback</h4>
                                        <p className="text-gray-400 text-sm">Get instantaneous analysis of your responses</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="mt-1 bg-purple-600/20 rounded-full p-1 mr-3">
                                        <Check className="text-purple-500 w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Industry-specific questions</h4>
                                        <p className="text-gray-400 text-sm">Practice with questions tailored to your field</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="mt-1 bg-purple-600/20 rounded-full p-1 mr-3">
                                        <Check className="text-purple-500 w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Comprehensive assessment</h4>
                                        <p className="text-gray-400 text-sm">Detailed feedback on strengths and areas to improve</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right section - Sign up form */}
                        <div className="p-8 md:p-12 w-full lg:w-1/2">
                            <div className="lg:hidden mb-8 flex items-center justify-center">
                                <div className="bg-purple-600/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                    <Mic className="text-purple-500 w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">InterviewGPT</h2>
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
                            <p className="text-gray-400 text-sm mb-8">Join thousands improving their interview skills</p>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="John Doe"
                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                                        <label className="text-sm font-medium text-gray-300">Password</label>
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
                                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                name="terms"
                                                type="checkbox"
                                                className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-700 rounded bg-gray-900"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="text-gray-400">
                                                I agree to the <Link href="/terms" className="text-purple-500 hover:text-purple-400">Terms of Service</Link> and <Link href="/privacy" className="text-purple-500 hover:text-purple-400">Privacy Policy</Link>
                                            </label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                                    >
                                        Create Account
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
                                        <span className="px-2 bg-gray-800 text-gray-400">Or sign up with</span>
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
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                        Twitter
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-sm text-gray-400 mt-6">
                                Already have an account?{' '}
                                <Link href="/sign-in" className="text-purple-500 hover:text-purple-400 hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm