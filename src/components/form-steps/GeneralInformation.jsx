"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Scan, QrCode, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

const GeneralInformation = ({ formData, updateFormData }) => {
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState(null)
  const [generatedQR, setGeneratedQR] = useState("")
  const [scannerType, setScannerType] = useState("barcode") // barcode or qr
  const [detectedCodes, setDetectedCodes] = useState([])
  const [isDetecting, setIsDetecting] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const detectionIntervalRef = useRef(null)

  const useDetectedCode = (code) => {
    if (scannerType === "barcode") {
      updateFormData({ barcode: code })
    } else {
      updateFormData({ ean: code })
    }
    stopBarcodeScanner()
  }

  const simulateBarcodeScan = () => {
    const scannedBarcode = Math.floor(Math.random() * 9000000000000) + 1000000000000
    if (scannerType === "barcode") {
      updateFormData({ barcode: scannedBarcode.toString() })
    } else {
      updateFormData({ ean: scannedBarcode.toString() })
    }
    stopBarcodeScanner()
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [stream])

  useEffect(() => {
    if (formData.barcode) {
      generateQRCode(formData.barcode)
    }
  }, [formData.barcode])

  const handleChange = (field, value) => {
    updateFormData({ [field]: value })

    // Reset certain fields when product type changes
    if (field === "productType") {
      if (value === "simple") {
        updateFormData({
          variants: [],
          bundleItems: [],
          hasVariants: false,
        })
      } else if (value === "bundle") {
        updateFormData({
          variants: [],
          bundleItems: [],
          hasVariants: false,
        })
      } else if (value === "variant") {
        updateFormData({
          bundleItems: [],
          hasVariants: true,
        })
      }
    }
  }

  const generateBarcode = () => {
    const barcode = Math.floor(Math.random() * 9000000000000) + 1000000000000
    handleChange("barcode", barcode.toString())
  }

  const generateSKU = () => {
    const category = formData.category || "GEN"
    const productType = formData.productType || "SIM"
    const randomNum = Math.floor(Math.random() * 9000) + 1000
    const sku = `${category.toUpperCase().slice(0, 3)}-${productType.toUpperCase().slice(0, 3)}-${randomNum}`
    handleChange("sku", sku)
  }

  const generateQRCode = (barcodeNumber) => {
    if (!barcodeNumber) {
      setGeneratedQR("")
      return
    }
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(barcodeNumber)}&bgcolor=ffffff&color=000000&qzone=2&margin=10&format=png`
    setGeneratedQR(qrData)
  }

  const startBarcodeScanner = async (type = "barcode") => {
    setScannerType(type)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setIsScanning(true)
      setShowBarcodeScanner(true)
      setDetectedCodes([])
      startCodeDetection()
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions and try again.")
    }
  }

  const startCodeDetection = () => {
    setIsDetecting(true)
    detectionIntervalRef.current = setInterval(() => {
      // Simulate code detection
      if (Math.random() > 0.7) {
        const detectedCode = Math.floor(Math.random() * 9000000000000) + 1000000000000
        setDetectedCodes((prev) => {
          const newCode = {
            id: Date.now(),
            code: detectedCode.toString(),
            type: scannerType,
            confidence: Math.floor(Math.random() * 30) + 70,
            timestamp: new Date().toLocaleTimeString(),
          }
          return [...prev.slice(-2), newCode] // Keep only last 3 detections
        })
      }
    }, 2000)
  }

  const stopBarcodeScanner = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }
    setIsScanning(false)
    setShowBarcodeScanner(false)
    setIsDetecting(false)
    setDetectedCodes([])
  }

  // Get dynamic fields based on product type
  const getProductTypeFields = () => {
    switch (formData.productType) {
      case "simple":
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-blue-600 text-white">Simple Product</Badge>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              A simple product is a single item without variations. Perfect for basic inventory items.
            </p>
          </motion.div>
        )

      case "variant":
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-purple-600 text-white">Variant Product</Badge>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              A variant product has multiple options like colors, sizes, or materials. Configure variants in step 4.
            </p>
          </motion.div>
        )

      case "bundle":
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-green-600 text-white">Bundle Product</Badge>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              A bundle product contains multiple items sold together as a package deal.
            </p>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full">
        <CardContent className="p-8 space-y-8">
          {/* Item Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Label className="text-base font-semibold text-gray-900 dark:text-white">Item Type</Label>
            <RadioGroup
              value={formData.itemType}
              onValueChange={(value) => handleChange("itemType", value)}
              className="flex space-x-8"
            >
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                <RadioGroupItem value="goods" id="goods" className="w-5 h-5" />
                <Label htmlFor="goods" className="text-base cursor-pointer">
                  Goods
                </Label>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                <RadioGroupItem value="services" id="services" className="w-5 h-5" />
                <Label htmlFor="services" className="text-base cursor-pointer">
                  Services
                </Label>
              </motion.div>
            </RadioGroup>
          </motion.div>

          {/* Product Name and SKU */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-3">
              <Label htmlFor="product-name" className="text-base font-medium">
                {formData.itemType === "services" ? "Service Name" : "Product Name"}
              </Label>
              <Input
                id="product-name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={`Enter ${formData.itemType === "services" ? "Service" : "Product"} Name`}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="sku" className="text-base font-medium">
                SKU
              </Label>
              <div className="flex">
                <Input
                  id="sku"
                  value={formData.sku || ""}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="Enter SKU"
                  className="h-12 text-base rounded-r-none"
                />
                <Button
                  type="button"
                  onClick={generateSKU}
                  variant="outline"
                  className="h-12 rounded-l-none border-l-0 px-4"
                >
                  Generate
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Barcode Section - Only for Goods */}
          {formData.itemType === "goods" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <Label className="text-base font-semibold text-gray-900 dark:text-white">Barcode</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="barcode" className="text-base font-medium">
                    UPC
                  </Label>
                  <div className="flex">
                    <Input
                      id="barcode"
                      value={formData.barcode || ""}
                      onChange={(e) => handleChange("barcode", e.target.value)}
                      placeholder="Enter 13 Digit Code"
                      className="h-12 text-base rounded-r-none"
                    />
                    <Button
                      type="button"
                      onClick={() => startBarcodeScanner("barcode")}
                      variant="outline"
                      className="h-12 rounded-l-none border-l-0 px-4"
                      title="Scan Barcode"
                    >
                      <Scan className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      type="button"
                      onClick={generateBarcode}
                      variant="link"
                      className="text-blue-600 p-0 h-auto text-sm"
                    >
                      Generate Barcode
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ean" className="text-base font-medium">
                    EAN
                  </Label>
                  <div className="flex">
                    <Input
                      id="ean"
                      value={formData.ean || ""}
                      onChange={(e) => handleChange("ean", e.target.value)}
                      placeholder="Enter 13 Digit Code"
                      className="h-12 text-base rounded-r-none"
                    />
                    <Button
                      type="button"
                      onClick={() => startBarcodeScanner("ean")}
                      variant="outline"
                      className="h-12 rounded-l-none border-l-0 px-4"
                    >
                      <Scan className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Generated QR Code Display */}
              <AnimatePresence>
                {generatedQR && formData.barcode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Generated QR Code</h4>
                        <div className="relative">
                          <img
                            src={generatedQR || "/placeholder.svg"}
                            alt="Generated QR Code"
                            className="w-32 h-32 border-2 border-white rounded-lg shadow-lg"
                          />
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-green-600 text-white text-xs">
                              <QrCode className="w-3 h-3 mr-1" />
                              QR
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Barcode:</strong> {formData.barcode}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Product:</strong> {formData.name || "Unnamed Product"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>SKU:</strong> {formData.sku || "No SKU"}
                          </p>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Download QR
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Print Label
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Category and Sub-Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-3">
              <Label htmlFor="category" className="text-base font-medium">
                Category
              </Label>
              <Select value={formData.category || ""} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home-garden">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="sub-category" className="text-base font-medium">
                Sub-Category
              </Label>
              <Select value={formData.subCategory || ""} onValueChange={(value) => handleChange("subCategory", value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="smartphones">Smartphones</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Brand/Manufacturer - Only for Goods */}
          {formData.itemType === "goods" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Label htmlFor="brand" className="text-base font-medium">
                Brand/Manufacturer
              </Label>
              <Select value={formData.brand || ""} onValueChange={(value) => handleChange("brand", value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="samsung">Samsung</SelectItem>
                  <SelectItem value="nike">Nike</SelectItem>
                  <SelectItem value="adidas">Adidas</SelectItem>
                  <SelectItem value="generic">Generic</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {/* Product Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Label className="text-base font-semibold text-gray-900 dark:text-white">Product Type</Label>
            <RadioGroup
              value={formData.productType}
              onValueChange={(value) => handleChange("productType", value)}
              className="flex space-x-8"
            >
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                <RadioGroupItem value="simple" id="simple" className="w-5 h-5" />
                <Label htmlFor="simple" className="text-base cursor-pointer">
                  Simple
                </Label>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                <RadioGroupItem value="variant" id="variant" className="w-5 h-5" />
                <Label htmlFor="variant" className="text-base cursor-pointer">
                  Variant
                </Label>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                <RadioGroupItem value="bundle" id="bundle" className="w-5 h-5" />
                <Label htmlFor="bundle" className="text-base cursor-pointer">
                  Bundle
                </Label>
              </motion.div>
            </RadioGroup>

            {/* Dynamic Product Type Info */}
            <AnimatePresence mode="wait">{getProductTypeFields()}</AnimatePresence>
          </motion.div>

          {/* Service-specific fields */}
          {formData.itemType === "services" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-3">
                <Label htmlFor="service-type" className="text-base font-medium">
                  Service Type
                </Label>
                <Select
                  value={formData.serviceType || ""}
                  onValueChange={(value) => handleChange("serviceType", value)}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time Service</SelectItem>
                    <SelectItem value="recurring">Recurring Service</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Duration</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={formData.duration || ""}
                    onChange={(e) => handleChange("duration", Number.parseInt(e.target.value) || 0)}
                    placeholder="Duration"
                    className="h-12 text-base"
                    min="0"
                  />
                  <Select
                    value={formData.durationUnit || "hours"}
                    onValueChange={(value) => handleChange("durationUnit", value)}
                  >
                    <SelectTrigger className="w-32 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Supplier Information - Only for Goods */}
          {formData.itemType === "goods" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-3">
                <Label htmlFor="supplier" className="text-base font-medium">
                  Select Supplier
                </Label>
                <Select value={formData.supplier || ""} onValueChange={(value) => handleChange("supplier", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier1">Tech Solutions Ltd.</SelectItem>
                    <SelectItem value="supplier2">Global Electronics Co.</SelectItem>
                    <SelectItem value="supplier3">Premium Goods Inc.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="supplier-sku" className="text-base font-medium">
                  Supplier SKU
                </Label>
                <Select
                  value={formData.supplierSku || ""}
                  onValueChange={(value) => handleChange("supplierSku", value)}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sup-001">SUP-TECH-001</SelectItem>
                    <SelectItem value="sup-002">SUP-ELEC-002</SelectItem>
                    <SelectItem value="sup-003">SUP-PREM-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Warehouse/Location - Only for Goods */}
          {formData.itemType === "goods" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-3"
            >
              <Label htmlFor="warehouse" className="text-base font-medium">
                Warehouse/Location
              </Label>
              <Select value={formData.warehouse || ""} onValueChange={(value) => handleChange("warehouse", value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse-a">Main Warehouse - Delhi</SelectItem>
                  <SelectItem value="warehouse-b">Secondary Warehouse - Mumbai</SelectItem>
                  <SelectItem value="warehouse-c">Regional Warehouse - Bangalore</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {/* Advanced Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center justify-between py-6 border-t border-gray-200 dark:border-gray-700"
          >
            <Label htmlFor="advanced-toggle" className="text-base font-semibold text-gray-900 dark:text-white">
              Advance
            </Label>
            <Switch
              id="advanced-toggle"
              checked={isAdvanced}
              onCheckedChange={setIsAdvanced}
              className="data-[state=checked]:bg-blue-600"
            />
          </motion.div>

          {/* Advanced Fields */}
          <AnimatePresence>
            {isAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 pt-4"
              >
                {formData.itemType === "goods" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="lead-time" className="text-base font-medium">
                          Lead Time
                        </Label>
                        <Select
                          value={formData.leadTime || ""}
                          onValueChange={(value) => handleChange("leadTime", value)}
                        >
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-day">1 Day</SelectItem>
                            <SelectItem value="3-days">3 Days</SelectItem>
                            <SelectItem value="1-week">1 Week</SelectItem>
                            <SelectItem value="2-weeks">2 Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="reorder-level" className="text-base font-medium">
                          Reorder Level
                        </Label>
                        <Select
                          value={formData.reorderLevel || ""}
                          onValueChange={(value) => handleChange("reorderLevel", value)}
                        >
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 Units</SelectItem>
                            <SelectItem value="25">25 Units</SelectItem>
                            <SelectItem value="50">50 Units</SelectItem>
                            <SelectItem value="100">100 Units</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="initial-stock" className="text-base font-medium">
                        Initial Stock Quantity
                      </Label>
                      <Input
                        id="initial-stock"
                        type="number"
                        value={formData.initialStock || ""}
                        onChange={(e) => handleChange("initialStock", Number.parseInt(e.target.value) || 0)}
                        placeholder="In No."
                        className="h-12 text-base"
                        min="0"
                      />
                    </div>

                    {/* Track */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold text-gray-900 dark:text-white">Track</Label>
                      <RadioGroup
                        value={formData.track}
                        onValueChange={(value) => handleChange("track", value)}
                        className="flex space-x-8"
                      >
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                          <RadioGroupItem value="serial" id="serial" className="w-5 h-5" />
                          <Label htmlFor="serial" className="text-base cursor-pointer">
                            Serial No.
                          </Label>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                          <RadioGroupItem value="batch" id="batch" className="w-5 h-5" />
                          <Label htmlFor="batch" className="text-base cursor-pointer">
                            Batch No.
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold text-gray-900 dark:text-white">Status</Label>
                      <RadioGroup
                        value={formData.status}
                        onValueChange={(value) => handleChange("status", value)}
                        className="flex space-x-8"
                      >
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-3">
                          <RadioGroupItem value="returnable" id="returnable" className="w-5 h-5" />
                          <Label htmlFor="returnable" className="text-base cursor-pointer">
                            Returnable
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Barcode Scanner Modal */}
          <AnimatePresence>
            {showBarcodeScanner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Live {scannerType === "barcode" ? "Barcode" : "QR Code"} Scanner
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Position the {scannerType} within the scanning area
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={stopBarcodeScanner}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Camera Feed */}
                    <div className="lg:col-span-2">
                      {isScanning && (
                        <div className="relative bg-black rounded-xl overflow-hidden">
                          <video ref={videoRef} className="w-full h-80 object-cover" playsInline muted autoPlay />

                          {/* Scanning Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.8, 1, 0.8],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                              className="w-64 h-40 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center bg-blue-500/10"
                            >
                              <span className="text-white text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                                {scannerType === "barcode" ? "📊 Barcode Zone" : "📱 QR Code Zone"}
                              </span>
                            </motion.div>
                          </div>

                          {/* Status Indicators */}
                          <div className="absolute top-4 left-4 flex space-x-2">
                            <Badge className="bg-red-600 text-white">🔴 Live</Badge>
                            {isDetecting && <Badge className="bg-green-600 text-white">🔍 Detecting</Badge>}
                          </div>

                          {/* Scanning Animation */}
                          <motion.div
                            className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                            animate={{ y: [-100, 100] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          />
                        </div>
                      )}

                      <canvas ref={canvasRef} className="hidden" />

                      {/* Controls */}
                      <div className="flex space-x-3 mt-4">
                        <Button onClick={simulateBarcodeScan} className="flex-1">
                          <Camera className="w-5 h-5 mr-2" />
                          Manual Capture
                        </Button>
                        <Button onClick={simulateBarcodeScan} variant="outline">
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Auto Detect
                        </Button>
                        <Button onClick={stopBarcodeScanner} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>

                    {/* Detection Results */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Detected Codes</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          <AnimatePresence>
                            {detectedCodes.map((detection) => (
                              <motion.div
                                key={detection.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Badge className="bg-green-600 text-white text-xs">
                                    {detection.confidence}% Match
                                  </Badge>
                                  <span className="text-xs text-gray-500">{detection.timestamp}</span>
                                </div>
                                <p className="font-mono text-sm text-gray-900 dark:text-white mb-2">{detection.code}</p>
                                <Button
                                  size="sm"
                                  onClick={() => useDetectedCode(detection.code)}
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  Use This Code
                                </Button>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {detectedCodes.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              <Scan className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No codes detected yet</p>
                              <p className="text-xs">Position {scannerType} in the scanning area</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Scanner Info */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Scanner Tips</h5>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Hold device steady</li>
                          <li>• Ensure good lighting</li>
                          <li>• Keep {scannerType} flat</li>
                          <li>• Wait for auto-detection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default GeneralInformation
