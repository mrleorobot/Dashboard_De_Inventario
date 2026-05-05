"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Bell,
  Settings,
  Moon,
  Sun,
  Command,
  ChevronRight,
  Activity,
  PieChart,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  Filter,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
  Copy,
  ArrowUp,
  Minus,
  Info,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RechartsPie,
  Pie,
  RadialBarChart,
  RadialBar,
  Legend,
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
  image?: string
}

interface Notification {
  id: number
  title: string
  message: string
  type: "warning" | "success" | "info" | "error"
  time: string
  read: boolean
}

const initialProducts: Product[] = [
  { id: 1, name: "MacBook Pro 14\"", sku: "TECH-001", quantity: 45, category: "Eletrônicos", price: 12999, salesLastMonth: 28, salesTrend: 15, predictedSales: 32, lastRestocked: "2026-04-15", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" },
  { id: 2, name: "iPhone 16 Pro", sku: "TECH-002", quantity: 120, category: "Eletrônicos", price: 8999, salesLastMonth: 85, salesTrend: 22, predictedSales: 104, lastRestocked: "2026-04-28", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop" },
  { id: 3, name: "AirPods Pro 3", sku: "TECH-003", quantity: 8, category: "Acessórios", price: 1899, salesLastMonth: 62, salesTrend: -5, predictedSales: 59, lastRestocked: "2026-03-20", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=100&h=100&fit=crop" },
  { id: 4, name: "iPad Air M3", sku: "TECH-004", quantity: 67, category: "Eletrônicos", price: 6499, salesLastMonth: 34, salesTrend: 8, predictedSales: 37, lastRestocked: "2026-04-10", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop" },
  { id: 5, name: "Apple Watch Ultra 3", sku: "TECH-005", quantity: 23, category: "Wearables", price: 5999, salesLastMonth: 19, salesTrend: 12, predictedSales: 21, lastRestocked: "2026-04-22", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&h=100&fit=crop" },
  { id: 6, name: "Magic Keyboard", sku: "ACC-001", quantity: 3, category: "Acessórios", price: 1299, salesLastMonth: 41, salesTrend: -12, predictedSales: 36, lastRestocked: "2026-02-15", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop" },
  { id: 7, name: "Studio Display", sku: "TECH-006", quantity: 12, category: "Monitores", price: 11999, salesLastMonth: 8, salesTrend: 25, predictedSales: 10, lastRestocked: "2026-04-05", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop" },
  { id: 8, name: "Mac Mini M4", sku: "TECH-007", quantity: 89, category: "Eletrônicos", price: 4999, salesLastMonth: 52, salesTrend: 18, predictedSales: 61, lastRestocked: "2026-05-01", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=100&h=100&fit=crop" },
]

const initialNotifications: Notification[] = [
  { id: 1, title: "Estoque Crítico", message: "Magic Keyboard com apenas 3 unidades", type: "error", time: "2min", read: false },
  { id: 2, title: "Meta Atingida", message: "Categoria Acessórios superou meta mensal", type: "success", time: "1h", read: false },
  { id: 3, title: "Previsão IA", message: "iPhone 16 Pro terá alta demanda em Junho", type: "info", time: "3h", read: true },
  { id: 4, title: "Reposição Necessária", message: "AirPods Pro 3 precisa de reposição", type: "warning", time: "5h", read: true },
]

const salesData = [
  { month: "Jan", vendas: 4200, previsao: 4000, meta: 4500 },
  { month: "Fev", vendas: 3800, previsao: 4100, meta: 4500 },
  { month: "Mar", vendas: 5100, previsao: 4800, meta: 4500 },
  { month: "Abr", vendas: 4700, previsao: 5000, meta: 4500 },
  { month: "Mai", vendas: 5400, previsao: 5200, meta: 4500 },
  { month: "Jun", vendas: null, previsao: 5800, meta: 4500 },
]

const categoryData = [
  { name: "Eletrônicos", value: 199, fill: "#3b82f6" },
  { name: "Acessórios", value: 103, fill: "#10b981" },
  { name: "Wearables", value: 19, fill: "#8b5cf6" },
  { name: "Monitores", value: 8, fill: "#f59e0b" },
]

const performanceData = [
  { name: "Vendas", value: 87, fill: "#3b82f6" },
  { name: "Meta", value: 100, fill: "#1e293b" },
]

const weeklyData = [
  { day: "Seg", vendas: 120 },
  { day: "Ter", vendas: 98 },
  { day: "Qua", vendas: 156 },
  { day: "Qui", vendas: 134 },
  { day: "Sex", vendas: 189 },
  { day: "Sáb", vendas: 210 },
  { day: "Dom", vendas: 78 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: 0,
    category: "",
    price: 0,
  })

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsCommandOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault()
        setIsAddDialogOpen(true)
      }
      if (e.key === "Escape") {
        setIsCommandOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalProducts = products.length
  const totalStock = products.reduce((acc, p) => acc + p.quantity, 0)
  const lowStockCount = products.filter((p) => p.quantity < 15).length
  const totalSalesLastMonth = products.reduce((acc, p) => acc + p.salesLastMonth, 0)
  const totalRevenue = products.reduce((acc, p) => acc + (p.salesLastMonth * p.price), 0)
  const avgTrend = Math.round(products.reduce((acc, p) => acc + p.salesTrend, 0) / products.length)
  const categories = [...new Set(products.map(p => p.category))]

  const topSellers = [...products].sort((a, b) => b.salesLastMonth - a.salesLastMonth).slice(0, 4)
  const highPotential = [...products].sort((a, b) => b.predictedSales - a.predictedSales).slice(0, 4)
  const lowStockProducts = [...products].filter(p => p.quantity < 15).sort((a, b) => a.quantity - b.quantity)

  const unreadNotifications = notifications.filter(n => !n.read).length

  const getStockStatus = (quantity: number) => {
    if (quantity <= 5) return { label: "Crítico", variant: "destructive" as const, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle }
    if (quantity <= 15) return { label: "Baixo", variant: "secondary" as const, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: AlertTriangle }
    return { label: "Normal", variant: "outline" as const, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 }
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
    toast.success("Produto adicionado", {
      description: `${product.name} foi adicionado ao inventário.`,
    })
  }

  const handleEditProduct = () => {
    if (!editingProduct) return
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
    setIsEditDialogOpen(false)
    toast.success("Produto atualizado", {
      description: `${editingProduct.name} foi atualizado com sucesso.`,
    })
    setEditingProduct(null)
  }

  const handleDeleteProduct = () => {
    if (!deletingProduct) return
    setProducts(products.filter(p => p.id !== deletingProduct.id))
    setIsDeleteDialogOpen(false)
    toast.success("Produto removido", {
      description: `${deletingProduct.name} foi removido do inventário.`,
    })
    setDeletingProduct(null)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct({ ...product })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setDeletingProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
    toast.success("Dados atualizados", {
      description: "Inventário sincronizado com sucesso.",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "error": return <XCircle className="h-4 w-4 text-red-400" />
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-400" />
      case "info": return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#06060a] to-[#06060a]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        </div>

        {/* Command Palette */}
        <AnimatePresence>
          {isCommandOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/80 backdrop-blur-sm"
              onClick={() => setIsCommandOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-xl mx-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/95 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3 px-4 border-b border-white/5">
                    <Search className="h-5 w-5 text-slate-500" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Buscar comandos, produtos..."
                      className="flex-1 bg-transparent py-4 text-base text-white placeholder:text-slate-500 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 text-xs text-slate-400">
                      ESC
                    </kbd>
                  </div>
                  <div className="p-2 max-h-80 overflow-auto">
                    <div className="px-2 py-1.5 text-xs font-medium text-slate-500">Ações rápidas</div>
                    <button 
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                      onClick={() => { setIsCommandOpen(false); setIsAddDialogOpen(true) }}
                    >
                      <Plus className="h-4 w-4 text-blue-400" />
                      Adicionar novo produto
                      <kbd className="ml-auto text-xs text-slate-500">Ctrl+N</kbd>
                    </button>
                    <button 
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                      onClick={() => { setIsCommandOpen(false); handleRefresh() }}
                    >
                      <RefreshCw className="h-4 w-4 text-emerald-400" />
                      Sincronizar dados
                    </button>
                    <button 
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                      onClick={() => { setIsCommandOpen(false) }}
                    >
                      <Download className="h-4 w-4 text-violet-400" />
                      Exportar relatório
                    </button>
                    {filteredProducts.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 mt-2 text-xs font-medium text-slate-500">Produtos</div>
                        {filteredProducts.slice(0, 5).map(product => (
                          <button 
                            key={product.id}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                            onClick={() => { setIsCommandOpen(false); openEditDialog(product) }}
                          >
                            <Package className="h-4 w-4 text-slate-400" />
                            {product.name}
                            <span className="ml-auto text-xs text-slate-500">{product.sku}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06060a]/80 backdrop-blur-2xl">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-300" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
                    <Boxes className="h-5 w-5 text-white" />
                  </div>
                </motion.div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold tracking-tight text-white">Inventário Pro</h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {currentTime.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
                    <span className="text-slate-700">•</span>
                    {currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md mx-4">
                <button
                  onClick={() => setIsCommandOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group"
                >
                  <Search className="h-4 w-4 text-slate-500 group-hover:text-slate-400" />
                  <span className="flex-1 text-left text-sm text-slate-500 group-hover:text-slate-400">Buscar produtos, comandos...</span>
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 text-xs text-slate-500">
                    <Command className="h-3 w-3" />K
                  </kbd>
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`relative rounded-xl h-10 w-10 hover:bg-white/5 ${isRefreshing ? 'animate-spin' : ''}`}
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className="h-4 w-4 text-slate-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sincronizar dados</TooltipContent>
                </Tooltip>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10 hover:bg-white/5">
                      <Bell className="h-4 w-4 text-slate-400" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                          {unreadNotifications}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-[#0a0a0f] border-white/10">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Notificações</span>
                        <Badge variant="secondary" className="bg-white/5 text-slate-400">{unreadNotifications} novas</Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? 'bg-white/5' : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                          <p className="text-xs text-slate-500 truncate">{notification.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-600">{notification.time}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-white/5 p-0">
                      <Avatar className="h-9 w-9 ring-2 ring-white/10">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Avatar" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-violet-600 text-white text-sm">LS</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0f] border-white/10">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-white">Leo Souza</p>
                        <p className="text-xs text-slate-500">leo@empresa.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar dados
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem className="cursor-pointer text-red-400">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="hidden sm:flex gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 h-10"
                >
                  <Plus className="h-4 w-4" />
                  Novo Produto
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Hero Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Revenue Card - Featured */}
              <div className="col-span-2 lg:col-span-2 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 ring-1 ring-blue-500/30">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400">Receita do Mês</p>
                        <p className="text-xs text-slate-600">Baseado nas vendas</p>
                      </div>
                    </div>
                    <p className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                      {formatCurrency(totalRevenue)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="font-medium">+18.2%</span>
                      </div>
                      <span className="text-xs text-slate-500">vs. mês anterior</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Stats */}
              {[
                { label: "Produtos", value: totalProducts, icon: Package, color: "blue", trend: 12 },
                { label: "Em Estoque", value: totalStock.toLocaleString(), icon: Boxes, color: "emerald", trend: 8 },
                { label: "Vendas/Mês", value: totalSalesLastMonth, icon: ShoppingCart, color: "violet", trend: avgTrend },
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 border border-white/5 hover:border-white/10 transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className={`inline-flex p-2.5 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 ring-1 ring-${stat.color}-500/20 mb-3`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <div className={`flex items-center gap-0.5 text-xs ${stat.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.trend >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(stat.trend)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Performance de Vendas</h3>
                    <p className="text-sm text-slate-500">Comparativo real vs previsão IA</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      <span className="text-slate-400">Vendas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                      <span className="text-slate-400">Previsão</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-4 bg-emerald-500/50" style={{ borderStyle: "dashed" }} />
                      <span className="text-slate-400">Meta</span>
                    </div>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPrevisao" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="month" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '12px', 
                          boxShadow: '0 20px 40px rgba(0,0,0,0.4)' 
                        }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: '#94a3b8' }}
                      />
                      <Area type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVendas)" />
                      <Area type="monotone" dataKey="previsao" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 4" fillOpacity={1} fill="url(#colorPrevisao)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Weekly Chart */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Vendas da Semana</h3>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +23%
                    </Badge>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <Bar dataKey="vendas" radius={[4, 4, 0, 0]}>
                          {weeklyData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === weeklyData.length - 2 ? '#3b82f6' : '#1e293b'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 border border-white/5">
                  <h3 className="text-sm font-semibold text-white mb-4">Por Categoria</h3>
                  <div className="space-y-3">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">{cat.name}</span>
                          <span className="text-white font-medium">{cat.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(cat.value / 199) * 100}%`, backgroundColor: cat.fill }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Insights & Top Products */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-4 gap-6">
              {/* AI Insights */}
              <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/30 p-6 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/30">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Insights IA</h3>
                      <p className="text-xs text-slate-500">Atualizado agora</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: Zap, color: "amber", title: "Alta Demanda", text: "iPhone 16 Pro +22%" },
                      { icon: AlertTriangle, color: "red", title: "Ruptura", text: "3 produtos críticos" },
                      { icon: Target, color: "emerald", title: "Meta", text: "87% atingido" },
                    ].map((insight, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <insight.icon className={`h-3.5 w-3.5 text-${insight.color}-400`} />
                          <span className={`text-xs font-medium text-${insight.color}-400`}>{insight.title}</span>
                        </div>
                        <p className="text-sm text-slate-300">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Sellers */}
              <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 ring-1 ring-orange-500/30">
                    <Flame className="h-4 w-4 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Mais Vendidos</h3>
                </div>
                <div className="space-y-3">
                  {topSellers.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-white text-xs ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'bg-gradient-to-br from-orange-600 to-orange-700'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.salesLastMonth} vendas</p>
                      </div>
                      <Badge className={`${product.salesTrend >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {product.salesTrend >= 0 ? '+' : ''}{product.salesTrend}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predictions */}
              <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 ring-1 ring-violet-500/30">
                    <Eye className="h-4 w-4 text-violet-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Previsão Junho</h3>
                </div>
                <div className="space-y-3">
                  {highPotential.map((product) => (
                    <div key={product.id} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-white truncate flex-1 mr-2">{product.name}</p>
                        <span className="text-sm font-medium text-violet-400">{product.predictedSales}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(product.predictedSales / 104) * 100} className="h-1.5 flex-1 bg-white/5" />
                        <span className="text-xs text-slate-500">{Math.round((product.predictedSales / 104) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 ring-1 ring-red-500/30">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">Estoque Crítico</h3>
                      <p className="text-xs text-slate-500">{lowStockProducts.length} alertas</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 4).map((product) => {
                      const status = getStockStatus(product.quantity)
                      return (
                        <div key={product.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm text-white truncate">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.sku}</p>
                          </div>
                          <Badge className={`${status.bg} ${status.color} ${status.border}`}>
                            {product.quantity} un
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Table */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/5 overflow-hidden">
              {/* Table Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-semibold text-white">Inventário Completo</h3>
                  <p className="text-sm text-slate-500">{filteredProducts.length} produtos encontrados</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white rounded-xl">
                      <Filter className="h-4 w-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0f] border-white/10">
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="gap-2 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="sm:hidden gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-medium">Produto</TableHead>
                      <TableHead className="text-slate-400 font-medium">SKU</TableHead>
                      <TableHead className="text-slate-400 font-medium text-center">Quantidade</TableHead>
                      <TableHead className="text-slate-400 font-medium">Status</TableHead>
                      <TableHead className="text-slate-400 font-medium text-right">Preço</TableHead>
                      <TableHead className="text-slate-400 font-medium text-center">Vendas/Mês</TableHead>
                      <TableHead className="text-slate-400 font-medium text-center">Tendência</TableHead>
                      <TableHead className="text-slate-400 font-medium text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredProducts.map((product, index) => {
                        const status = getStockStatus(product.quantity)
                        return (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border-white/5 hover:bg-white/[0.02] transition-colors ${index % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                  {product.image ? (
                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Package className="h-5 w-5 text-slate-500" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{product.name}</p>
                                  <p className="text-xs text-slate-500">{product.category}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="px-2 py-1 rounded bg-white/5 text-xs text-slate-400 font-mono">{product.sku}</code>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-white font-medium">{product.quantity}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${status.bg} ${status.color} ${status.border} gap-1`}>
                                <status.icon className="h-3 w-3" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-white font-medium">{formatCurrency(product.price)}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-white">{product.salesLastMonth}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${product.salesTrend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {product.salesTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {product.salesTrend >= 0 ? '+' : ''}{product.salesTrend}%
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-400"
                                      onClick={() => openEditDialog(product)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Editar</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-400"
                                      onClick={() => openDeleteDialog(product)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Excluir</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Plus className="h-4 w-4 text-blue-400" />
                </div>
                Novo Produto
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Adicione um novo produto ao inventário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nome do Produto</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                  placeholder="Ex: MacBook Pro 16"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">SKU</Label>
                  <Input
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                    placeholder="TECH-XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Quantidade</Label>
                  <Input
                    type="number"
                    value={newProduct.quantity || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Categoria</Label>
                  <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0f] border-white/10">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Preço (R$)</Label>
                  <Input
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="hover:bg-white/5">
                Cancelar
              </Button>
              <Button 
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.sku}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500"
              >
                Adicionar Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Pencil className="h-4 w-4 text-amber-400" />
                </div>
                Editar Produto
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Atualize as informações do produto
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Nome do Produto</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus:border-amber-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">SKU</Label>
                    <Input
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="bg-white/5 border-white/10 text-white focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Quantidade</Label>
                    <Input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white focus:border-amber-500/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Categoria</Label>
                    <Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0f] border-white/10">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Preço (R$)</Label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white focus:border-amber-500/50"
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="hover:bg-white/5">
                Cancelar
              </Button>
              <Button 
                onClick={handleEditProduct}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </div>
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Tem certeza que deseja excluir <span className="text-white font-medium">{deletingProduct?.name}</span>? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="hover:bg-white/5">
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteProduct}
                className="bg-red-600 hover:bg-red-500"
              >
                Excluir Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
