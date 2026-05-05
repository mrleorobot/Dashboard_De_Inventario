"use client"

import { useState } from "react"
import { Search, Package, Pencil, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Product {
  id: number
  name: string
  sku: string
  quantity: number
}

const initialProducts: Product[] = [
  { id: 1, name: "Notebook Dell Inspiron", sku: "NB-DELL-001", quantity: 45 },
  { id: 2, name: "Monitor LG 27\"", sku: "MON-LG-027", quantity: 23 },
  { id: 3, name: "Teclado Mecânico RGB", sku: "TEC-MEC-RGB", quantity: 78 },
  { id: 4, name: "Mouse Wireless Logitech", sku: "MOU-LOG-WL", quantity: 156 },
  { id: 5, name: "Headset Gamer HyperX", sku: "HS-HYP-001", quantity: 12 },
  { id: 6, name: "Webcam HD 1080p", sku: "WEB-HD-1080", quantity: 34 },
  { id: 7, name: "SSD 500GB Samsung", sku: "SSD-SAM-500", quantity: 89 },
  { id: 8, name: "Memória RAM 16GB DDR4", sku: "RAM-16G-D4", quantity: 5 },
]

function getQuantityStatus(quantity: number) {
  if (quantity <= 10) return { label: "Crítico", variant: "destructive" as const }
  if (quantity <= 30) return { label: "Baixo", variant: "secondary" as const }
  return { label: "Normal", variant: "outline" as const }
}

export default function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products] = useState<Product[]>(initialProducts)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (product: Product) => {
    console.log("[v0] Edit clicked for product:", product)
    alert(`Editando: ${product.name}`)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Dashboard de Inventário
              </h1>
              <p className="text-sm text-zinc-500">
                Gerencie seus produtos e estoque
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Total de Produtos</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-900">
              {products.length}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Itens em Estoque</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-900">
              {products.reduce((acc, p) => acc + p.quantity, 0)}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Estoque Crítico</p>
            <p className="mt-1 text-3xl font-semibold text-red-600">
              {products.filter((p) => p.quantity <= 10).length}
            </p>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Buscar por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                <TableHead className="font-semibold">Nome do Produto</TableHead>
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold">Quantidade</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-zinc-500"
                  >
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, index) => {
                  const status = getQuantityStatus(product.quantity)
                  return (
                    <TableRow
                      key={product.id}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-zinc-50"
                          : "bg-zinc-50/50 hover:bg-zinc-100/50"
                      }
                    >
                      <TableCell className="font-medium text-zinc-900">
                        {product.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-zinc-600">
                        {product.sku}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-zinc-900">
                          {product.quantity}
                        </span>
                        <span className="ml-1 text-zinc-500">un.</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Info */}
        <p className="mt-4 text-center text-sm text-zinc-500">
          Exibindo {filteredProducts.length} de {products.length} produtos
        </p>
      </main>
    </div>
  )
}
