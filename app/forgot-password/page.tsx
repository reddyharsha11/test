"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-dark-0 px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <div className="bg-white dark:bg-surface-dark-100 rounded-3xl p-8 shadow-card">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-brand-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Forgot password?</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your email and we&apos;ll send a reset link</p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <p className="text-5xl mb-3">📨</p>
              <p className="font-bold text-gray-900 dark:text-white">Check your email!</p>
              <p className="text-sm text-gray-500 mt-1">We&apos;ve sent a password reset link.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <Button type="submit" fullWidth loading={isSubmitting} icon={<Send className="w-4 h-4" />} iconPosition="right">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
