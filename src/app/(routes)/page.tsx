
import { TreeTable } from '@/components/tree/treeTable';
import { HeaderMenu } from './components/headerMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionsTable } from '@/components/section/sectionsTable';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col   p-24">
      <Tabs defaultValue='trees' className='w-full'>
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value='trees'>Arvores</TabsTrigger>
          <TabsTrigger value='cuts'>Abates</TabsTrigger>
        </TabsList>
        <TabsContent value='trees' className='w-full'>
          <HeaderMenu />
          <TreeTable />
        </TabsContent>
        <TabsContent value='cuts' className='w-full'>
          <SectionsTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}
