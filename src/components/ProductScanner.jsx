"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Camera, Package, DollarSign, Warehouse, Truck, Menu } from "lucide-react"

const ProductScanner = ({ products, onClose, onMenuClick }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState("")
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      setError("")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setIsScanning(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const simulateScan = () => {
    // Simulate barcode scanning by randomly selecting a product
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    if (randomProduct) {
      setScannedProduct(randomProduct)
      stopCamera()
    }
  }

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      // Simulate barcode detection after capture
      setTimeout(() => {
        simulateScan()
      }, 1000)
    }
  }

  const resetScanner = () => {
    setScannedProduct(null)
    setError("")
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Product Scanner</h1>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        {!scannedProduct ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scan Product Barcode</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Point your camera at a product barcode to get instant information about price, stock, and shipping
                details.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {!isScanning ? (
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Camera
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} className="w-full h-64 sm:h-80 object-cover" playsInline muted />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-32 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Position barcode here</span>
                      </div>
                    </div>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex space-x-4">
                    <button
                      onClick={captureFrame}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Scan Barcode
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Stop Camera
                    </button>
                  </div>

                  <button
                    onClick={simulateScan}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                  >
                    Demo: Simulate Random Scan
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Product Found!</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Barcode: {scannedProduct.barcode || scannedProduct.sku}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{scannedProduct.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">SKU: {scannedProduct.sku}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Category: {scannedProduct.category} • Brand: {scannedProduct.brand || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Selling Price</p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                          ₹{scannedProduct.sellingPrice?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Warehouse className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">Stock Available</p>
                        <p className="text-lg font-bold text-green-900 dark:text-green-100">
                          {scannedProduct.initialStock || "N/A"} units
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Warehouse</p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                          {scannedProduct.warehouse || "Main Warehouse"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      <div>
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Product Type</p>
                        <p className="text-lg font-bold text-orange-900 dark:text-orange-100 capitalize">
                          {scannedProduct.productType || "Simple"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {scannedProduct.description && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{scannedProduct.description}</p>
                  </div>
                )}

                {scannedProduct.variants && scannedProduct.variants.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Available Variants</h4>
                    <div className="space-y-2">
                      {scannedProduct.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {variant.color} {variant.size} {variant.material}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {variant.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ₹{variant.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{variant.stock} in stock</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={resetScanner}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Scan Another Product
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close Scanner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductScanner
