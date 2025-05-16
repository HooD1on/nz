'use client'

// 只导入纯Tailwind样式，避免样式冲突
import '../../styles/tailwind-base.css'

export default function TailwindPureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 