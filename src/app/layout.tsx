export const metadata = {
  title: '転職お助けさん',
  description: '転職お助けさん',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
