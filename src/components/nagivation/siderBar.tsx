"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Settings, Trees, Building2, LogOut, BarChart2, Menu, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

const menuOptions = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        icon: BarChart2,
        path: '/',
        roles: ['user', 'admin'],
        childrens: []
    },
    {
        name: 'manejo',
        label: 'Manejo',
        icon: Trees,
        roles: ['user'],
        childrens: [
            { name: 'autex-list', label: 'Listar Autex', path: '/autex', roles: ['user'] },
            { name: 'autex-create', label: 'Cadastrar Autex', path: '/autex/cadastrar', roles: ['user'] },
            { name: 'arvores', label: 'Árvores', path: '/arvores', roles: ['user'] },
            { name: 'batchs', label: 'Cortes', path: '/batchs', roles: ['user'] },
        ]
    },
    {
        name: 'empresas',
        label: 'Empresas',
        icon: Building2,
        roles: ['admin'],
        childrens: [
            { name: 'companys', label: 'Listar', path: '/companys', roles: ['admin'] },
            { name: 'company', label: 'Cadastrar', path: '/company', roles: ['admin'] },
        ]
    },
    {
        name: 'settings',
        label: 'Configurações',
        icon: Settings,
        path: '/settings',
        roles: ['user'],
        childrens: []
    }
]

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
    const pathname = usePathname()

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
    const { user, logout } = useAuth()


    const toggleMenu = (name: string) => {
        setOpenMenus(prev => {
            const newState: Record<string, boolean> = {}
            for (const key in prev) newState[key] = false
            newState[name] = !prev[name]
            return newState
        })
    }

    const linkClass = (path: string) =>
        `flex items-center gap-2 p-2 rounded hover:bg-green-800 ${pathname === path ? 'bg-green-800 font-semibold' : ''}`

    const subLinkClass = (path: string) =>
        `hover:bg-green-800 p-2 rounded text-sm ${pathname === path ? 'bg-green-800 font-semibold' : ''}`

    return (
        <aside className={`h-auto bg-green-900 text-white p-4 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'}`}>
            <nav className="flex flex-col gap-2">
                {menuOptions.map(menu => {
                    const Icon = menu.icon
                    const isOpen = openMenus[menu.name]
                    const userRole = user?.role || 'user'
                    const authorized = menu.roles.includes(userRole)
                    if (!authorized) return
                    if (menu.childrens.length > 0) {
                        return (
                            <div key={menu.name}>
                                <button
                                    onClick={() => toggleMenu(menu.name)}
                                    className="flex items-center w-full gap-2 hover:bg-green-800 p-2 rounded"
                                >
                                    {Icon && <Icon className="w-5 h-5" />}
                                    {!collapsed && (
                                        <>
                                            <span className="flex-1 text-left">{menu.label}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </>
                                    )}
                                </button>
                                {isOpen && !collapsed && (
                                    <div
                                        className={`ml-6 overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${isOpen && !collapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        {menu.childrens.map(child => (
                                            <Link key={child.name} href={child.path} className={subLinkClass(child.path)}>{child.label}</Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    }
                    return (
                        <Link key={menu.name} href={menu.path || '#'} className={linkClass(menu.path || '#')}>
                            {Icon && <Icon className="w-5 h-5" />}
                            {!collapsed && <span>{menu.label}</span>}
                        </Link>
                    )
                })}

                <button onClick={logout} className="flex items-center gap-2 hover:bg-green-800 p-2 rounded mt-auto">
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span>Sair</span>}
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar
