// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/api";
import { ROUTES } from "@/lib/utils/constants";

export function SignupForm() {
  const { register: registerUser, isRegistering } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>();

  async function onSubmit(values: RegisterInput) {
    setFormError(null);
    const result = registerSchema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue:any) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          setError(field as keyof RegisterInput, { message: issue.message });
        }
      });
      return;
    }

    try {
      await registerUser(result.data);
      router.push(ROUTES.events as never);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <input
            id="firstName"
            autoComplete="given-name"
            {...register("firstName")}
            className={inputClass(!!errors.firstName)}
          />
        </Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <input
            id="lastName"
            autoComplete="family-name"
            {...register("lastName")}
            className={inputClass(!!errors.lastName)}
          />
        </Field>
      </div>

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
          autoComplete="new-password"
          {...register("password")}
          className={inputClass(!!errors.password)}
        />
      </Field>

      <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className={inputClass(!!errors.confirmPassword)}
        />
      </Field>

      {formError && (
        <p role="alert" className="rounded-lg bg-[var(--color-flag)]/10 px-3 py-2 text-sm text-[var(--color-flag)]">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isRegistering}
        className="h-11 rounded-full bg-[var(--color-ink)] text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isRegistering ? "Creating account\u2026" : "Create account"}
      </button>

      <p className="text-center text-xs text-[var(--color-ink)]/60">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-[var(--color-ink)] underline underline-offset-4">
          Sign in
        </Link>
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