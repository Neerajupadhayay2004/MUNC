"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("munc-user")
    const savedNotifications = localStorage.getItem("munc-notifications")

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("munc-user")
      }
    }

    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications)
        setNotifications(parsedNotifications)
      } catch (error) {
        console.error("Error parsing saved notifications:", error)
        localStorage.removeItem("munc-notifications")
      }
    }
  }, [])

  const login = async (email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=3b82f6&color=fff`,
    }

    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("munc-user", JSON.stringify(userData))

    addNotification({
      title: "Welcome Back!",
      message: "You have successfully logged in to MUN-C Inventory System.",
      type: "success",
      read: false,
    })

    return { success: true }
  }

  const signup = async (name, email, password) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = {
      id: Date.now().toString(),
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`,
    }

    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("munc-user", JSON.stringify(userData))

    addNotification({
      title: "Account Created!",
      message: "Welcome to MUN-C Inventory System. Your account has been created successfully.",
      type: "success",
      read: false,
    })

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("munc-user")

    addNotification({
      title: "Logged Out",
      message: "You have been successfully logged out.",
      type: "info",
      read: false,
    })
  }

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    setNotifications((prev) => {
      const updated = [newNotification, ...prev].slice(0, 50) // Keep only last 50 notifications
      localStorage.setItem("munc-notifications", JSON.stringify(updated))
      return updated
    })
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif))
      localStorage.setItem("munc-notifications", JSON.stringify(updated))
      return updated
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem("munc-notifications")
  }

  const value = {
    user,
    isAuthenticated,
    notifications,
    login,
    signup,
    logout,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
