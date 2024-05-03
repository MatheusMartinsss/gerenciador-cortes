
import { TreeTable } from '@/components/tree/treeTable';
import { HeaderMenu } from './components/headerMenu';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <HeaderMenu />
      <TreeTable />
    </main>
  );
}
