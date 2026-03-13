import ProductDetails from '@/app/Componets/ProductDetails'
import React from 'react'

// Next.js 15+: params is a Promise and must be awaited
export default async function ProductDetailsPage({ params }) {
  const { id } = await params
  return (
    <ProductDetails id={id} />
  )
}
