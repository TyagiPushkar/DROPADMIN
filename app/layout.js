
import "./globals.css"
import ClientLayout from "@/components/client-layout"

export const metadata = {
  title: "Drop Admin Dashboard",
  description: "Admin dashboard for Drop food delivery platform",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
