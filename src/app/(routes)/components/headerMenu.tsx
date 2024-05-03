"use client"
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';

export const HeaderMenu = () => {
    const { onOpen, setData } = useModal()
    return (
        <div className='flex w-full flex-row '>
            <Button onClick={() => {
                setData('treeForm')
                onOpen()
            }}>+ Arvore</Button>
        </div>
    )
}