import { useQuery } from "@tanstack/react-query"

export const useCepLookup = (cep: string, enabled = false) => {
    return useQuery({
        queryKey: ["cep", cep],
        queryFn: async () => {
            const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
            if (!res.ok) throw new Error("CEP inválido ou não encontrado")
            return res.json()
        },
        enabled, // só busca quando for true
        staleTime: 1000 * 60 * 5 // 5 min
    })
}