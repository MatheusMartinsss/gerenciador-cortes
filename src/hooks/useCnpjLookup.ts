import { useQuery } from "@tanstack/react-query"

export const useCnpjLookup = (cnpj: string, enabled = false) => {
    return useQuery({
        queryKey: ["cnpj", cnpj],
        queryFn: async () => {
            const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
            if (!res.ok) throw new Error("CEP inválido ou não encontrado")
            return res.json()
        },
        enabled, // só busca quando for true
        staleTime: 1000 * 60 * 5 // 5 min
    })
}