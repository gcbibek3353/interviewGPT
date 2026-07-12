"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signUp, signInWithOAuth } from "@/lib/actions/auth.action"

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

    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsGoogleLoading(true);
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            const idToken = await user.getIdToken();

            if (!idToken) {
                toast.error("Google sign up failed");
                return;
            }

            const result = await signInWithOAuth({
                uid: user.uid,
                name: user.displayName ?? "",
                email: user.email ?? "",
                idToken,
            });

            if (!result?.success) {
                toast.error(result?.message ?? "Google sign up failed");
                return;
            }

            toast.success("Signed in successfully.");
            window.location.assign("/dashboard");
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#08070d]">
            <div className="w-full max-w-5xl relative">
                {/* Background decorative elements */}
                <div className="absolute -left-4 top-1/3 w-24 h-40 bg-[#7c6dff]/20 rounded-full blur-2xl"></div>
                <div className="absolute -right-4 bottom-1/3 w-24 h-40 bg-[#7c6dff]/20 rounded-full blur-2xl"></div>

                <div className="relative bg-white/[0.02] rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                    {/* Lavender accent on top */}
                    <div className="h-2 bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] w-full"></div>

                    <div className="flex flex-col md:flex-row">
                        {/* Left section - Illustration and benefits */}
                        <div className="hidden lg:block lg:w-1/2 bg-white/[0.02] border-r border-white/10 p-12">
                            <div className="mb-8 flex items-center">
                                <div className="bg-gradient-to-br from-[#cac5fe] to-[#7c6dff] w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-[#08070d]">
                                    <Mic className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-xl font-semibold tracking-tight text-[#ece9ff] font-[family-name:var(--font-display)]">InterviewGPT</h2>
                            </div>

                            <h3 className="text-2xl font-semibold tracking-tight text-[#ece9ff] mb-6 font-[family-name:var(--font-display)]">Elevate your interview skills</h3>

                            {/* Illustration */}
                            <div className="mb-8">
                                <div className="relative h-64 w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 overflow-hidden">
                                    {/* Decorative gradient */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#7c6dff]/20 rounded-full blur-xl"></div>

                                    {/* Chat interface illustration */}
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div className="flex items-start mb-4">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#cac5fe] to-[#7c6dff] flex items-center justify-center mr-3 shrink-0 text-[#08070d]">
                                                <Mic className="w-4 h-4" strokeWidth={2.5} />
                                            </div>
                                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-none p-3 max-w-xs">
                                                <p className="text-sm text-[#c9c6de]">Tell me about a challenging project you worked on and how you handled it.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start mb-4">
                                            <div className="bg-[#cac5fe]/10 rounded-2xl rounded-tr-none p-3 max-w-xs mr-3">
                                                <p className="text-sm text-[#ece9ff]">I led a team to redesign our product's UI, facing tight deadlines and changing requirements...</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                <User className="text-[#ece9ff] w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#cac5fe] to-[#7c6dff] flex items-center justify-center mr-3 shrink-0 text-[#08070d]">
                                                <Mic className="w-4 h-4" strokeWidth={2.5} />
                                            </div>
                                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-none p-3 max-w-xs">
                                                <p className="text-sm text-[#c9c6de]">Great start! Can you describe the specific challenges and your solution in more detail?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits list */}
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="mt-1 bg-[#49de50]/10 rounded-full p-1 mr-3">
                                        <Check className="text-[#49de50] w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-[#ece9ff] font-medium">Real-time feedback</h4>
                                        <p className="text-[#a9a6c4] text-sm">Get instantaneous analysis of your responses</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="mt-1 bg-[#49de50]/10 rounded-full p-1 mr-3">
                                        <Check className="text-[#49de50] w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-[#ece9ff] font-medium">Industry-specific questions</h4>
                                        <p className="text-[#a9a6c4] text-sm">Practice with questions tailored to your field</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="mt-1 bg-[#49de50]/10 rounded-full p-1 mr-3">
                                        <Check className="text-[#49de50] w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-[#ece9ff] font-medium">Comprehensive assessment</h4>
                                        <p className="text-[#a9a6c4] text-sm">Detailed feedback on strengths and areas to improve</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right section - Sign up form */}
                        <div className="p-8 md:p-12 w-full lg:w-1/2">
                            <div className="lg:hidden mb-8 flex items-center justify-center">
                                <div className="bg-gradient-to-br from-[#cac5fe] to-[#7c6dff] w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-[#08070d]">
                                    <Mic className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-xl font-semibold tracking-tight text-[#ece9ff] font-[family-name:var(--font-display)]">InterviewGPT</h2>
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#ece9ff] mb-1 font-[family-name:var(--font-display)]">Create your account</h1>
                            <p className="text-[#a9a6c4] text-sm mb-8">Join thousands improving their interview skills</p>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#c9c6de]">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-[#5a5872]" />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        placeholder="John Doe"
                                                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#ece9ff] placeholder-[#5a5872] focus:outline-none focus:ring-2 focus:ring-[#cac5fe]/20 focus:border-[#cac5fe]/50"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#c9c6de]">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-[#5a5872]" />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-white/5 text-[#ece9ff] placeholder-[#5a5872] focus:outline-none focus:ring-2 focus:ring-[#cac5fe]/20 focus:border-[#cac5fe]/50"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#c9c6de]">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-[#5a5872]" />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        className="block w-full pl-10 pr-10 py-2 border border-white/10 rounded-lg bg-white/5 text-[#ece9ff] placeholder-[#5a5872] focus:outline-none focus:ring-2 focus:ring-[#cac5fe]/20 focus:border-[#cac5fe]/50"
                                                    />
                                                )}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-[#5a5872] hover:text-[#c9c6de]" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-[#5a5872] hover:text-[#c9c6de]" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-[#7d7a99]">Must be at least 6 characters</p>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                name="terms"
                                                type="checkbox"
                                                className="focus:ring-[#cac5fe]/20 h-4 w-4 text-[#cac5fe] border-white/10 rounded bg-white/5"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="text-[#a9a6c4]">
                                                I agree to the <Link href="/terms" className="text-[#cac5fe] hover:brightness-110">Terms of Service</Link> and <Link href="/privacy" className="text-[#cac5fe] hover:brightness-110">Privacy Policy</Link>
                                            </label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full py-3 px-4 bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] text-[#08070d] font-semibold rounded-full flex items-center justify-center gap-2 shadow-[0_8px_30px_-8px_rgba(124,109,255,0.7)] transition hover:brightness-110"
                                    >
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-[#08070d] text-[#a9a6c4]">Or sign up with</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={handleGoogleSignUp}
                                        disabled={isGoogleLoading}
                                        className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-full text-[#ece9ff] font-medium hover:border-white/20 hover:bg-white/10 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

                            <p className="text-center text-sm text-[#a9a6c4] mt-6">
                                Already have an account?{' '}
                                <Link href="/sign-in" className="text-[#cac5fe] hover:brightness-110 hover:underline font-medium">
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