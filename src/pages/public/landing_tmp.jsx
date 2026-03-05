import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  Pill,
  Wallet,
  ClipboardList,
  Lock,
  FileText,
  Activity,
  ArrowRight,
  HeartPulse,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Premium background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-indigo-200/35 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl"
        />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight text-left">
              <div className="text-base font-extrabold tracking-tight text-gray-900">
                KenzaMedLink
              </div>
              <div className="text-xs text-gray-500">
                Your Clinic in Your Pocket
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#modules" className="hover:text-gray-900">
              Modules
            </a>
            <a href="#workflow" className="hover:text-gray-900">
              Workflow
            </a>
            <a href="#trust" className="hover:text-gray-900">
              Trust
            </a>
            <a href="#faq" className="hover:text-gray-900">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
  <button
    onClick={() => navigate("/register")}
    className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 border border-gray-200 bg-white/70 backdrop-blur hover:bg-white transition"
  >
    Register
  </button>

  <button
    onClick={() => navigate("/login")}
    className="rounded-xl px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
  >
    Login
  </button>

  <button
    onClick={() => navigate("/contact")}
    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
  >
    Contact
  </button>
</div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Premium medical workflows, built for speed and clarity
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.06]">
                Your Clinic in Your Pocket
              </h1>

              <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-xl">
                KenzaMedLink connects patients, doctors, labs, and pharmacies in a
                clean, secure system — from consultation to results and digital
                dispensing — with strong access control and audit trails.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
  <button
    onClick={() => navigate("/register")}
    className="rounded-xl bg-white/70 backdrop-blur px-6 py-3 font-semibold text-gray-800 border border-gray-200 hover:bg-white transition"
  >
    Register
  </button>

  <button
    onClick={() => navigate("/login")}
    className="group rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition shadow-sm inline-flex items-center justify-center gap-2"
  >
    Login
    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
  </button>

  <button
    onClick={() => navigate("/about")}
    className="rounded-xl bg-white/70 backdrop-blur px-6 py-3 font-semibold text-gray-800 border border-gray-200 hover:bg-white transition"
  >
    Learn more
  </button>
</div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-600">
                <Badge icon={<Lock className="h-4 w-4" />} text="Secure authentication" />
                <Badge icon={<FileText className="h-4 w-4" />} text="Audit-ready records" />
                <Badge icon={<Activity className="h-4 w-4" />} text="Operational monitoring" />
              </div>

              <p className="mt-6 text-sm text-gray-500">
                By using KenzaMedLink you agree to our{" "}
                <button
                  className="text-blue-700 hover:underline"
                  onClick={() => navigate("/terms")}
                >
                  Terms
                </button>{" "}
                and{" "}
                <button
                  className="text-blue-700 hover:underline"
                  onClick={() => navigate("/privacy")}
                >
                  Privacy Policy
                </button>
                .
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="rounded-3xl border border-gray-100 bg-white/70 backdrop-blur shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Platform overview
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Medical clean + premium SaaS design
                    </div>
                  </div>
                  <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                    NHIS: No (for now)
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <MiniCard icon={<ClipboardList className="h-4 w-4" />} title="Patients" value="Request care" />
                  <MiniCard icon={<Stethoscope className="h-4 w-4" />} title="Doctors" value="Consult + prescribe" />
                  <MiniCard icon={<FlaskConical className="h-4 w-4" />} title="Labs" value="Upload results" />
                  <MiniCard icon={<Pill className="h-4 w-4" />} title="Pharmacy" value="Dispense digitally" />
                  <MiniCard icon={<Wallet className="h-4 w-4" />} title="Payments" value="Automated" />
                  <MiniCard icon={<ShieldCheck className="h-4 w-4" />} title="Governance" value="Audit trails" />
                </div>

                <div className="mt-6 rounded-2xl bg-gray-50/80 border border-gray-100 p-4">
                  <div className="text-sm font-semibold text-gray-800">
                    Workflow snapshot
                  </div>
                  <ol className="mt-2 text-sm text-gray-600 list-decimal pl-5 space-y-1">
                    <li>Register & verify</li>
                    <li>Request consultation</li>
                    <li>Doctor orders investigations / prescription</li>
                    <li>Lab uploads results → doctor reviews</li>
                    <li>Pharmacy dispenses digitally</li>
                  </ol>
                  <div className="mt-3 text-xs text-gray-500">
                    No cashier workflow — everything is digital and automatic.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

{/* Live Platform Counters */}
<section className="mx-auto max-w-6xl px-6 py-10">
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="grid grid-cols-2 md:grid-cols-4 gap-6"
  >
    <Counter number="1,200+" label="Patients" />
    <Counter number="120+" label="Doctors" />
    <Counter number="35+" label="Labs" />
    <Counter number="60+" label="Pharmacies" />
  </motion.div>
</section>

{/* Security Badges */}
<section className="bg-gray-50 border-y border-gray-100">
  <div className="mx-auto max-w-6xl px-6 py-10">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
      className="grid md:grid-cols-4 gap-6"
    >
      <SecurityBadge
        title="Encrypted Data"
        desc="Secure authentication and protected records."
      />
      <SecurityBadge
        title="Audit Trails"
        desc="Every action recorded for accountability."
      />
      <SecurityBadge
        title="Role-Based Access"
        desc="Strict permission control across modules."
      />
      <SecurityBadge
        title="Operational Monitoring"
        desc="System activity tracking and anomaly detection."
      />
    </motion.div>
  </div>
</section>

        {/* Trust strip */}
        <section id="trust" className="mx-auto max-w-6xl px-6 pb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-4"
          >
            <TrustCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Built for accountability"
              desc="Audit trails, role permissions, and controlled workflows."
            />
            <TrustCard
              icon={<Lock className="h-5 w-5" />}
              title="Privacy-first design"
              desc="Strong access control across patient, doctor, lab, and pharmacy roles."
            />
            <TrustCard
              icon={<Activity className="h-5 w-5" />}
              title="Operational clarity"
              desc="Monitoring and structured processes for real facilities."
            />
          </motion.div>
        </section>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Modules
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-gray-600 max-w-3xl leading-relaxed">
            A clean clinical workflow across the entire care journey — designed for speed,
            clarity, and secure collaboration.
          </motion.p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <ModuleCard icon={<ClipboardList className="h-5 w-5" />} title="Patient" desc="Registration, verification, requests, labs, prescriptions, history." />
            <ModuleCard icon={<Stethoscope className="h-5 w-5" />} title="Doctor" desc="Consultation notes, investigations, results review, digital prescriptions." />
            <ModuleCard icon={<FlaskConical className="h-5 w-5" />} title="Labs & Radiology" desc="Accept requests, manage catalog, upload results securely." />
            <ModuleCard icon={<Pill className="h-5 w-5" />} title="Pharmacy" desc="Prescription queue, controlled dispensing, fulfillment tracking." />
            <ModuleCard icon={<Wallet className="h-5 w-5" />} title="Payments (Digital)" desc="Automated flows (no cashier dependency)." />
            <ModuleCard icon={<ShieldCheck className="h-5 w-5" />} title="Audit & Risk" desc="Role-based access, audit logs, disputes, monitoring." />
          </div>
        </motion.div>
      </section>

{/* Platform Architecture (Animated Workflow Diagram) */}
<section className="mx-auto max-w-6xl px-6 py-14">
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={stagger}
  >
    <motion.h2
      variants={fadeUp}
      className="text-2xl md:text-3xl font-extrabold tracking-tight"
    >
      Platform Architecture
    </motion.h2>

    <motion.p variants={fadeUp} className="mt-3 text-gray-600 max-w-3xl">
      KenzaMedLink connects all healthcare participants into a single digital
      workflow — from consultation to investigations, results, and dispensing.
    </motion.p>

    <motion.div variants={fadeUp} className="mt-10">
      <AnimatedWorkflowDiagram />
    </motion.div>
  </motion.div>
</section>

      {/* Workflow */}
      <section id="workflow" className="bg-gray-50/70 border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-extrabold tracking-tight">
              How it works
            </motion.h2>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Step n="01" title="Register & Verify" desc="Patients create accounts and complete verification securely." />
              <Step n="02" title="Request Consultation" desc="Patients request care; doctors consult via the platform." />
              <Step n="03" title="Investigations & Results" desc="Doctors order investigations; labs upload results; doctors review." />
              <Step n="04" title="Digital Prescription" desc="Doctors prescribe digitally; pharmacy receives it instantly." />
              <Step n="05" title="Dispense Digitally" desc="Pharmacy dispenses through controlled access and tracking." />
              <Step n="Future" title="NHIS Support" desc="Not available yet. Planned for the future after approval." />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-extrabold tracking-tight">
            FAQ
          </motion.h2>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Faq
              q="Do patients need to visit the hospital to use KenzaMedLink?"
              a="No. Patients can register, request consultations, and receive prescriptions and lab results through the platform."
            />
            <Faq
              q="Do you support NHIS right now?"
              a="No. NHIS support is not available yet. We plan to add it in the future after approval."
            />
            <Faq
              q="Can patients pay after service?"
              a="No. Pay-after-service is not supported."
            />
            <Faq
              q="Is there a cashier workflow?"
              a="No. The system is designed for digital and automatic payment workflows."
            />
          </div>
        </motion.div>
      </section>
{/* Premium CTA Banner */}
<section className="px-6 pb-16">
  <div className="mx-auto max-w-6xl">
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 shadow-xl"
    >
      {/* glow */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 blur-3xl rounded-full" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Your Clinic in Your Pocket
          </h3>

          <p className="mt-2 text-white/90 max-w-xl">
            KenzaMedLink connects patients, doctors, laboratories and pharmacies
            into one secure digital healthcare workflow.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/register")}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold hover:bg-white/20 transition"
          >
            Login
          </button>
        </div>
      </div>
    </motion.div>
  </div>
</section>

{/* System Status */}
<section className="mx-auto max-w-6xl px-6 py-12">
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="rounded-3xl border border-green-200 bg-green-50 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
  >
    <div className="flex items-center gap-3">
      <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
      <div className="font-semibold text-green-800">
        System Status: All Systems Operational
      </div>
    </div>

    <div className="text-sm text-green-700">
      Last uptime check: {new Date().toLocaleTimeString()}
    </div>
  </motion.div>
</section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} KenzaMedLink. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <FooterLink onClick={() => navigate("/privacy")}>Privacy</FooterLink>
              <FooterLink onClick={() => navigate("/terms")}>Terms</FooterLink>
              <FooterLink onClick={() => navigate("/cookies")}>Cookies</FooterLink>
              <FooterLink onClick={() => navigate("/support")}>Support</FooterLink>
              <FooterLink onClick={() => navigate("/contact")}>Contact</FooterLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- UI bits ---------- */

function Badge({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur px-3 py-1">
      <span className="text-gray-700">{icon}</span>
      <span className="text-gray-700 font-semibold">{text}</span>
    </div>
  );
}

function MiniCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <div className="text-xs font-semibold text-gray-500">{title}</div>
      </div>
      <div className="mt-1 text-sm font-bold text-gray-900">{value}</div>
    </div>
  );
}

function TrustCard({ icon, title, desc }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-6 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-lg font-bold tracking-tight">{title}</div>
      </div>
      <div className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</div>
    </motion.div>
  );
}

function ModuleCard({ icon, title, desc }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-lg font-bold tracking-tight">{title}</div>
      </div>
      <div className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</div>
    </motion.div>
  );
}

function Step({ n, title, desc }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="text-xs font-bold text-blue-700">{n}</div>
      <div className="mt-2 text-lg font-bold tracking-tight text-gray-900">
        {title}
      </div>
      <div className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</div>
    </motion.div>
  );
}

function Faq({ q, a }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="font-bold tracking-tight text-gray-900">{q}</div>
      <div className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</div>
    </motion.div>
  );
}

function FooterLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-gray-900 hover:underline"
    >
      {children}
    </button>
  );
}

function Counter({ number, label }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
      <div className="text-2xl md:text-3xl font-extrabold text-blue-700">
        {number}
      </div>
      <div className="mt-1 text-sm text-gray-600">{label}</div>
    </div>
  );
}

function SecurityBadge({ title, desc }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="text-lg font-bold">{title}</div>
      <div className="mt-2 text-sm text-gray-600">{desc}</div>
    </motion.div>
  );
}

function ArchNode({ label, highlight }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl border p-6 shadow-sm ${
        highlight
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="font-bold">{label}</div>
    </motion.div>
  );
}


function AnimatedWorkflowDiagram() {
  return (
    <div className="relative">
      {/* container */}
      <div className="relative rounded-3xl border border-gray-100 bg-white/70 backdrop-blur shadow-sm p-6 md:p-8 overflow-hidden">
        {/* soft background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(17,24,39,0.08)_1px,transparent_0)] [background-size:28px_28px]" />
        </div>

        {/* SVG Lines + animated pulses */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 260"
          preserveAspectRatio="none"
        >
          {/* gradient for lines */}
          <defs>
            <linearGradient id="lineGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.55)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.25)" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* main path (Patients -> Doctors -> Labs -> Pharmacy -> Platform Core) */}
          <path
            d="M110 130 C 240 130, 240 130, 370 130
               S 500 130, 630 130
               S 760 130, 890 130
               S 1020 130, 1090 130"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#glow)"
            opacity="0.9"
          />

          {/* subtle dashed overlay */}
          <path
            d="M110 130 C 240 130, 240 130, 370 130
               S 500 130, 630 130
               S 760 130, 890 130
               S 1020 130, 1090 130"
            fill="none"
            stroke="rgba(59,130,246,0.35)"
            strokeWidth="2"
            strokeDasharray="7 10"
            strokeLinecap="round"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;120"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* moving pulse 1 */}
          <circle r="7" fill="rgba(59,130,246,0.95)">
            <animateMotion
              dur="2.7s"
              repeatCount="indefinite"
              path="M110 130 C 240 130, 240 130, 370 130
                    S 500 130, 630 130
                    S 760 130, 890 130
                    S 1020 130, 1090 130"
            />
            <animate attributeName="opacity" values="0;1;1;0" dur="2.7s" repeatCount="indefinite" />
          </circle>

          {/* moving pulse 2 (delayed) */}
          <circle r="6" fill="rgba(99,102,241,0.95)">
            <animateMotion
              begin="0.9s"
              dur="3.2s"
              repeatCount="indefinite"
              path="M110 130 C 240 130, 240 130, 370 130
                    S 500 130, 630 130
                    S 760 130, 890 130
                    S 1020 130, 1090 130"
            />
            <animate attributeName="opacity" values="0;1;1;0" dur="3.2s" repeatCount="indefinite" begin="0.9s" />
          </circle>
        </svg>

        {/* nodes */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5 items-center">
          <FlowNode title="Patients" subtitle="Register • Request care" />
          <FlowNode title="Doctors" subtitle="Consult • Order tests" />
          <FlowNode title="Labs" subtitle="Upload results" />
          <FlowNode title="Pharmacy" subtitle="Dispense digitally" />
          <FlowNode
            title="Platform Core"
            subtitle="Audit • Security • Automation"
            highlight
          />
        </div>

        {/* legend / hint */}
        <div className="relative mt-6 text-xs text-gray-500 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          Live workflow signal: Patients → Doctors → Labs → Pharmacy → Platform Core
        </div>
      </div>
    </div>
  );
}

function FlowNode({ title, subtitle, highlight }) {
  return (
    <div
      className={[
        "group relative rounded-2xl border px-5 py-6 text-center shadow-sm transition",
        "hover:shadow-md hover:-translate-y-0.5",
        highlight
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-gray-100 bg-white",
      ].join(" ")}
    >
      {/* hover glow */}
      {!highlight && (
        <div className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 blur-xl bg-blue-200/50 group-hover:opacity-100 transition" />
      )}

      <div className="relative">
        <div className={highlight ? "text-lg font-extrabold" : "text-lg font-bold"}>
          {title}
        </div>
        <div className={highlight ? "mt-1 text-xs text-white/85" : "mt-1 text-xs text-gray-500"}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}