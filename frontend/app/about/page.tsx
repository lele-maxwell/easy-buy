'use client'

import { Card } from '@/components/ui/card'
import { Shield, Truck, CreditCard, HeadsetIcon } from 'lucide-react'

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature) => (
          <Card key={feature.title} className="p-6">
            <div className="flex flex-col items-center text-center">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
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