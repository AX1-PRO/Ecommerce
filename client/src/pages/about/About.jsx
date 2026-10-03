import React from 'react';
import {Link} from 'react-router'
const AboutUsEcommerce = () => {
  // E-commerce value propositions (instead of team members)
  const features = [
    {
      title: 'Fast & Reliable Shipping',
      description: 'We deliver your orders quickly and safely straight to your doorstep with real-time tracking.',
      icon: '🚚'
    },
    {
      title: '100% Secure Payments',
      description: 'Your transactions are protected with top-tier encryption and industry-standard security.',
      icon: '🔒'
    },
    {
      title: '24/7 Customer Support',
      description: 'Our dedicated support team is always available to assist you with any questions or issues.',
      icon: '💬'
    },
    {
      title: 'Easy Returns & Refunds',
      description: 'Not satisfied with your purchase? Enjoy a hassle-free 30-day money-back guarantee.',
      icon: '↺'
    }
  ];

  // Store performance & trust metrics
  const stats = [
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Products Available', value: '10K+' },
    { label: 'Orders Shipped', value: '100K+' },
    { label: 'Customer Rating', value: '4.9 ★' }
  ];

  // Brand Core Pillars
  const values = [
    {
      step: '01',
      title: 'Authenticity & Quality',
      description: 'We partner directly with verified suppliers to guarantee genuine products every time.'
    },
    {
      step: '02',
      title: 'Customer-Centric Approach',
      description: 'Your satisfaction drives everything we do, from product selection to post-purchase service.'
    },
    {
      step: '03',
      title: 'Affordable Excellence',
      description: 'Premium products delivered at competitive prices without compromising quality.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl space-y-4">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-200">About Our Store</span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Your Ultimate Online Shopping Destination</h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-indigo-100 md:text-xl">
            We are dedicated to bringing you top-quality products, unbeatable prices, and a seamless shopping experience from start to finish.
          </p>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-xl md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <span className="block text-3xl font-extrabold text-indigo-600 md:text-4xl">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500 md:text-base">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. E-commerce Features */}
      <section className="mx-auto max-w-6xl space-y-12 px-6 py-16">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Why Shop With Us?</h2>
          <p className="mx-auto max-w-xl text-slate-500">We provide an end-to-end e-commerce experience designed for convenience, security, and trust.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">{feature.icon}</div>
              <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>
              <p className="text-xs leading-relaxed text-slate-600 md:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Brand Values / Mission */}
      <section className="border-t border-slate-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="inline-block border-b-2 border-indigo-600 pb-2 text-3xl font-bold text-slate-900">Our Core Pillars</h2>
            <p className="text-lg leading-relaxed text-slate-600">Founded with a mission to simplify online shopping, we focus on what matters most: reliability, choice, and customer satisfaction.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((val, index) => (
              <div key={index} className="relative space-y-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-8">
                <span className="absolute right-4 top-4 select-none text-5xl font-black text-slate-200/80">{val.step}</span>
                <h3 className="relative z-10 text-xl font-bold text-slate-800">{val.title}</h3>
                <p className="relative z-10 text-sm leading-relaxed text-slate-600">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call to Action (Shop Now) */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="space-y-6 rounded-3xl bg-slate-900 p-10 text-white shadow-2xl flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold">Ready to Start Shopping?</h2>
          <p className="mx-auto max-w-lg text-slate-400">Explore our wide range of products and discover exclusive deals today.</p>
          <Link to={'/products'} className="rounded-xl bg-indigo-600  p-3 font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 ">Explore Products</Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUsEcommerce;
