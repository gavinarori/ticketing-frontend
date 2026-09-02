// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/api";
import { ROUTES } from "@/lib/utils/constants";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    try {
      await login(values);
      const redirectTo = searchParams.get("redirect") || ROUTES.events;
      router.push(redirectTo as never);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="fan@example.com"
          {...register("email")}
          className={inputClass(!!errors.email)}
        />
      </Field>

      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className={inputClass(!!errors.password)}
        />
      </Field>

      {formError && (
        <p role="alert" className="rounded-lg bg-[var(--color-flag)]/10 px-3 py-2 text-sm text-[var(--color-flag)]">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="h-11 rounded-full bg-[var(--color-ink)] text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isLoggingIn ? "Signing in\u2026" : "Sign in"}
      </button>

      <p className="text-center text-xs text-[var(--color-ink)]/60">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-medium text-[var(--color-ink)] underline underline-offset-4">
          Create one
        </Link>
      </p>

      <p className="text-center text-[10px] text-[var(--color-ink)]/35">
        Demo account: fan@example.com / password1
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--color-ink)]">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-[var(--color-flag)]">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `h-11 rounded-xl border bg-white/70 px-3.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-sky)] ${
    hasError ? "border-[var(--color-flag)]" : "border-[var(--color-ink)]/12"
  }`;
}