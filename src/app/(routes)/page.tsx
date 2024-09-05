"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreeTable } from '@/components/TreeTable';
import { SectionsTable } from '@/components/SectionsTable';
import { SpecieTable } from '@/components/SpeciesTable';

export default function Home() {
  return (
    <main className="flex  flex-col p-8  ">
      <Tabs defaultValue='trees' className='w-full'>
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
