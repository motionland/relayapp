"use client"

import React, { useEffect } from "react"
import { useAppDispatch } from "@/redux"
import { fetchBusinessStatus } from "@/redux/feature/business"

export default function AppInitializer({ children }: {children: React.ReactNode}) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchBusinessStatus())
  }, [dispatch])

  return children
}
