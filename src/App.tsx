import { Routes, Route } from "react-router"
import { Layout } from "@/components/Layout"
import { Home } from "@/pages/Home"
import { CategoryPage } from "@/pages/CategoryPage"
import { Contribute } from "@/pages/Contribute"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="contribute" element={<Contribute />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
