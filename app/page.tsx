"use client"

import { useState } from "react"
import {
  Package,
  Search,
  Plus,
  Pencil,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  ShoppingCart,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Zap,
  Calendar,
  X,
  Flame,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"

interface Product {
  id: number
  name: string
  sku: string
  quantity: number
  category: string
  price: number
  salesLastMonth: number
  salesTrend: number
  predictedSales: number
  lastRestocked: string
}

const initialProducts: Product[] = [
  { id: 1, name: "MacBook Pro 14\"", sku: "TECH-001", quantity: 45, category: "Eletrônicos", price: 12999, salesLastMonth: 28, salesTrend: 15, predictedSales: 32, lastRestocked: "2026-04-15" },
  { id: 2, name: "iPhone 16 Pro", sku: "TECH-002", quantity: 120, category: "Eletrônicos", price: 8999, salesLastMonth: 85, salesTrend: 22, predictedSales: 104, lastRestocked: "2026-04-28" },
  { id: 3, name: "AirPods Pro 3", sku: "TECH-003", quantity: 8, category: "Acessórios", price: 1899, salesLastMonth: 62, salesTrend: -5, predictedSales: 59, lastRestocked: "2026-03-20" },
  { id: 4, name: "iPad Air M3", sku: "TECH-004", quantity: 67, category: "Eletrônicos", price: 6499, salesLastMonth: 34, salesTrend: 8, predictedSales: 37, lastRestocked: "2026-04-10" },
  { id: 5, name: "Apple Watch Ultra 3", sku: "TECH-005", quantity: 23, category: "Wearables", price: 5999, salesLastMonth: 19, salesTrend: 12, predictedSales: 21, lastRestocked: "2026-04-22" },
  { id: 6, name: "Magic Keyboard", sku: "ACC-001", quantity: 3, category: "Acessórios", price: 1299, salesLastMonth: 41, salesTrend: -12, predictedSales: 36, lastRestocked: "2026-02-15" },
  { id: 7, name: "Studio Display", sku: "TECH-006", quantity: 12, category: "Monitores", price: 11999, salesLastMonth: 8, salesTrend: 25, predictedSales: 10, lastRestocked: "2026-04-05" },
  { id: 8, name: "Mac Mini M4", sku: "TECH-007", quantity: 89, category: "Eletrônicos", price: 4999, salesLastMonth: 52, salesTrend: 18, predictedSales: 61, lastRestocked: "2026-05-01" },
]

const salesData = [
  { month: "Jan", vendas: 4200, previsao: 4000 },
  { month: "Fev", vendas: 3800, previsao: 4100 },
  { month: "Mar", vendas: 5100, previsao: 4800 },
  { month: "Abr", vendas: 4700, previsao: 5000 },
  { month: "Mai", vendas: 5400, previsao: 5200 },
  { month: "Jun", vendas: null, previsao: 5800 },
]

const categoryPerformance = [
  { category: "Eletrônicos", vendas: 199, meta: 220, fill: "#3b82f6" },
  { category: "Acessórios", vendas: 103, meta: 100, fill: "#10b981" },
  { category: "Wearables", vendas: 19, meta: 25, fill: "#8b5cf6" },
  { category: "Monitores", vendas: 8, meta: 12, fill: "#f59e0b" },
]

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: 0,
    category: "",
    price: 0,
  })

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalProducts = products.length
  const totalStock = products.reduce((acc, p) => acc + p.quantity, 0)
  const lowStockCount = products.filter((p) => p.quantity < 15).length
  const totalSalesLastMonth = products.reduce((acc, p) => acc + p.salesLastMonth, 0)
  const avgTrend = Math.round(products.reduce((acc, p) => acc + p.salesTrend, 0) / products.length)

  const topSellers = [...products].sort((a, b) => b.salesLastMonth - a.salesLastMonth).slice(0, 3)
  const highPotential = [...products].sort((a, b) => b.predictedSales - a.predictedSales).slice(0, 3)

  const getStockStatus = (quantity: number) => {
    if (quantity <= 5) return { label: "Crítico", variant: "destructive" as const, color: "text-red-500", bg: "bg-red-500/10" }
    if (quantity <= 15) return { label: "Baixo", variant: "secondary" as const, color: "text-amber-500", bg: "bg-amber-500/10" }
    return { label: "Normal", variant: "outline" as const, color: "text-emerald-500", bg: "bg-emerald-500/10" }
  }

  const handleAddProduct = () => {
    const product: Product = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...newProduct,
      salesLastMonth: 0,
      salesTrend: 0,
      predictedSales: Math.round(newProduct.quantity * 0.3),
      lastRestocked: new Date().toISOString().split("T")[0],
    }
    setProducts([...products, product])
    setNewProduct({ name: "", sku: "", quantity: 0, category: "", price: 0 })
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (!editingProduct) return
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
    setIsEditDialogOpen(false)
    setEditingProduct(null)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct({ ...product })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-violet-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
                  <Boxes className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">Inventário Pro</h1>
                <p className="text-sm text-slate-500">Análise inteligente de estoque</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">Online</span>
              </div>
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                className="gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Produto</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Package className="h-5 w-5" />
                </div>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <p className="text-3xl font-bold text-white">{totalProducts}</p>
              <p className="text-sm text-slate-500 mt-1">Produtos cadastrados</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5 hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <Boxes className="h-5 w-5" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8%
                </Badge>
              </div>
              <p className="text-3xl font-bold text-white">{totalStock.toLocaleString()}</p>
              <p className="text-sm text-slate-500 mt-1">Itens em estoque</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5 hover:border-violet-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <Badge className={`${avgTrend >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} hover:opacity-80`}>
                  {avgTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {avgTrend >= 0 ? '+' : ''}{avgTrend}%
                </Badge>
              </div>
              <p className="text-3xl font-bold text-white">{totalSalesLastMonth}</p>
              <p className="text-sm text-slate-500 mt-1">Vendas no mês</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5 hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                {lowStockCount > 0 && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
                    {lowStockCount}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white">{lowStockCount}</p>
              <p className="text-sm text-slate-500 mt-1">Alertas de estoque</p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Análise de Vendas</h3>
                <p className="text-sm text-slate-500">Comparativo real vs previsão com IA</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-slate-400">Vendas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-violet-400" />
                  <span className="text-slate-400">Previsão IA</span>
                </div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPrevisao" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)' 
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVendas)" />
                  <Area type="monotone" dataKey="previsao" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrevisao)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/50 p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-500/20 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/30">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Insights IA</h3>
                  <p className="text-sm text-slate-500">Previsões para Junho</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">Alta demanda</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">iPhone 16 Pro deve aumentar 22% nas vendas. Considere aumentar estoque.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">Risco de ruptura</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">Magic Keyboard com apenas 3 unidades. Taxa de venda alta detectada.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Meta atingível</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">Categoria Acessórios superou meta em 3%. Tendência positiva.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Sellers */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 ring-1 ring-orange-500/30">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Mais Vendidos</h3>
                <p className="text-sm text-slate-500">Produtos com maior saída no mês</p>
              </div>
            </div>
            <div className="space-y-3">
              {topSellers.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors group">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white text-sm ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'bg-gradient-to-br from-orange-600 to-orange-700'}`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.salesLastMonth} vendas</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="text-sm font-medium">+{product.salesTrend}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Potential */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 ring-1 ring-violet-500/30">
                <Eye className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Alto Potencial</h3>
                <p className="text-sm text-slate-500">Previsão IA para próximo mês</p>
              </div>
            </div>
            <div className="space-y-3">
              {highPotential.map((product) => {
                const growthPercent = Math.round(((product.predictedSales - product.salesLastMonth) / product.salesLastMonth) * 100)
                return (
                  <div key={product.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-white">{product.name}</p>
                      <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20">
                        {product.predictedSales} prev.
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Confiança da previsão</span>
                        <span className="font-medium text-slate-300">87%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Crescimento esperado:</span>
                      <span className={`font-medium ${growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {growthPercent >= 0 ? '+' : ''}{growthPercent}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30">
                <BarChart3 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Performance por Categoria</h3>
                <p className="text-sm text-slate-500">Vendas vs Meta mensal</p>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance} layout="vertical" barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={12} width={90} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)' 
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="vendas" radius={[0, 6, 6, 0]} name="Vendas">
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="meta" fill="#334155" radius={[0, 6, 6, 0]} name="Meta" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Inventário Completo</h3>
                <p className="text-sm text-slate-500">Gerencie todos os seus produtos</p>
              </div>
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  placeholder="Buscar por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-medium">Produto</TableHead>
                  <TableHead className="text-slate-400 font-medium">SKU</TableHead>
                  <TableHead className="text-slate-400 font-medium text-center">Quantidade</TableHead>
                  <TableHead className="text-slate-400 font-medium">Status</TableHead>
                  <TableHead className="text-slate-400 font-medium text-right">Vendas/Mês</TableHead>
                  <TableHead className="text-slate-400 font-medium text-right">Tendência</TableHead>
                  <TableHead className="text-slate-400 font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => {
                  const status = getStockStatus(product.quantity)
                  return (
                    <TableRow 
                      key={product.id} 
                      className={`border-white/5 ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'} hover:bg-white/5 transition-colors`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 ring-1 ring-white/10">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="px-2.5 py-1 rounded-lg bg-slate-800 text-sm font-mono text-slate-300 ring-1 ring-white/10">{product.sku}</code>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold text-lg ${status.color}`}>{product.quantity}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.bg} ${status.color} border-transparent`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-300">{product.salesLastMonth}</TableCell>
                      <TableCell className="text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${product.salesTrend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {product.salesTrend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          <span className="text-sm font-medium">{product.salesTrend >= 0 ? '+' : ''}{product.salesTrend}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditDialog(product)}
                          className="gap-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-2xl bg-slate-800/50 mb-4 ring-1 ring-white/10">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-lg font-medium text-white">Nenhum produto encontrado</p>
              <p className="text-sm text-slate-500 mt-1">Tente ajustar os termos da busca</p>
            </div>
          )}

          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Exibindo <span className="text-white font-medium">{filteredProducts.length}</span> de <span className="text-white font-medium">{products.length}</span> produtos
            </p>
            <p className="text-xs text-slate-600">Atualizado em tempo real</p>
          </div>
        </div>
      </main>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Adicionar Novo Produto</DialogTitle>
            <DialogDescription className="text-slate-400">Preencha as informações do produto para adicionar ao inventário.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-300">Nome do Produto</Label>
              <Input 
                id="name" 
                placeholder="Ex: MacBook Pro 16&quot;" 
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku" className="text-slate-300">SKU</Label>
                <Input 
                  id="sku" 
                  placeholder="Ex: TECH-009" 
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity" className="text-slate-300">Quantidade</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="0"
                  value={newProduct.quantity || ""}
                  onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                  className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-slate-300">Categoria</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Acessórios">Acessórios</SelectItem>
                    <SelectItem value="Wearables">Wearables</SelectItem>
                    <SelectItem value="Monitores">Monitores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-slate-300">Preço (R$)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="0.00"
                  value={newProduct.price || ""}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                  className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleAddProduct} disabled={!newProduct.name || !newProduct.sku} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0">
              Adicionar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Editar Produto</DialogTitle>
            <DialogDescription className="text-slate-400">Atualize as informações do produto selecionado.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-slate-300">Nome do Produto</Label>
                <Input 
                  id="edit-name" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="h-11 rounded-xl bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-sku" className="text-slate-300">SKU</Label>
                  <Input 
                    id="edit-sku" 
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-quantity" className="text-slate-300">Quantidade</Label>
                  <Input 
                    id="edit-quantity" 
                    type="number" 
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value) || 0})}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category" className="text-slate-300">Categoria</Label>
                  <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}>
                    <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                      <SelectItem value="Acessórios">Acessórios</SelectItem>
                      <SelectItem value="Wearables">Wearables</SelectItem>
                      <SelectItem value="Monitores">Monitores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price" className="text-slate-300">Preço (R$)</Label>
                  <Input 
                    id="edit-price" 
                    type="number" 
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Último reabastecimento</span>
                </div>
                <p className="text-sm text-slate-400">{new Date(editingProduct.lastRestocked).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleEditProduct} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
