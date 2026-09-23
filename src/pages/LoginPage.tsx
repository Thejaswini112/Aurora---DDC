import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  CircleCheckBig,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Mail,
  Radar,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { LogoMark } from "@/components/layout/Logo";

const emailSchema = z.object({
  email: z
    .string()
    .email("Enter a valid work email"),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required"),
  remember: z.boolean().default(false),
});

type EmailValues = z.infer<typeof emailSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

type LoginStep = "email" | "password";

interface ReturnLocation {
  pathname?: string;
  search?: string;
  hash?: string;
}

function getReturnPath(
  state: unknown,
): string {
  if (
    state &&
    typeof state === "object" &&
    "from" in state
  ) {
    const from = (state as {
      from?: ReturnLocation;
    }).from;

    if (from?.pathname) {
      return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
    }
  }

  return "/overview";
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] =
    useState<LoginStep>("email");

  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);
  const [serverError, setServerError] =
    useState<string | null>(null);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm =
    useForm<PasswordValues>({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
        password: "",
        remember: false,
      },
    });

  const handleEmailContinue = (
    values: EmailValues,
  ) => {
    setServerError(null);
    setEmail(values.email);
    setStep("password");
  };

  const handlePasswordSubmit = async (
    values: PasswordValues,
  ) => {
    setServerError(null);
    setSubmitting(true);

    try {
      await login({
        email,
        password: values.password,
        remember: values.remember,
        provider: "email",
      });

      navigate(
        getReturnPath(location.state),
        { replace: true },
      );
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleProviderLogin = async (
    provider:
      | "google"
      | "microsoft"
      | "sso",
  ) => {
    setServerError(null);
    setSubmitting(true);

    try {
      await login({
        email:
          email ||
          "demo.user@aurora-security.com",
        remember: false,
        provider,
      });

      toast.success(
        provider === "google"
          ? "Signed in with Google"
          : provider === "microsoft"
            ? "Signed in with Microsoft"
            : "Enterprise SSO sign-in successful",
        {
          description:
            "Demo authentication is enabled for this prototype.",
        },
      );

      navigate(
        getReturnPath(location.state),
        { replace: true },
      );
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password recovery is a demo flow", {
      description:
        "A real password reset service is not connected to this prototype.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-sidebar p-10 lg:flex xl:p-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--sidebar-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--sidebar-foreground)) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative flex items-center gap-3">
          <LogoMark className="h-9 w-9" />

          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
              Aurora DSI
            </span>

            <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sidebar-muted-foreground">
              Data Security Intelligence
            </span>
          </div>
        </div>

        <div className="relative max-w-md space-y-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="space-y-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-muted/40 px-3 py-1 text-xs font-medium text-sidebar-foreground/80">
              <Fingerprint className="h-3.5 w-3.5 text-primary" />
              Discover · Classify · Protect
            </span>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-sidebar-foreground xl:text-[2.5rem]">
              See every sensitive asset. Decide with confidence.
            </h1>

            <p className="text-[15px] leading-relaxed text-sidebar-muted-foreground">
              Aurora continuously discovers and classifies sensitive data across your cloud, SaaS, and on-premises repositories — surfacing exposure before it becomes a breach.
            </p>
          </motion.div>

          <div className="space-y-3">
            {[
              {
                icon: Radar,
                title: "Continuous discovery",
                body: "Scan connected repositories and surface sensitive assets.",
              },
              {
                icon: ScrollText,
                title: "Policy enforcement",
                body: "Understand exposure and decide how it should be handled.",
              },
              {
                icon: CircleCheckBig,
                title: "Audit-ready posture",
                body: "Map exposure to PCI-DSS, GDPR, and SOC 2.",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                }}
                className="flex items-start gap-3 rounded-xl border border-sidebar-border bg-sidebar-muted/30 p-3.5 backdrop-blur-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {feature.title}
                  </p>

                  <p className="text-xs text-sidebar-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-sidebar-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enterprise security
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Protected access
          </span>

          <span>© 2026 Aurora Security, Inc.</span>
        </div>
      </div>

      {/* Login panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <LogoMark className="h-8 w-8" />

            <span className="text-lg font-semibold tracking-tight text-foreground">
              Aurora DSI
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>

            <p className="text-sm text-muted-foreground">
              Sign in to access your Aurora workspace.
            </p>
          </div>

          {step === "email" ? (
            <form
              onSubmit={emailForm.handleSubmit(
                handleEmailContinue,
              )}
              className="mt-8 space-y-5"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[13px] font-medium text-foreground"
                >
                  Work email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    {...emailForm.register("email")}
                    className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="you@company.com"
                  />
                </div>

                {emailForm.formState.errors.email && (
                  <p className="text-xs text-danger">
                    {
                      emailForm.formState.errors
                        .email.message
                    }
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  or continue with
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    handleProviderLogin("google")
                  }
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-input bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                >
                  <span className="font-semibold">
                    G
                  </span>
                  Google
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    handleProviderLogin("microsoft")
                  }
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-input bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                >
                  <Building2 className="h-4 w-4" />
                  Microsoft
                </button>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  handleProviderLogin("sso")
                }
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-input bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" />
                Continue with Enterprise SSO
              </button>

              <p className="pt-2 text-center text-xs leading-relaxed text-muted-foreground">
                Your organization can connect Google Workspace,
                Microsoft Entra ID, or SAML-based enterprise SSO.
              </p>
            </form>
          ) : (
            <form
              onSubmit={passwordForm.handleSubmit(
                handlePasswordSubmit,
              )}
              className="mt-8 space-y-5"
            >
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <span className="truncate text-sm text-foreground">
                    {email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    passwordForm.reset();
                    setServerError(null);
                  }}
                  className="shrink-0 text-xs font-medium text-primary hover:text-primary-hover"
                >
                  Change
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[13px] font-medium text-foreground"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    autoFocus
                    {...passwordForm.register(
                      "password",
                    )}
                    className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-10 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {passwordForm.formState.errors
                  .password && (
                  <p className="text-xs text-danger">
                    {
                      passwordForm.formState.errors
                        .password.message
                    }
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  {...passwordForm.register(
                    "remember",
                  )}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />

                <span className="text-[13px] text-muted-foreground">
                  Keep me signed in
                </span>
              </label>

              {serverError && (
                <div className="rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-2.5 text-xs text-danger">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs text-muted-foreground">
              Secure enterprise access
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3.5 py-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p className="text-xs leading-relaxed text-muted-foreground">
              This Aurora prototype uses mock authentication.
              Google, Microsoft, SSO, and password sign-in are
              simulated locally and do not connect to external
              identity providers.
            </p>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By signing in you agree to Aurora's Terms of Service
            and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}