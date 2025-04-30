"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, ChevronDown } from 'lucide-react';
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export const NavBar = () => {
    const { logout, user } = useAuth()
    const [showAdminMenu, setShowAdminMenu] = useState(false)

    return (
        <nav className="w-full flex justify-between items-center bg-green-900 p-2 rounded shadow-md">
            <div className="flex gap-2 items-center">
                <Link href={'/'}>
                    <Button variant="ghost" className="text-white hover:text-black">Início</Button>
                </Link>
                <Link href={'/batchs'}>
                    <Button variant="ghost" className="text-white hover:text-black">Cortes</Button>
                </Link>
                <Link href={'/sections'}>
                    <Button variant="ghost" className="text-white hover:text-black">Seções</Button>
                </Link>

                {user?.role === 'admin' && (
                    <div className="relative">
                        <Button
                            variant="ghost"
                            className="text-white hover:text-black flex items-center gap-1"
                            onClick={() => setShowAdminMenu(prev => !prev)}
                        >
                            Admin
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                        {showAdminMenu && (
                            <div className="absolute mt-2 bg-white rounded shadow-lg z-50 p-2 min-w-[150px]">
                                <Link href={'/companys'}>
                                    <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded">Empresas</p>
                                </Link>
                                <Link href={'/company'}>
                                    <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded">Cadastrar Empresa</p>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Link href={'/settings'}>
                    <Button size='icon' variant='ghost' className="text-white hover:text-white hover:bg-black/30 rounded-full">
                        <Settings className="h-6 w-6" />
                    </Button>
                </Link>
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="text-white hover:text-black"
                >
                    Sair
                </Button>
            </div>
        </nav>
    )
}
