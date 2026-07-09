"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useAuthStore } from "@/store/authStore";
import { useGuideStore } from "@/store/guideStore";
import { useUIStore } from "@/store/uiStore";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, isLoading, setLoading } = useAuthStore();
  const { setCharacterType } = useGuideStore();
  const { addToast } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      // Simulate API call — replace with real API
      await new Promise((r) => setTimeout(r, 1200));
      setUser(
        {
          _id: "user-1",
          name: "Harsha",
          email: data.email,
          characterType: "male",
          xp: 1200,
          streak: 5,
          lastLoginDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          role: "student",
        },
        "mock-jwt-token"
      );
      setCharacterType("male");
      addToast({ type: "success", title: "Welcome back! 👋", message: "Let's keep learning!" });
      router.push("/onboarding/theme");
    } catch {
      addToast({ type: "error", title: "Login failed", message: "Check your credentials and try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <motion.div
        className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white dark:bg-surface-dark-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white">
              GuideLearn
            </span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Sign in to continue your learning journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="login-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              iconPosition="left"
              {...register("password")}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-brand-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right — Animated Guide */}
      <motion.div
        className="hidden lg:flex flex-1 flex-col items-center justify-center relative bg-gradient-to-br from-brand-500 to-brand-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute bottom-0 -left-10 w-60 h-60 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/3" />
        </div>

        <div className="relative flex flex-col items-center gap-6 text-center px-12">
          {/* Character */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <CharacterRenderer
              characterType="male"
              animation="wave"
              size="xl"
            />
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            className="bg-white/15 backdrop-blur-md rounded-3xl px-8 py-6 border border-white/20 max-w-xs"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <p className="text-white text-xl font-bold leading-relaxed">
              Hi 👋<br />
              I&apos;m your learning guide.
            </p>
            <p className="text-white/80 text-sm mt-2">
              Let&apos;s build amazing skills together.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            {[
              { label: "Learners", value: "50K+" },
              { label: "Lessons", value: "500+" },
              { label: "Modules", value: "30+" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/60 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
