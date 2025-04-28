"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

export const NavBar = () => {
    const { logout } = useAuth()
    return (
        <nav className='w-full justify-between flex bg-green-900 rounded  items-center pt-1 pb-1 pr-1 pl-1'>
            <div>
                <Link href={'/'} className="hover:bg-opacity-30 hover:rounded-2xl text-white hover:text-white">
                    <Button variant='ghost' className="hover:bg-opacity-80  text-white hover:text-black">Inicio</Button>
                </Link>
                <Link href={'/batchs'} >
                    <Button variant='ghost' className="hover:bg-opacity-100  text-white hover:text-black">Cortes</Button>
                </Link>
                <Link href={'/sections'} >
                    <Button variant='ghost' className="hover:bg-opacity-100  text-white hover:text-black">Secções</Button>
                </Link>
            </div>
            <div className="flex">
                <Button variant='ghost' className="hover:bg-opacity-100  text-white hover:text-black" onClick={logout}>Sair</Button>
                <Link href={`/settings`}>
                    <Button size='icon' variant='ghost' className="hover:bg-black  hover:bg-opacity-30 hover:rounded-2xl text-white hover:text-white">
                        <Settings className="h-6 w-6" />
                    </Button>
                </Link>
            </div>
        </nav>
    )
}