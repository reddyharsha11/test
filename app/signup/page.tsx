"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { setUser, isLoading, setLoading } = useAuthStore();
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setUser(
        {
          _id: "user-new",
          name: data.name,
          email: data.email,
          characterType: "male",
          xp: 0,
          streak: 0,
          lastLoginDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          role: "student",
        },
        "mock-jwt-token"
      );
      addToast({ type: "success", title: "Account created! 🎉", message: "Let's choose your guide!" });
      router.push("/character-select");
    } catch {
      addToast({ type: "error", title: "Signup failed", message: "Please try again." });
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
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white">
              GuideLearn
            </span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Join 50,000+ learners on their journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="signup-name"
              label="Full name"
              placeholder="Alex Johnson"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="signup-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="signup-password"
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              id="signup-confirm"
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirm?.message}
              {...register("confirm")}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="mt-2"
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up you agree to our{" "}
            <span className="text-brand-500 cursor-pointer hover:underline">Terms of Service</span>
          </p>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right — Character */}
      <motion.div
        className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-brand-600 to-brand-500 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${100 + i * 60}px`,
                height: `${100 + i * 60}px`,
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 80}%`,
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-6 text-center px-12">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CharacterRenderer
              characterType="female"
              animation="celebrate"
              size="xl"
            />
          </motion.div>

          <div className="bg-white/15 backdrop-blur-md rounded-3xl px-8 py-6 border border-white/20">
            <p className="text-white text-xl font-bold">
              Start your journey! 🚀
            </p>
            <p className="text-white/75 text-sm mt-2">
              Choose your guide and begin learning with a personal AI companion by your side.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
