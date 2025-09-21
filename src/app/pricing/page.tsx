"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: [
        "Up to 10 tasks",
        "Basic priority levels",
        "Due date tracking",
        "Task completion",
        "Basic dashboard",
        "Mobile responsive"
      ],
      limitations: [
        "Limited to 10 tasks",
        "No team collaboration",
        "Basic analytics",
        "No integrations"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: { monthly: 9, annual: 90 },
      description: "For power users and small teams",
      features: [
        "Unlimited tasks",
        "Advanced priority levels",
        "Due date tracking",
        "Task completion",
        "Advanced dashboard",
        "Team collaboration (up to 5 members)",
        "Advanced analytics",
        "Email notifications",
        "Task templates",
        "Priority support"
      ],
      limitations: [],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: { monthly: 29, annual: 290 },
      description: "For large teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced team management",
        "Custom integrations",
        "Advanced reporting",
        "API access",
        "Custom branding",
        "Dedicated support",
        "SSO integration",
        "Advanced security"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-8 mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Choose Your Plan
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
                  Unlock the full potential of TaskFlow
                </p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Start free and upgrade as you grow. All plans include our core task management features 
                with additional premium features for power users and teams.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Save 17%
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className="relative group">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-300 ${
                  plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-slate-400 to-slate-600'
                }`}></div>
                
                <Card className={`relative transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'bg-white/90 dark:bg-slate-800/90 border-2 border-blue-200 dark:border-blue-800' 
                    : 'bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50'
                } backdrop-blur-sm rounded-3xl shadow-lg`}>
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {plan.name}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 ml-1">
                          {plan.price.monthly === 0 ? '' : isAnnual ? '/year' : '/month'}
                        </span>
                      </div>
                      {isAnnual && plan.price.monthly > 0 && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          ${Math.round(plan.price.annual / 12)}/month billed annually
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <Button 
                      className={`w-full h-12 rounded-xl font-semibold ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                          : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                      } transition-all duration-200`}
                      variant={plan.buttonVariant}
                    >
                      {plan.buttonText}
                    </Button>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                        What&apos;s included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Feature Comparison
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                See what&apos;s included in each plan
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Features
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Free
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Pro
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {[
                      { feature: "Tasks", free: "10", pro: "Unlimited", enterprise: "Unlimited" },
                      { feature: "Team Members", free: "1", pro: "5", enterprise: "Unlimited" },
                      { feature: "Priority Levels", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
                      { feature: "Analytics", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
                      { feature: "Integrations", free: "None", pro: "Basic", enterprise: "Custom" },
                      { feature: "Support", free: "Community", pro: "Priority", enterprise: "Dedicated" },
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                        <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-100">
                          {row.feature}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-300">
                          {row.free}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-300">
                          {row.pro}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-300">
                          {row.enterprise}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to boost your productivity?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who have transformed their workflow with TaskFlow
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-100 rounded-xl px-8 py-3 font-semibold"
                >
                  <Link href="/">Start Free Trial</Link>
                </Button>
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 rounded-xl px-8 py-3 font-semibold"
                >
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
