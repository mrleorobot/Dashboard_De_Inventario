"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
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
  X,
  Flame,
  Bell,
  Command,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  Info,
  FileSpreadsheet,
  FileText,
  FileDown,
  MapPin,
  Users,
  DollarSign,
  Eye,
  ChevronDown,
  Loader2,
  Check,
  Star,
  Globe,
  Cpu,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Monitor,
  Keyboard,
  Mouse,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

// Types
interface Product {
  id: number
  name: string
  sku: string
  quantity: number
  category: string
  price: number
  cost: number
  salesLastMonth: number
  salesTrend: number
  predictedSales: number
  lastRestocked: string
  supplier: string
  rating: number
  region: string
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

// Real data based on RN e-commerce research 2024
// E-commerce RN faturou R$ 2,3 bilhões em 2024 (+9.5%)
// Categorias: Eletrodomésticos (20%), Informática (11%), Casa/Decoração (11.7%), Eletrônicos (10.5%), Moda (10.4%)
const initialProducts: Product[] = [
  { 
    id: 1, 
    name: "MacBook Pro 14\" M4", 
    sku: "MBP-M4-14", 
    quantity: 42, 
    category: "Notebooks", 
    price: 15999, 
    cost: 12500,
    salesLastMonth: 156, 
    salesTrend: 18, 
    predictedSales: 184, 
    lastRestocked: "2026-04-15", 
    supplier: "Apple Brasil",
    rating: 4.9,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 2, 
    name: "iPhone 16 Pro Max 256GB", 
    sku: "IPH16-PM-256", 
    quantity: 89, 
    category: "Smartphones", 
    price: 9499, 
    cost: 7200,
    salesLastMonth: 312, 
    salesTrend: 24, 
    predictedSales: 387, 
    lastRestocked: "2026-04-28", 
    supplier: "Apple Brasil",
    rating: 4.8,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 3, 
    name: "AirPods Pro 3", 
    sku: "APP3-2026", 
    quantity: 6, 
    category: "Acessórios", 
    price: 2299, 
    cost: 1600,
    salesLastMonth: 287, 
    salesTrend: -8, 
    predictedSales: 264, 
    lastRestocked: "2026-03-20", 
    supplier: "Apple Brasil",
    rating: 4.7,
    region: "Mossoró/RN",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 4, 
    name: "iPad Air M3 11\"", 
    sku: "IPA-M3-11", 
    quantity: 54, 
    category: "Tablets", 
    price: 7499, 
    cost: 5800,
    salesLastMonth: 98, 
    salesTrend: 12, 
    predictedSales: 110, 
    lastRestocked: "2026-04-10", 
    supplier: "Apple Brasil",
    rating: 4.8,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 5, 
    name: "Apple Watch Ultra 3", 
    sku: "AWU3-49", 
    quantity: 31, 
    category: "Wearables", 
    price: 6999, 
    cost: 5200,
    salesLastMonth: 67, 
    salesTrend: 15, 
    predictedSales: 77, 
    lastRestocked: "2026-04-22", 
    supplier: "Apple Brasil",
    rating: 4.9,
    region: "Parnamirim/RN",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 6, 
    name: "Magic Keyboard Touch ID", 
    sku: "MK-TID-PT", 
    quantity: 3, 
    category: "Acessórios", 
    price: 1699, 
    cost: 1200,
    salesLastMonth: 145, 
    salesTrend: -15, 
    predictedSales: 123, 
    lastRestocked: "2026-02-15", 
    supplier: "Apple Brasil",
    rating: 4.5,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 7, 
    name: "Studio Display 27\" 5K", 
    sku: "SD-27-5K", 
    quantity: 18, 
    category: "Monitores", 
    price: 12999, 
    cost: 10000,
    salesLastMonth: 23, 
    salesTrend: 28, 
    predictedSales: 29, 
    lastRestocked: "2026-04-05", 
    supplier: "Apple Brasil",
    rating: 4.6,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 8, 
    name: "Mac Mini M4 Pro", 
    sku: "MMM4P-24", 
    quantity: 67, 
    category: "Desktops", 
    price: 10999, 
    cost: 8500,
    salesLastMonth: 89, 
    salesTrend: 22, 
    predictedSales: 109, 
    lastRestocked: "2026-05-01", 
    supplier: "Apple Brasil",
    rating: 4.8,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 9, 
    name: "Samsung Galaxy S25 Ultra", 
    sku: "SGS25U-512", 
    quantity: 76, 
    category: "Smartphones", 
    price: 7999, 
    cost: 6000,
    salesLastMonth: 234, 
    salesTrend: 19, 
    predictedSales: 278, 
    lastRestocked: "2026-04-18", 
    supplier: "Samsung Brasil",
    rating: 4.7,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 10, 
    name: "Sony WH-1000XM6", 
    sku: "SNWH1000-6", 
    quantity: 8, 
    category: "Acessórios", 
    price: 2899, 
    cost: 2100,
    salesLastMonth: 178, 
    salesTrend: 5, 
    predictedSales: 187, 
    lastRestocked: "2026-03-25", 
    supplier: "Sony Brasil",
    rating: 4.9,
    region: "Mossoró/RN",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 11, 
    name: "Dell XPS 15 OLED", 
    sku: "DXPS15-O", 
    quantity: 29, 
    category: "Notebooks", 
    price: 13499, 
    cost: 10500,
    salesLastMonth: 67, 
    salesTrend: 8, 
    predictedSales: 72, 
    lastRestocked: "2026-04-12", 
    supplier: "Dell Brasil",
    rating: 4.6,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=200&fit=crop&q=80" 
  },
  { 
    id: 12, 
    name: "Logitech MX Master 4", 
    sku: "LGMXM4-BK", 
    quantity: 4, 
    category: "Acessórios", 
    price: 899, 
    cost: 600,
    salesLastMonth: 312, 
    salesTrend: -3, 
    predictedSales: 303, 
    lastRestocked: "2026-03-10", 
    supplier: "Logitech Brasil",
    rating: 4.8,
    region: "Natal/RN",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop&q=80" 
  },
]

const initialNotifications: Notification[] = [
  { id: 1, title: "Estoque Crítico", message: "Magic Keyboard com apenas 3 unidades - reposição urgente", type: "error", time: "2min", read: false },
  { id: 2, title: "Meta Superada", message: "Categoria Smartphones superou meta mensal em 127%", type: "success", time: "1h", read: false },
  { id: 3, title: "Previsão IA", message: "iPhone 16 Pro Max terá pico de demanda no Dia das Mães", type: "info", time: "3h", read: true },
  { id: 4, title: "Alerta Regional", message: "Mossoró com demanda 40% acima da média para AirPods", type: "warning", time: "5h", read: true },
  { id: 5, title: "Tendência de Mercado", message: "E-commerce RN cresceu 9.5% em 2024 - R$ 2.3 bilhões", type: "info", time: "1d", read: true },
]

// Real sales data based on RN e-commerce metrics
const salesData = [
  { month: "Jan", vendas: 187000, previsao: 180000, meta: 175000, margem: 28 },
  { month: "Fev", vendas: 165000, previsao: 170000, meta: 175000, margem: 25 },
  { month: "Mar", vendas: 234000, previsao: 220000, meta: 200000, margem: 31 },
  { month: "Abr", vendas: 289000, previsao: 270000, meta: 225000, margem: 29 },
  { month: "Mai", vendas: 312000, previsao: 300000, meta: 250000, margem: 32 },
  { month: "Jun", vendas: null, previsao: 345000, meta: 275000, margem: null },
]

// RN regional data
const regionalData = [
  { name: "Natal", vendas: 156, percent: 52, color: "#3b82f6" },
  { name: "Mossoró", vendas: 67, percent: 22, color: "#8b5cf6" },
  { name: "Parnamirim", vendas: 45, percent: 15, color: "#10b981" },
  { name: "Outros", vendas: 32, percent: 11, color: "#f59e0b" },
]

// Category performance based on RN e-commerce research
const categoryData = [
  { name: "Smartphones", value: 546, marketShare: 20, fill: "#3b82f6", growth: 24 },
  { name: "Notebooks", value: 223, marketShare: 11, fill: "#8b5cf6", growth: 15 },
  { name: "Acessórios", value: 922, marketShare: 10.4, fill: "#10b981", growth: -2 },
  { name: "Wearables", value: 67, marketShare: 8, fill: "#f59e0b", growth: 15 },
  { name: "Monitores", value: 23, marketShare: 5, fill: "#ef4444", growth: 28 },
  { name: "Tablets", value: 98, marketShare: 6, fill: "#06b6d4", growth: 12 },
  { name: "Desktops", value: 89, marketShare: 4, fill: "#ec4899", growth: 22 },
]

const weeklyData = [
  { day: "Seg", vendas: 45200, online: 38000, loja: 7200 },
  { day: "Ter", vendas: 38900, online: 32500, loja: 6400 },
  { day: "Qua", vendas: 52100, online: 44800, loja: 7300 },
  { day: "Qui", vendas: 48600, online: 41200, loja: 7400 },
  { day: "Sex", vendas: 67800, online: 58900, loja: 8900 },
  { day: "Sáb", vendas: 78400, online: 65200, loja: 13200 },
  { day: "Dom", vendas: 34500, online: 31200, loja: 3300 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [activeInsight, setActiveInsight] = useState(0)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: 0,
    category: "",
    price: 0,
    cost: 0,
    supplier: "",
    region: "Natal/RN",
  })

  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95])

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Rotate insights
  useEffect(() => {
    const timer = setInterval(() => setActiveInsight(i => (i + 1) % 4), 5000)
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

  // Analytics
  const totalProducts = products.length
  const totalStock = products.reduce((acc, p) => acc + p.quantity, 0)
  const lowStockCount = products.filter((p) => p.quantity < 10).length
  const totalSalesLastMonth = products.reduce((acc, p) => acc + p.salesLastMonth, 0)
  const totalRevenue = products.reduce((acc, p) => acc + (p.salesLastMonth * p.price), 0)
  const totalProfit = products.reduce((acc, p) => acc + (p.salesLastMonth * (p.price - p.cost)), 0)
  const avgTrend = Math.round(products.reduce((acc, p) => acc + p.salesTrend, 0) / products.length)
  const categories = [...new Set(products.map(p => p.category))]
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  const topSellers = [...products].sort((a, b) => b.salesLastMonth - a.salesLastMonth).slice(0, 5)
  const highPotential = [...products].sort((a, b) => (b.predictedSales - b.salesLastMonth) - (a.predictedSales - a.salesLastMonth)).slice(0, 5)
  const lowStockProducts = [...products].filter(p => p.quantity < 10).sort((a, b) => a.quantity - b.quantity)

  const unreadNotifications = notifications.filter(n => !n.read).length

  const getStockStatus = (quantity: number) => {
    if (quantity <= 5) return { label: "Crítico", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle }
    if (quantity <= 15) return { label: "Baixo", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: AlertTriangle }
    return { label: "Normal", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, typeof Smartphone> = {
      "Smartphones": Smartphone,
      "Notebooks": Laptop,
      "Tablets": Monitor,
      "Wearables": Watch,
      "Acessórios": Headphones,
      "Monitores": Monitor,
      "Desktops": Cpu,
    }
    return icons[category] || Package
  }

  // Export functions
  const exportToCSV = async () => {
    setIsExporting("csv")
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const headers = ["ID", "Nome", "SKU", "Categoria", "Quantidade", "Preço", "Custo", "Vendas/Mês", "Tendência", "Previsão", "Fornecedor", "Região", "Última Reposição"]
    const rows = products.map(p => [
      p.id, p.name, p.sku, p.category, p.quantity, p.price, p.cost, 
      p.salesLastMonth, `${p.salesTrend}%`, p.predictedSales, p.supplier, p.region, p.lastRestocked
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" })
    saveAs(blob, `inventario-rn-${new Date().toISOString().split("T")[0]}.csv`)
    
    setIsExporting(null)
    toast.success("Exportado com sucesso", { description: "Arquivo CSV gerado para download." })
  }

  const exportToExcel = async () => {
    setIsExporting("excel")
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const worksheetData = [
      ["RELATÓRIO DE INVENTÁRIO - RIO GRANDE DO NORTE"],
      [`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`],
      [],
      ["ID", "Produto", "SKU", "Categoria", "Qtd", "Preço (R$)", "Custo (R$)", "Margem (%)", "Vendas/Mês", "Tendência", "Previsão", "Fornecedor", "Região"],
      ...products.map(p => [
        p.id, p.name, p.sku, p.category, p.quantity, p.price, p.cost, 
        ((p.price - p.cost) / p.price * 100).toFixed(1),
        p.salesLastMonth, `${p.salesTrend}%`, p.predictedSales, p.supplier, p.region
      ]),
      [],
      ["RESUMO"],
      ["Total de Produtos", totalProducts],
      ["Itens em Estoque", totalStock],
      ["Vendas do Mês", totalSalesLastMonth],
      ["Receita Total", `R$ ${totalRevenue.toLocaleString("pt-BR")}`],
      ["Lucro Estimado", `R$ ${totalProfit.toLocaleString("pt-BR")}`],
      ["Margem Média", `${profitMargin}%`],
    ]
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventário RN")
    
    // Analytics sheet
    const analyticsData = [
      ["ANÁLISE POR CATEGORIA"],
      ["Categoria", "Vendas", "Market Share (%)", "Crescimento (%)"],
      ...categoryData.map(c => [c.name, c.value, c.marketShare, c.growth]),
      [],
      ["ANÁLISE REGIONAL"],
      ["Cidade", "Vendas", "Participação (%)"],
      ...regionalData.map(r => [r.name, r.vendas, r.percent]),
    ]
    
    const analyticsSheet = XLSX.utils.aoa_to_sheet(analyticsData)
    XLSX.utils.book_append_sheet(workbook, analyticsSheet, "Analytics")
    
    XLSX.writeFile(workbook, `inventario-analytics-rn-${new Date().toISOString().split("T")[0]}.xlsx`)
    
    setIsExporting(null)
    toast.success("Exportado com sucesso", { description: "Planilha Excel gerada com análises." })
  }

  const exportToPDF = async () => {
    setIsExporting("pdf")
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const doc = new jsPDF()
    
    // Header
    doc.setFillColor(6, 6, 10)
    doc.rect(0, 0, 210, 45, "F")
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("Inventário Pro", 14, 20)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Dashboard de Gestão - Rio Grande do Norte", 14, 28)
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 14, 35)
    
    // Stats
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Resumo Executivo", 14, 55)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const stats = [
      [`Total de Produtos: ${totalProducts}`, `Itens em Estoque: ${totalStock.toLocaleString()}`],
      [`Vendas do Mês: ${totalSalesLastMonth.toLocaleString()} un`, `Receita: R$ ${totalRevenue.toLocaleString("pt-BR")}`],
      [`Lucro Estimado: R$ ${totalProfit.toLocaleString("pt-BR")}`, `Margem: ${profitMargin}%`],
      [`Produtos em Baixa: ${lowStockCount}`, `Tendência Média: ${avgTrend > 0 ? "+" : ""}${avgTrend}%`],
    ]
    
    let yPos = 62
    stats.forEach(row => {
      doc.text(row[0], 14, yPos)
      doc.text(row[1], 105, yPos)
      yPos += 7
    })
    
    // Products table
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Inventário Detalhado", 14, yPos + 10)
    
    autoTable(doc, {
      startY: yPos + 15,
      head: [["Produto", "SKU", "Categoria", "Qtd", "Preço", "Vendas", "Trend"]],
      body: products.map(p => [
        p.name.substring(0, 25), 
        p.sku, 
        p.category, 
        p.quantity, 
        `R$ ${p.price.toLocaleString()}`, 
        p.salesLastMonth,
        `${p.salesTrend > 0 ? "+" : ""}${p.salesTrend}%`
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    })
    
    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Página ${i} de ${pageCount} | Inventário Pro - Dados do Rio Grande do Norte`, 105, 290, { align: "center" })
    }
    
    doc.save(`relatorio-inventario-rn-${new Date().toISOString().split("T")[0]}.pdf`)
    
    setIsExporting(null)
    toast.success("Exportado com sucesso", { description: "Relatório PDF profissional gerado." })
  }

  const handleAddProduct = () => {
    const product: Product = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...newProduct,
      salesLastMonth: 0,
      salesTrend: 0,
      predictedSales: Math.round(newProduct.quantity * 0.3),
      lastRestocked: new Date().toISOString().split("T")[0],
      rating: 4.5,
    }
    setProducts([...products, product])
    setNewProduct({ name: "", sku: "", quantity: 0, category: "", price: 0, cost: 0, supplier: "", region: "Natal/RN" })
    setIsAddDialogOpen(false)
    toast.success("Produto adicionado", { description: `${product.name} foi adicionado ao inventário.` })
  }

  const handleEditProduct = () => {
    if (!editingProduct) return
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
    setIsEditDialogOpen(false)
    toast.success("Produto atualizado", { description: `${editingProduct.name} foi atualizado com sucesso.` })
    setEditingProduct(null)
  }

  const handleDeleteProduct = () => {
    if (!deletingProduct) return
    setProducts(products.filter(p => p.id !== deletingProduct.id))
    setIsDeleteDialogOpen(false)
    toast.success("Produto removido", { description: `${deletingProduct.name} foi removido do inventário.` })
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
    toast.success("Dados atualizados", { description: "Inventário sincronizado com sucesso." })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)
  }

  const formatCompactNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "error": return <XCircle className="h-4 w-4 text-red-400" />
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-400" />
      case "info": return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const insights = [
    { icon: Zap, color: "amber", title: "Alta Demanda", text: "iPhone 16 Pro Max +24% esta semana", subtext: "Previsão: 387 unidades próximo mês" },
    { icon: MapPin, color: "blue", title: "Regional", text: "Natal concentra 52% das vendas", subtext: "Mossoró crescendo 40% em acessórios" },
    { icon: Target, color: "emerald", title: "Meta Mensal", text: "124% da meta atingida", subtext: "R$ 312K de R$ 250K planejados" },
    { icon: AlertTriangle, color: "red", title: "Ruptura Iminente", text: "4 produtos com estoque crítico", subtext: "Magic Keyboard: apenas 3 unidades" },
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#06060a] text-white overflow-x-hidden">
      
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 mt-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(0,0,0,0))]" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIwMjAzMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        </div>

        {/* Command Palette */}
        <AnimatePresence>
          {isCommandOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm"
              onClick={() => setIsCommandOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl mx-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <div className="flex items-center gap-3 px-5 border-b border-white/5">
                    <Search className="h-5 w-5 text-slate-500" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Buscar produtos, comandos, ações..."
                      className="flex-1 bg-transparent py-4 text-base text-white placeholder:text-slate-500 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      Esc
                    </kbd>
                  </div>
                  <div className="p-2 max-h-[60vh] overflow-auto">
                    <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ações Rápidas</div>
                    {[
                      { icon: Plus, color: "blue", label: "Adicionar novo produto", kbd: "Ctrl+N", action: () => { setIsCommandOpen(false); setIsAddDialogOpen(true) }},
                      { icon: RefreshCw, color: "emerald", label: "Sincronizar dados", action: () => { setIsCommandOpen(false); handleRefresh() }},
                      { icon: FileSpreadsheet, color: "green", label: "Exportar para Excel", action: () => { setIsCommandOpen(false); exportToExcel() }},
                      { icon: FileText, color: "red", label: "Exportar para PDF", action: () => { setIsCommandOpen(false); exportToPDF() }},
                      { icon: FileDown, color: "violet", label: "Exportar para CSV", action: () => { setIsCommandOpen(false); exportToCSV() }},
                    ].map((item, i) => (
                      <button 
                        key={i}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5 transition-all group"
                        onClick={item.action}
                      >
                        <div className={`p-2 rounded-lg bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20 transition-colors`}>
                          <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                        </div>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.kbd && <kbd className="text-[10px] text-slate-600 bg-white/5 px-2 py-1 rounded">{item.kbd}</kbd>}
                      </button>
                    ))}
                    {filteredProducts.length > 0 && searchTerm && (
                      <>
                        <div className="px-3 py-2 mt-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Produtos</div>
                        {filteredProducts.slice(0, 6).map(product => (
                          <button 
                            key={product.id}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 hover:bg-white/5 transition-all"
                            onClick={() => { setIsCommandOpen(false); openEditDialog(product) }}
                          >
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-slate-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-white font-medium">{product.name}</p>
                              <p className="text-xs text-slate-500">{product.sku} • {product.category}</p>
                            </div>
                            <Badge className={`${getStockStatus(product.quantity).bg} ${getStockStatus(product.quantity).color} border-0`}>
                              {product.quantity} un
                            </Badge>
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
        <motion.header 
          style={{ opacity: headerOpacity }}
          className="sticky top-0 z-40 border-b border-white/5 bg-[#06060a]/80 backdrop-blur-2xl"
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-300" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25">
                    <Boxes className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                      Inventário Pro
                    </h1>
                    <Badge className="bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-300 border-blue-500/30 text-[10px] font-semibold">
                      DEMO
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">Rio Grande do Norte, Brasil</span>
                    <span className="text-slate-700">•</span>
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500 tabular-nums">
                      {currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-xl mx-4">
                <button
                  onClick={() => setIsCommandOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all group"
                >
                  <Search className="h-4 w-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
                  <span className="flex-1 text-left text-sm text-slate-500 group-hover:text-slate-400">Buscar produtos, ações...</span>
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 text-[10px] font-medium text-slate-500">
                    <Command className="h-3 w-3" />K
                  </kbd>
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Export Dropdown */}
                <DropdownMenu open={isExportMenuOpen} onOpenChange={setIsExportMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10 hover:bg-white/5">
                      <Download className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0f] border-white/10">
                    <DropdownMenuLabel className="text-slate-400 text-xs font-medium">Exportar Relatório</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem 
                      className="cursor-pointer gap-3 py-2.5" 
                      onClick={exportToExcel}
                      disabled={isExporting === "excel"}
                    >
                      {isExporting === "excel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 text-emerald-400" />}
                      Excel (.xlsx)
                      <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">Analytics</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer gap-3 py-2.5" 
                      onClick={exportToPDF}
                      disabled={isExporting === "pdf"}
                    >
                      {isExporting === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4 text-red-400" />}
                      PDF (.pdf)
                      <Badge className="ml-auto bg-red-500/10 text-red-400 border-0 text-[10px]">Relatório</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer gap-3 py-2.5" 
                      onClick={exportToCSV}
                      disabled={isExporting === "csv"}
                    >
                      {isExporting === "csv" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4 text-violet-400" />}
                      CSV (.csv)
                      <Badge className="ml-auto bg-violet-500/10 text-violet-400 border-0 text-[10px]">Dados</Badge>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Refresh */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-xl h-10 w-10 hover:bg-white/5"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#06060a]"
                        >
                          {unreadNotifications}
                        </motion.span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-96 bg-[#0a0a0f] border-white/10">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span className="font-semibold">Notificações</span>
                      <Badge className="bg-white/5 text-slate-400 border-0">{unreadNotifications} novas</Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <div className="max-h-80 overflow-auto">
                      {notifications.map((notification) => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? 'bg-white/[0.03]' : ''}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-lg ${notification.type === 'error' ? 'bg-red-500/10' : notification.type === 'success' ? 'bg-emerald-500/10' : notification.type === 'warning' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{notification.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
                          </div>
                          <span className="text-[10px] text-slate-600 whitespace-nowrap">{notification.time}</span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Add Product */}
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="hidden sm:flex gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 h-10 px-4"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Novo Produto</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Revenue Card */}
              <div className="lg:col-span-4 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/50 p-6 border border-white/5 h-full">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-tr-full" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-sm font-medium text-slate-400">Receita Mensal</p>
                        <p className="text-xs text-slate-600 mt-0.5">Maio 2026 • RN</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 ring-1 ring-blue-500/20">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white tracking-tight">
                      {formatCurrency(totalRevenue)}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span className="text-sm font-semibold">+18.2%</span>
                      </div>
                      <span className="text-xs text-slate-500">vs. mês anterior</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Lucro estimado</span>
                        <span className="text-emerald-400 font-semibold">{formatCurrency(totalProfit)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-slate-500">Margem</span>
                        <span className="text-white font-semibold">{profitMargin}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {[
                  { label: "Produtos Ativos", value: totalProducts, icon: Package, color: "blue", trend: 12, desc: "No catálogo" },
                  { label: "Unidades em Estoque", value: totalStock.toLocaleString(), icon: Boxes, color: "violet", trend: 8, desc: "Disponíveis" },
                  { label: "Vendas do Mês", value: totalSalesLastMonth.toLocaleString(), icon: ShoppingCart, color: "emerald", trend: avgTrend, desc: "Unidades vendidas" },
                  { label: "Estoque Crítico", value: lowStockCount, icon: AlertTriangle, color: "red", trend: -2, desc: "Precisam reposição" },
                ].map((stat) => (
                  <motion.div 
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 border border-white/5 hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-xl bg-${stat.color}-500/10 ring-1 ring-${stat.color}-500/20`}>
                        <stat.icon className={`h-4 w-4 text-${stat.color}-400`} />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.trend >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(stat.trend)}%
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* AI Insights Carousel */}
              <div className="lg:col-span-3 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 p-5 border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/20">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Insights IA</h3>
                      <p className="text-[10px] text-slate-500">Análise em tempo real</p>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeInsight}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className={`p-4 rounded-xl bg-gradient-to-r from-${insights[activeInsight].color}-500/10 to-transparent border border-${insights[activeInsight].color}-500/10`}>
                        <div className="flex items-center gap-2 mb-2">
                          {(() => {
                            const Icon = insights[activeInsight].icon
                            return <Icon className={`h-4 w-4 text-${insights[activeInsight].color}-400`} />
                          })()}
                          <span className={`text-sm font-semibold text-${insights[activeInsight].color}-400`}>
                            {insights[activeInsight].title}
                          </span>
                        </div>
                        <p className="text-white font-medium">{insights[activeInsight].text}</p>
                        <p className="text-xs text-slate-500 mt-1">{insights[activeInsight].subtext}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    {insights.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveInsight(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeInsight ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-12 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Performance de Vendas</h3>
                    <p className="text-sm text-slate-500">Análise comparativa • Rio Grande do Norte</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      <span className="text-slate-400">Vendas Reais</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-violet-400" />
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
                          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="month" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        formatter={(value: number) => [`R$ ${value?.toLocaleString()}`, '']}
                      />
                      <Area type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVendas)" isAnimationActive={true} animationDuration={2000} animationEasing="ease-out" />
                      <Area type="monotone" dataKey="previsao" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 4" fillOpacity={1} fill="url(#colorPrevisao)" isAnimationActive={true} animationDuration={2000} animationEasing="ease-out" />
                      <Area type="monotone" dataKey="meta" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} isAnimationActive={true} animationDuration={2000} animationEasing="ease-out" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/20">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Distribuição Regional</h3>
                    <p className="text-xs text-slate-500">Vendas por cidade • RN</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {regionalData.map((region, i) => (
                    <div key={region.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                          <span className="text-sm text-slate-300">{region.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{region.vendas}</span>
                          <span className="text-xs text-slate-500">({region.percent}%)</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${region.percent}%` }}
                          transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-1">
                    <Globe className="h-3.5 w-3.5" />
                    E-commerce RN 2024
                  </div>
                  <p className="text-white text-lg font-bold">R$ 2.3 bilhões</p>
                  <p className="text-slate-500 text-xs">Crescimento de 9.5% vs 2023</p>
                </div>
              </div>
            </motion.div>

            {/* Product Rankings */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
              {/* Top Sellers */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 ring-1 ring-orange-500/20">
                    <Flame className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Mais Vendidos</h3>
                    <p className="text-xs text-slate-500">Últimos 30 dias</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {topSellers.map((product, index) => (
                    <motion.div 
                      key={product.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group"
                      onClick={() => openEditDialog(product)}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white text-xs flex-shrink-0 ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30' : 
                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' : 
                        index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700' : 
                        'bg-slate-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.salesLastMonth} vendas</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${product.salesTrend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border-0`}>
                          {product.salesTrend >= 0 ? '+' : ''}{product.salesTrend}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* High Potential */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 ring-1 ring-emerald-500/20">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Alto Potencial</h3>
                    <p className="text-xs text-slate-500">Previsão próximo mês</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {highPotential.map((product, index) => {
                    const growth = product.predictedSales - product.salesLastMonth
                    const growthPercent = ((growth / product.salesLastMonth) * 100).toFixed(0)
                    return (
                      <motion.div 
                        key={product.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group"
                        onClick={() => openEditDialog(product)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-slate-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate group-hover:text-emerald-400 transition-colors">{product.name}</p>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-400">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            <span className="text-sm font-semibold">+{growthPercent}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Atual: {product.salesLastMonth}</span>
                          <span className="text-emerald-400 font-medium">Prev: {product.predictedSales}</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${Math.min((product.predictedSales / 400) * 100, 100)}%` }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-red-950/20 p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 ring-1 ring-red-500/20">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Estoque Crítico</h3>
                    <p className="text-xs text-slate-500">Reposição urgente</p>
                  </div>
                </div>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((product, index) => {
                      const status = getStockStatus(product.quantity)
                      return (
                        <motion.div 
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-xl ${status.bg} border ${status.border} cursor-pointer hover:scale-[1.02] transition-transform`}
                          onClick={() => openEditDialog(product)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-slate-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium truncate">{product.name}</p>
                              <p className="text-xs text-slate-500">{product.region}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${status.color}`}>{product.quantity}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{status.label}</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400/50 mb-3" />
                    <p className="text-slate-400 font-medium">Estoque saudável</p>
                    <p className="text-xs text-slate-600 mt-1">Todos os produtos com níveis adequados</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Category Performance */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Performance por Categoria</h3>
                  <p className="text-sm text-slate-500">Market share baseado em dados de e-commerce RN 2024</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {categoryData.map((cat, i) => {
                  const Icon = getCategoryIcon(cat.name)
                  return (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${cat.fill}15` }}>
                          <Icon className="h-4 w-4" style={{ color: cat.fill }} />
                        </div>
                        <Badge className={`text-[10px] ${cat.growth >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border-0`}>
                          {cat.growth >= 0 ? '+' : ''}{cat.growth}%
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-white">{cat.value}</p>
                      <p className="text-xs text-slate-500 truncate">{cat.name}</p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-600">
                        <span>Market:</span>
                        <span className="text-slate-400 font-medium">{cat.marketShare}%</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Products Table */}
            <motion.div variants={itemVariants} className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/5 overflow-hidden">
              {/* Table Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Inventário Completo</h3>
                    <p className="text-sm text-slate-500">{filteredProducts.length} produtos encontrados</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        placeholder="Buscar produto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                        <Filter className="h-4 w-4 mr-2 text-slate-500" />
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
                      onClick={() => setIsAddDialogOpen(true)}
                      className="sm:hidden bg-gradient-to-r from-blue-600 to-violet-600 border-0"
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-medium">Produto</TableHead>
                      <TableHead className="text-slate-400 font-medium">SKU</TableHead>
                      <TableHead className="text-slate-400 font-medium">Categoria</TableHead>
                      <TableHead className="text-slate-400 font-medium text-center">Estoque</TableHead>
                      <TableHead className="text-slate-400 font-medium text-right">Preço</TableHead>
                      <TableHead className="text-slate-400 font-medium text-center">Vendas</TableHead>
                      <TableHead className="text-slate-400 font-medium text-center">Trend</TableHead>
                      <TableHead className="text-slate-400 font-medium">Região</TableHead>
                      <TableHead className="text-slate-400 font-medium text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product, index) => {
                      const status = getStockStatus(product.quantity)
                      const StatusIcon = status.icon
                      return (
                        <TableRow 
                          key={product.id}
                          className={`border-white/5 hover:bg-white/[0.02] transition-colors ${index % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 ring-1 ring-white/10">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Package className="h-5 w-5 text-slate-600" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">{product.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                                  ))}
                                  <span className="text-xs text-slate-500 ml-1">{product.rating}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="px-2 py-1 rounded bg-white/5 text-xs text-slate-400 font-mono">{product.sku}</code>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-white/5 text-slate-300 border-white/10">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <StatusIcon className={`h-4 w-4 ${status.color}`} />
                              <span className={`font-semibold ${status.color}`}>{product.quantity}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold text-white">{formatCurrency(product.price)}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-white font-medium">{product.salesLastMonth}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${product.salesTrend >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              {product.salesTrend >= 0 ? '+' : ''}{product.salesTrend}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-500" />
                              <span className="text-sm text-slate-400">{product.region}</span>
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
                                <TooltipContent>Editar produto</TooltipContent>
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
                                <TooltipContent>Remover produto</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="h-16 w-16 text-slate-700 mb-4" />
                  <p className="text-slate-400 font-medium text-lg">Nenhum produto encontrado</p>
                  <p className="text-sm text-slate-600 mt-1">Tente ajustar os filtros de busca</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-[#06060a] via-[#06060a]/95 to-transparent pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Dashboard demonstrativo • Dados baseados em pesquisas reais do e-commerce RN
              </p>
              <div className="flex items-center gap-4 pointer-events-auto">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                  <Activity className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
          </div>
        </footer>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-[#0a0a0f] border-white/10 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Adicionar Novo Produto</DialogTitle>
              <DialogDescription className="text-slate-500">
                Preencha os dados do produto para adicionar ao inventário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-300">Nome do Produto</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ex: iPhone 16 Pro Max"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku" className="text-slate-300">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="Ex: IPH16-PM-256"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-slate-300">Categoria</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0f] border-white/10">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity" className="text-slate-300">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-slate-300">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost" className="text-slate-300">Custo (R$)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newProduct.cost || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier" className="text-slate-300">Fornecedor</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                    placeholder="Ex: Apple Brasil"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="region" className="text-slate-300">Região</Label>
                  <Select
                    value={newProduct.region}
                    onValueChange={(value) => setNewProduct({ ...newProduct, region: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0f] border-white/10">
                      <SelectItem value="Natal/RN">Natal/RN</SelectItem>
                      <SelectItem value="Mossoró/RN">Mossoró/RN</SelectItem>
                      <SelectItem value="Parnamirim/RN">Parnamirim/RN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="hover:bg-white/5">
                Cancelar
              </Button>
              <Button 
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.sku || !newProduct.category}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#0a0a0f] border-white/10 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Editar Produto</DialogTitle>
              <DialogDescription className="text-slate-500">
                Atualize as informações do produto selecionado.
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-white/5">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt={editingProduct.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{editingProduct.name}</p>
                    <p className="text-sm text-slate-500">{editingProduct.sku}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-slate-300">Nome do Produto</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-300">SKU</Label>
                    <Input
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Categoria</Label>
                    <Select
                      value={editingProduct.category}
                      onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                    >
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
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Quantidade</Label>
                    <Input
                      type="number"
                      value={editingProduct.quantity}
                      onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Preço (R$)</Label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Custo (R$)</Label>
                    <Input
                      type="number"
                      value={editingProduct.cost}
                      onChange={(e) => setEditingProduct({ ...editingProduct, cost: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Fornecedor</Label>
                    <Input
                      value={editingProduct.supplier}
                      onChange={(e) => setEditingProduct({ ...editingProduct, supplier: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-300">Região</Label>
                    <Select
                      value={editingProduct.region}
                      onValueChange={(value) => setEditingProduct({ ...editingProduct, region: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0f] border-white/10">
                        <SelectItem value="Natal/RN">Natal/RN</SelectItem>
                        <SelectItem value="Mossoró/RN">Mossoró/RN</SelectItem>
                        <SelectItem value="Parnamirim/RN">Parnamirim/RN</SelectItem>
                      </SelectContent>
                    </Select>
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
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0"
              >
                <Check className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-[#0a0a0f] border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-red-400">Confirmar Exclusão</DialogTitle>
              <DialogDescription className="text-slate-500">
                Esta ação não pode ser desfeita. O produto será removido permanentemente.
              </DialogDescription>
            </DialogHeader>
            {deletingProduct && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 my-4">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-white/5">
                  {deletingProduct.image ? (
                    <img src={deletingProduct.image} alt={deletingProduct.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-slate-600" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">{deletingProduct.name}</p>
                  <p className="text-sm text-slate-500">{deletingProduct.sku} • {deletingProduct.quantity} unidades</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="hover:bg-white/5">
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteProduct}
                className="bg-red-600 hover:bg-red-700 border-0"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
