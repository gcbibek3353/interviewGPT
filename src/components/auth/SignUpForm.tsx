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
        <div className="max-w-md mx-auto p-6 rounded-lg bg-gray-900 border border-gray-800 shadow-lg">
            <div className="flex justify-center mb-6">
                {/* Replace with your logo/image */}
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-white mb-2">Register Now</h1>
            <h3 className="text-sm text-center text-gray-400 mb-8">Start practicing for job interviews with AI</h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        label="Name"
                        placeholder="John Doe"
                        type="text"
                    />

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
                        Register
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-blue-500 hover:text-blue-400 hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    )
}

export default SignUpForm