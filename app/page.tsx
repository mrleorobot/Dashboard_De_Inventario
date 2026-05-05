"use client"

import { useState } from "react"
import { Search, Package, Pencil, Plus, ArrowUpRight, ArrowDownRight, Box, AlertTriangle } from "lucide-react"
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
  category: string
  trend: "up" | "down" | "stable"
}

const initialProducts: Product[] = [
  { id: 1, name: "Notebook Dell Inspiron", sku: "NB-DELL-001", quantity: 45, category: "Eletrônicos", trend: "up" },
  { id: 2, name: "Monitor LG 27\"", sku: "MON-LG-027", quantity: 23, category: "Eletrônicos", trend: "down" },
  { id: 3, name: "Teclado Mecânico RGB", sku: "TEC-MEC-RGB", quantity: 78, category: "Periféricos", trend: "up" },
  { id: 4, name: "Mouse Wireless Logitech", sku: "MOU-LOG-WL", quantity: 156, category: "Periféricos", trend: "stable" },
  { id: 5, name: "Headset Gamer HyperX", sku: "HS-HYP-001", quantity: 12, category: "Áudio", trend: "down" },
  { id: 6, name: "Webcam HD 1080p", sku: "WEB-HD-1080", quantity: 34, category: "Periféricos", trend: "up" },
  { id: 7, name: "SSD 500GB Samsung", sku: "SSD-SAM-500", quantity: 89, category: "Armazenamento", trend: "stable" },
  { id: 8, name: "Memória RAM 16GB DDR4", sku: "RAM-16G-D4", quantity: 5, category: "Componentes", trend: "down" },
]

function getQuantityStatus(quantity: number) {
  if (quantity <= 10) return { label: "Crítico", color: "bg-red-500/10 text-red-600 border-red-500/20" }
  if (quantity <= 30) return { label: "Baixo", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  return { label: "Normal", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
}

export default function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products] = useState<Product[]>(initialProducts)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStock = products.reduce((acc, p) => acc + p.quantity, 0)
  const criticalCount = products.filter((p) => p.quantity <= 10).length
  const lowCount = products.filter((p) => p.quantity > 10 && p.quantity <= 30).length

  const handleEdit = (product: Product) => {
    alert(`Editando: ${product.name}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-2xl" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Inventário
                </h1>
                <p className="text-sm text-slate-500">
                  Gestão inteligente de estoque
                </p>
              </div>
            </div>
            <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all hover:shadow-xl hover:shadow-slate-900/20">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Products */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/50 transition-all hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total de Produtos</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {products.length}
                </p>
                <p className="mt-1 text-xs text-slate-400">itens cadastrados</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Box className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Total Stock */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/50 transition-all hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Em Estoque</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {totalStock.toLocaleString("pt-BR")}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12% este mês</span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/50 transition-all hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Estoque Baixo</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-600">
                  {lowCount}
                </p>
                <p className="mt-1 text-xs text-slate-400">requer atenção</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Critical Stock */}
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/50 transition-all hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Crítico</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-red-600">
                  {criticalCount}
                </p>
                <p className="mt-1 text-xs text-red-500">ação imediata</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar produtos por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/50">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Produto
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  SKU
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Categoria
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Quantidade
                </TableHead>
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </TableHead>
                <TableHead className="py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300" />
                      <p>Nenhum produto encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, index) => {
                  const status = getQuantityStatus(product.quantity)
                  return (
                    <TableRow
                      key={product.id}
                      className={`border-slate-100 transition-colors ${
                        index % 2 === 0
                          ? "bg-white hover:bg-slate-50/50"
                          : "bg-slate-50/30 hover:bg-slate-50/70"
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500">
                            <Package className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                          {product.sku}
                        </code>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm text-slate-600">{product.category}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold tabular-nums text-slate-900">
                            {product.quantity}
                          </span>
                          {product.trend === "up" && (
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                          )}
                          {product.trend === "down" && (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="h-8 rounded-lg px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <p>
            Exibindo <span className="font-medium text-slate-700">{filteredProducts.length}</span> de{" "}
            <span className="font-medium text-slate-700">{products.length}</span> produtos
          </p>
          <p className="text-xs text-slate-400">Atualizado há 2 minutos</p>
        </div>
      </main>
    </div>
  )
}
