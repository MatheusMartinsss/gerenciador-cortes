"use client"
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';

export const HeaderMenu = () => {
    const { setForm } = useModal()
    return (
        <div className='flex w-full flex-row space-x-2 '>
            <Button
                variant='outline'
                onClick={() => {
                    setForm('treeForm')

                }}>+ Arvore</Button>
            <Button
                variant='outline'
                onClick={() => {
                    setForm('treesForm')

                }}
            >
                Importar
            </Button>
        </div>
    )
}