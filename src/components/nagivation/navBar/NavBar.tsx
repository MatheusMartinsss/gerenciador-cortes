"use client"
import { Button } from "@/components/ui/button"
import { Settings,  Menu } from 'lucide-react';
import { useAuth } from "@/context/AuthContext"


interface NavBarProps {
    toggleSidebar: () => void
}

export const NavBar = ({ toggleSidebar }: NavBarProps) => {
    const { logout, user } = useAuth()
    return (
        <div className="sticky top-0 z-30 bg-green-800 shadow-sm px-4 py-3">
            <div className="flex items-center justify-between ">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        <Menu className="w-5 h-5 text-white" />
                    </Button>
                    <h1 className="text-lg font-semibold text-white">GFLONA</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-white">Olá, {user?.firstName}</span>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={logout}
                        className="hover:bg-white"
                    >
                        <Settings className="w-5 h-5 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
