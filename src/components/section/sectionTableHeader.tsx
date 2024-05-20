"use client"
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import { TreePine, Search } from 'lucide-react';
import { useParams } from '@/hooks/useSearchParams';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSection } from '@/hooks/useSection';

export const SectionTableHeader = () => {
    const { setForm } = useModal()
    const { params, handleSearchParam } = useSection()
    const [searchText, setSearchText] = useState<string>('')
    return (
        <div className='flex w-full flex-row space-x-2  '>
            <div className='flex'>
                <div className='flex w-max-sm items-center space-x-1'>
                    <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} ></Input>
                    <Button variant='outline' onClick={() => handleSearchParam(searchText)}> <Search className="mr-2 h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    )
}