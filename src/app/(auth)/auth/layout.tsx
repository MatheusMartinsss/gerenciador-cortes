
import { RedirectIfAuth } from '@/components/Layout/RedirectIfAuth'
import '../../(routes)/globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RedirectIfAuth>
      <div>{children}</div>
    </RedirectIfAuth>

  )
}
