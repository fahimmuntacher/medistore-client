// "use client"

// import { useEffect } from "react"
// import { useAuth } from "@/hooks/useAuth"
// import { useCartStore } from "../store/cart.store"

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const { isLoggedIn, loading } = useAuth()
//   const hydrate = useCartStore(s => s.hydrate)
//   const merge = useCartStore(s => s.mergeGuestToDB)

//   useEffect(() => {
//     if (loading) return

//     hydrate(isLoggedIn)

//     if (isLoggedIn) {
//       merge()
//     }
//   }, [isLoggedIn, loading])

//   return <>{children}</>
// }
