import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LifeBuoy,
  BookOpen,
  GraduationCap,
  MessageSquareText,
  Bug,
  ArrowRight,
  Search,
} from 'lucide-react';
import { PageContainer, PageHeader, SectionHeader, SearchInput } from '@/components/common';
import { useState } from 'react';

const resources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Guides on connecting repositories, configuring scans, and writing policies.',
    meta: '120+ articles',
  },
  {
    icon: GraduationCap,
    title: 'Aurora Academy',
    description: 'Self-paced courses on data classification, triage workflows, and compliance mapping.',
    meta: '8 learning paths',
  },
  {
    icon: MessageSquareText,
    title: 'Community forum',
    description: 'Discuss best practices with other security and compliance teams using Aurora.',
    meta: '4.2k members',
  },
  {
    icon: Bug,
    title: 'Report an issue',
    description: 'File a bug or request a feature directly with the Aurora product team.',
    meta: 'Avg. 2-day response',
  },
];

const faqs = [
  {
    q: 'Does Aurora ever remediate issues automatically?',
    a: 'No. Aurora follows the principle "AI Explains. Humans Decide." Every remediation — quarantine, access restriction, credential rotation — requires explicit human approval.',
  },
  {
    q: 'Which connectors are supported?',
    a: 'Aurora supports 40+ connectors including SharePoint, AWS S3, Snowflake, PostgreSQL, Microsoft Exchange, Azure Blob, Google Drive, and on-premises file shares via a deployable gateway.',
  },
  {
    q: 'How are scans scoped?',
    a: 'Scans can be scoped by repository, path prefix, schema, data-class sensitivity threshold, or a saved scan template. Schedules support daily, weekly, and custom cron expressions.',
  },
  {
    q: 'Is my data ever exfiltrated?',
    a: 'Aurora reads metadata and classification signals in-place using your own credentials. Source content is never copied out of your environment for classification.',
  },
];

export function HelpPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredFaqs = query
    ? faqs.filter((f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()))
    : faqs;

  return (
    <PageContainer>
      <PageHeader
        title="Help & Documentation"
        description="Find guides, tutorials, and support resources for getting the most out of Aurora DSI."
        icon={LifeBuoy}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-card"
      >
        <div className="relative px-6 py-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative mx-auto max-w-xl text-center">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">How can we help?</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Search documentation, tutorials, and FAQs.</p>
            <div className="mt-5">
              <SearchInput
                value={query}
                onSearch={setQuery}
                placeholder="Search the help center…"
                containerClassName="mx-auto max-w-md"
                className="h-11"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((r, i) => (
          <motion.button
            key={r.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            onClick={() => navigate('/help')}
            className="group rounded-xl border border-border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background-subtle">
              <r.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
              {r.meta}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </p>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <SectionHeader title="Frequently asked questions" description="Common questions about Aurora DSI." />
          <div className="mt-5 divide-y divide-border">
            {filteredFaqs.map((f) => (
              <div key={f.q} className="py-4 first:pt-0">
                <h4 className="text-sm font-medium text-foreground">{f.q}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="py-8 text-center">
                <Search className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No results for "{query}".</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <SectionHeader title="Contact support" description="We're here to help." />
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-background-subtle p-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Enterprise support</p>
              <p className="mt-1 text-sm font-medium text-foreground">support@aurora-security.io</p>
              <p className="text-xs text-muted-foreground">24/7 · SLA-backed</p>
            </div>
            <div className="rounded-lg border border-border bg-background-subtle p-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dedicated CSM</p>
              <p className="mt-1 text-sm font-medium text-foreground">Marcus Webb</p>
              <p className="text-xs text-muted-foreground">marcus@aurora-security.io</p>
            </div>
            <div className="rounded-lg border border-border bg-background-subtle p-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status page</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems operational
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
