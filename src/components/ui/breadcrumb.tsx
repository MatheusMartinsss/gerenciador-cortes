"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

const breadcrumbLabels: Record<string, string> = {
    "tree": "Árvores",
    "sections": "Secções",
    "batchs": "Cortes",
    "companies": "Empresas",
    "company": "Cadastrar Empresa",
    "settings": "Configurações",
    "admin": "Admin",
    "manejo": "Manejo",
    "dashboard": "Dashboard",
}

const Breadcrumb = () => {
    const pathname = usePathname()

    const segments = pathname.split("/").filter(Boolean)
    const pathMap = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        return { name: decodeURIComponent(segment), href }
    })

    return (
        <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-1">
            <Link href="/" className="hover:underline">Início</Link>
            {pathMap.map((segment, idx) => (
                <span key={idx} className="flex items-center space-x-1">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link
                        href={segment.href}
                        className={`hover:underline capitalize ${idx === pathMap.length - 1 ? 'text-gray-800 font-medium' : ''}`}
                    >
                        {breadcrumbLabels[segment.name] || segment.name.replace(/-/g, " ")}
                    </Link>
                </span>
            ))}
        </nav>
    )
}

export default Breadcrumb