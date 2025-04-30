"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
const Schema = z.object({
    email: z.string().email(),
    password: z.string()
});

type FormData = z.infer<typeof Schema>;

const Auth = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const { login } = useAuth()
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, } = useForm<FormData>({
        resolver: zodResolver(Schema),
        mode: 'onBlur'
    })

    const onSubmit = async (value: FormData) => {
        setLoginError(null);
        try {
            const token = await authService(value.email, value.password)
            login(token)
            router.push('/');
        } catch (ex) {
            console.error(ex)
        }

    }
    return (
        <div className="flex items-center justify-center h-screen w-full bg-slate-200 ">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-[400px] h-[350px] p-8 rounded-2xl shadow-2xl bg-white opacity-80 space-y-6 items-center justify-center flex flex-col">
                    <div>
                        <a>GFLONA - GESTÃO FLORESTAL</a>
                    </div>
                    {loginError && (
                        <div className="bg-red-600 rounded-lg p-2">
                            <p className="text-white">{loginError}</p>
                        </div>
                    )}
                    < div className="w-full">
                        <Input className="border-black  h-12" {...register('email')} placeholder="Email..."></Input>
                    </div>
                    <div className="w-full">
                        <Input className="border-black  h-12" {...register('password')} placeholder="Senha" type="password"></Input>
                    </div>
                    <div className="w-full">
                        <Button type="submit" variant='default' className="w-full bg-green-950">Acessar</Button>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default Auth