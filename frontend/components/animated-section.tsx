"use client"

import { motion, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  variants?: Variants
}

export function AnimatedSection({ children, className = "", variants }: AnimatedSectionProps) {
  return (
    <motion.section
      className={className}
      initial="initial"
      animate="animate"
      variants={variants}
    >
      {children}
    </motion.section>
  )
} 