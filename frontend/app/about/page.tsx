'use client'

import { Card } from '@/components/ui/card'
import { Shield, Truck, CreditCard, HeadsetIcon } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    title: 'Secure Shopping',
    description: 'Your security is our priority. Shop with confidence using our secure payment system.',
    icon: Shield
  },
  {
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping to your doorstep. Track your order in real-time.',
    icon: Truck
  },
  {
    title: 'Easy Payments',
    description: 'Multiple payment options available. Secure transactions guaranteed.',
    icon: CreditCard
  },
  {
    title: '24/7 Support',
    description: 'Our customer service team is always ready to help you.',
    icon: HeadsetIcon
  }
]

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Easy Buy</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your trusted destination for quality products and exceptional shopping experience.
          We're committed to providing the best service to our customers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.7, type: 'spring' }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-black/80 border border-slate-800 shadow-2xl rounded-3xl backdrop-blur-md relative overflow-hidden group transition-transform hover:scale-105 hover:shadow-emerald-700/30">
              {/* Glow/gradient circle behind icon */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl z-0" />
              <div className="relative flex flex-col items-center text-center z-10">
                <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-emerald-900/40 shadow-inner border-2 border-emerald-700/30 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-10 h-10 text-emerald-400 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-extrabold mb-2 text-white tracking-tight drop-shadow">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>
        <div className="prose prose-invert mx-auto">
          <p>
            Easy Buy was founded with a simple mission: to make online shopping easy,
            secure, and enjoyable for everyone. We believe that everyone deserves
            access to quality products at competitive prices.
          </p>
          <p>
            Our platform brings together thousands of products from trusted brands,
            all in one convenient place. We carefully curate our selection to ensure
            that you only find the best products that meet our high standards.
          </p>
          <p>
            What sets us apart is our commitment to customer satisfaction. We're not
            just selling products; we're building relationships with our customers
            and creating a community of happy shoppers.
          </p>
        </div>
      </div>
    </div>
  )
} 