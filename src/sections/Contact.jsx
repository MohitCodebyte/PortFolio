import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FiMail,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { siteConfig } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import Button3D from '../components/Button3D';
import {
  showToast,
  triggerClickBurst,
  triggerPaperPlaneLaunch,
} from '../three/hooks/useSceneStore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [planeFlying, setPlaneFlying] = useState(false);
  const [orbTilt, setOrbTilt] = useState({ x: 0, y: 0 });
  const submitBtnWrapRef = useRef(null);

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message (at least 10 characters).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === 'success' || status === 'error') {
      setStatus('idle');
    }
  };

  const openMailtoFallback = () => {
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${formData.name.trim()}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  const fireSuccessEffects = () => {
    triggerPaperPlaneLaunch();
    setPlaneFlying(true);
    setTimeout(() => setPlaneFlying(false), 2200);

    if (submitBtnWrapRef.current) {
      const rect = submitBtnWrapRef.current.getBoundingClientRect();
      triggerClickBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        '#22d3ee'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) return;

    if (!validate()) {
      showToast({
        title: 'Validation Error',
        message: 'Please check the highlighted form fields.',
        type: 'error',
      });
      return;
    }

    setStatus('submitting');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const hasValidEnv =
      serviceId &&
      templateId &&
      publicKey &&
      !serviceId.includes('your_') &&
      !templateId.includes('your_') &&
      !publicKey.includes('your_');

    if (!hasValidEnv) {
      fireSuccessEffects();
      openMailtoFallback();
      setStatus('success');
      showToast({
        title: 'Opening Email Client',
        message: `Pre-filled email to ${siteConfig.email} ready to send.`,
        type: 'success',
      });
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          reply_to: formData.email.trim(),
          to_email: siteConfig.email,
          message: formData.message.trim(),
        },
        { publicKey }
      );

      fireSuccessEffects();
      setStatus('success');
      showToast({
        title: 'Message Sent!',
        message: 'Thank you for reaching out.',
        type: 'success',
      });
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch {
      fireSuccessEffects();
      openMailtoFallback();
      setStatus('success');
      showToast({
        title: 'Opened Mail Client Fallback',
        message: `Opened direct mailto:${siteConfig.email}.`,
        type: 'info',
      });
    }
  };

  const handleOrbPointerMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
    setOrbTilt({ x: nx, y: ny });
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="contact-heading"
        title="Contact"
        highlight="Me"
        subtitle="Available for Data Science and Python roles."
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch perspective-1000">
        {/* Form First on Mobile (order-1 lg:order-2), Right Column on Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 22, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="order-1 lg:order-2 lg:col-span-7"
        >
          <GlassCard glow="cyan" tilt={false} innerClassName="p-5 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              {/* Hidden Spam Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-honeypot">
                  Do not fill this out if you are human
                </label>
                <input
                  id="contact-honeypot"
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Name Field (Focus = Glow + 3D Depth Lift) */}
                <div className="flex flex-col gap-2 transition-transform duration-200 focus-within:-translate-y-0.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
                  >
                    Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    inputMode="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'error-name' : undefined}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/[0.04] border text-base text-white placeholder-zinc-500 transition-all duration-200 focus:bg-white/[0.07] focus:shadow-[0_10px_28px_-8px_rgba(34,211,238,0.45)] ${
                      errors.name
                        ? 'border-rose-500/70'
                        : 'border-white/12 focus:border-cyan-400'
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="error-name"
                      className="inline-flex items-center gap-1 text-xs text-rose-400"
                    >
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field (Focus = Glow + 3D Depth Lift) */}
                <div className="flex flex-col gap-2 transition-transform duration-200 focus-within:-translate-y-0.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
                  >
                    Email <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    required
                    autoComplete="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'error-email' : undefined}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/[0.04] border text-base text-white placeholder-zinc-500 transition-all duration-200 focus:bg-white/[0.07] focus:shadow-[0_10px_28px_-8px_rgba(34,211,238,0.45)] ${
                      errors.email
                        ? 'border-rose-500/70'
                        : 'border-white/12 focus:border-cyan-400'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="error-email"
                      className="inline-flex items-center gap-1 text-xs text-rose-400"
                    >
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Message Field (Focus = Glow + 3D Depth Lift) */}
              <div className="flex flex-col gap-2 transition-transform duration-200 focus-within:-translate-y-0.5">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
                >
                  Message <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-base text-white placeholder-zinc-500 transition-all duration-200 focus:bg-white/[0.07] focus:shadow-[0_10px_28px_-8px_rgba(34,211,238,0.45)] resize-y ${
                    errors.message
                      ? 'border-rose-500/70'
                      : 'border-white/12 focus:border-cyan-400'
                  }`}
                />
                {errors.message && (
                  <p
                    id="error-message"
                    className="inline-flex items-center gap-1 text-xs text-rose-400"
                  >
                    <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <div
                ref={submitBtnWrapRef}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1"
              >
                <Button3D
                  type="submit"
                  variant="primary"
                  icon={FiSend}
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto min-w-[200px] min-h-[48px] h-12"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </Button3D>

                {status === 'success' && (
                  <span className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-300 shrink-0">
                    <FiCheckCircle className="w-4 h-4" aria-hidden="true" />
                    Message sent!
                  </span>
                )}
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Left Column on Desktop (order-2 lg:order-1): Interactive 3D Orb/Paper Plane + 3 Direct Link Rows */}
        <motion.div
          initial={{ opacity: 0, y: 22, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="order-2 lg:order-1 lg:col-span-5"
        >
          <GlassCard
            glow="purple"
            maxTilt={5}
            onPointerMove={handleOrbPointerMove}
            onPointerLeave={() => setOrbTilt({ x: 0, y: 0 })}
            className="h-full"
            innerClassName="p-5 sm:p-8 flex flex-col justify-between gap-5"
          >
            {/* Interactive Mouse-Reactive 3D Sphere + Orbiting Ring + Paper Plane Stage */}
            <div
              aria-hidden="true"
              className="relative w-full h-36 sm:h-40 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16)_0%,rgba(168,85,247,0.1)_48%,transparent_75%)] border border-white/10 overflow-hidden flex items-center justify-center perspective-1000"
            >
              <div
                style={{
                  transform: `rotateX(${(-orbTilt.y).toFixed(1)}deg) rotateY(${orbTilt.x.toFixed(
                    1
                  )}deg)`,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-24 h-24 flex items-center justify-center transition-transform duration-150 ease-out"
              >
                {/* Glowing Core Sphere */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/40 via-indigo-500/40 to-purple-600/50 border border-cyan-300/50 shadow-[0_0_32px_rgba(34,211,238,0.55),inset_0_0_16px_rgba(168,85,247,0.6)]" />

                {/* Orbiting Neon Ring */}
                <div
                  style={{ transform: 'rotateX(68deg) rotateY(-18deg)' }}
                  className="absolute w-28 h-28 rounded-full border-2 border-purple-400/55 shadow-[0_0_18px_rgba(168,85,247,0.5)] animate-spin"
                />

                {/* 3D Paper Plane (Flies off on successful form send!) */}
                <motion.div
                  animate={
                    planeFlying
                      ? {
                          x: [0, 140, 260],
                          y: [0, -70, -140],
                          scale: [1, 1.25, 0.2],
                          opacity: [1, 1, 0],
                          rotate: -28,
                        }
                      : {
                          x: [0, 6, 0, -6, 0],
                          y: [0, -5, 0, 5, 0],
                          rotate: [-8, -2, -8],
                          scale: 1,
                          opacity: 1,
                        }
                  }
                  transition={
                    planeFlying
                      ? { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  }
                  className="absolute -top-1 -right-3 w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-300/60 backdrop-blur-md flex items-center justify-center text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.75)]"
                >
                  <FiSend className="w-4 h-4" />
                </motion.div>
              </div>
            </div>

            {/* 3 Direct Channel Rows (Email, LinkedIn, GitHub) */}
            <div className="space-y-3">
              {/* Direct Email Row */}
              <a
                href={`mailto:${siteConfig.email}`}
                onClick={(e) =>
                  triggerClickBurst(e.clientX, e.clientY, '#22d3ee')
                }
                className="group w-full min-h-[60px] flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-cyan-500/15 active:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/45 touch-manipulation transition-all active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 group-hover:scale-105 transition-transform">
                  <FiMail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-400">
                    Direct Email
                  </p>
                  <p className="font-mono-tabular text-sm font-semibold text-white truncate">
                    {siteConfig.email}
                  </p>
                </div>
              </a>

              {/* LinkedIn Row */}
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  triggerClickBurst(e.clientX, e.clientY, '#a855f7')
                }
                className="group w-full min-h-[60px] flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-purple-500/15 active:bg-purple-500/20 border border-white/10 hover:border-purple-400/45 touch-manipulation transition-all active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
                  <FiLinkedin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-400">LinkedIn</p>
                  <p className="text-sm font-semibold text-white truncate">
                    linkedin.com/in/MohitCodebyte
                  </p>
                </div>
              </a>

              {/* GitHub Row */}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  triggerClickBurst(e.clientX, e.clientY, '#22d3ee')
                }
                className="group w-full min-h-[60px] flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-indigo-500/15 active:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/45 touch-manipulation transition-all active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 group-hover:scale-105 transition-transform">
                  <FiGithub className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-400">GitHub</p>
                  <p className="text-sm font-semibold text-white truncate">
                    github.com/MohitCodebyte
                  </p>
                </div>
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
