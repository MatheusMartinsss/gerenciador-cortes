"use client"
import { TreeTable } from '@/components/tree/treeTable';
import { HeaderMenu } from './components/headerMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionsTable } from '@/components/section/sectionsTable';
import { SpecieTable } from '@/components/species/spcieTable';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  p-10">
      <Tabs defaultValue='cuts' className='w-full'>
        <TabsList className="grid w-[600px] grid-cols-3">
          <TabsTrigger value='cuts'>Abates</TabsTrigger>
          <TabsTrigger value='trees'>Arvores</TabsTrigger>
          <TabsTrigger value='species'>Especies</TabsTrigger>
        </TabsList>
        <TabsContent value='cuts' className='w-full'>
          <SectionsTable />
        </TabsContent>
        <TabsContent value='trees' className='w-full'>
          <HeaderMenu />
          <TreeTable />
        </TabsContent>
        <TabsContent value='species' className='w-full'>
          <SpecieTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}
