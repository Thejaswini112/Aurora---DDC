import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Fingerprint,
  CircleCheckBig,
  Radar,
  ScrollText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { organization } from '@/mock-data';
import { LogoMark } from '@/components/layout/Logo';

const schema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  email: z.string().email('Enter a valid work email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      organization: organization.name,
      email: 'sarah.johnson@acme-financial.com',
      password: '',
      remember: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await login(values);
      navigate('/overview', { replace: true });
    } catch {
      setServerError('Unable to sign in. Please verify your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-sidebar p-10 lg:flex xl:p-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(hsl(var(--sidebar-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--sidebar-foreground)) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">Aurora DSI</span>
            <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sidebar-muted-foreground">
              Data Security Intelligence
            </span>
          </div>
        </div>

        <div className="relative max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
              Aurora continuously discovers and classifies sensitive data across your cloud, SaaS, and
              on-premises repositories — surfacing exposure before it becomes a breach.
            </p>
          </motion.div>

          <div className="space-y-3">
            {[
              { icon: Radar, title: 'Continuous discovery', body: 'Scans run across 40+ connectors without agents.' },
              { icon: ScrollText, title: 'Policy enforcement', body: 'AI explains. Humans decide. Nothing auto-remediates.' },
              { icon: CircleCheckBig, title: 'Audit-ready posture', body: 'Map exposure to PCI-DSS, GDPR, and SOC 2 in real time.' },
            ].map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-start gap-3 rounded-xl border border-sidebar-border bg-sidebar-muted/30 p-3.5 backdrop-blur-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{f.title}</p>
                  <p className="text-xs text-sidebar-muted-foreground">{f.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-sidebar-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> SOC 2 Type II
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> AES-256 at rest
          </span>
          <span>© 2026 Aurora Security, Inc.</span>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight text-foreground">Aurora DSI</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sign in to your workspace</h2>
            <p className="text-sm text-muted-foreground">
              Enter your organization credentials to access Aurora.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="organization" className="text-[13px] font-medium text-foreground">
                Organization
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="organization"
                  type="text"
                  {...register('organization')}
                  className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Your organization name"
                />
              </div>
              {errors.organization && (
                <p className="text-xs text-danger">{errors.organization.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-foreground">
                Work email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-medium text-foreground">
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-primary transition-colors hover:text-primary-hover">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-10 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>

            <label className="flex cursor-pointer items-center gap-2 pt-1">
              <input
                type="checkbox"
                {...register('remember')}
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <span className="text-[13px] text-muted-foreground">Keep me signed in for 30 days</span>
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

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Secure enterprise access</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By signing in you agree to Aurora's Terms of Service and Privacy Policy.
            <br />
            Protected by enterprise SSO — contact your administrator for SAML integration.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
