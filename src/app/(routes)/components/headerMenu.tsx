"use client"
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';

export const HeaderMenu = () => {
    const { setForm } = useModal()
    return (
        <div className='flex w-full flex-row '>
            <Button onClick={() => {
                setForm('treeForm')

            }}>+ Arvore</Button>
        </div>
    )
}