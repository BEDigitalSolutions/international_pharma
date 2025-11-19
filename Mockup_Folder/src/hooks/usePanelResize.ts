import { useState, useEffect } from 'react'

interface UsePanelResizeOptions {
  initialLeft?: number
  initialCenter?: number
  minLeft?: number
  maxLeft?: number
  minCenter?: number
  maxCenter?: number
}

export function usePanelResize({
  initialLeft = 200,
  initialCenter = 400,
  minLeft = 160,
  maxLeft = 400,
  minCenter = 260,
  maxCenter = 800,
}: UsePanelResizeOptions = {}) {
  const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeft)
  const [centerPanelWidth, setCenterPanelWidth] = useState(initialCenter)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingCenter, setIsResizingCenter] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(minLeft, Math.min(maxLeft, e.clientX))
        setLeftPanelWidth(newWidth)
      }
      if (isResizingCenter) {
        const newWidth = Math.max(
          minCenter,
          Math.min(maxCenter, e.clientX - leftPanelWidth),
        )
        setCenterPanelWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
      setIsResizingCenter(false)
    }

    if (isResizingLeft || isResizingCenter) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizingLeft, isResizingCenter, leftPanelWidth, minLeft, maxLeft, minCenter, maxCenter])

  return {
    leftPanelWidth,
    centerPanelWidth,
    isResizingLeft,
    isResizingCenter,
    setIsResizingLeft,
    setIsResizingCenter,
  }
}

