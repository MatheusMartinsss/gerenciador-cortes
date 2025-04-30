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
        <div className="sticky top-0 z-30 bg-white shadow-sm px-6 py-3">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-700">GFLONA</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Olá, Matheus</span>

                </div>
            </div>
        </div>
    )
}
