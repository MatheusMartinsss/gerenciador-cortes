"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreeTable } from '@/components/TreeTable';
import { SectionsTable } from '@/components/SectionsTable';
import { SpecieTable } from '@/components/SpeciesTable';

export default function Home() {
  return (
    <main className="flex min-h-screen max-h-screen  flex-col  p-8">
      <Tabs defaultValue='trees' className='w-full'>
        <TabsList className="grid w-[600px] grid-cols-3">
          <TabsTrigger value='trees'>Arvores</TabsTrigger>
          <TabsTrigger value='cuts'>Abates</TabsTrigger>
          <TabsTrigger value='species'>Especies</TabsTrigger>
        </TabsList>
        <TabsContent value='trees' className='w-full'>
          <TreeTable />
        </TabsContent>
        <TabsContent value='cuts' className='w-full'>
          <SectionsTable />
        </TabsContent>
        <TabsContent value='species' className='w-full'>
          <SpecieTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}
