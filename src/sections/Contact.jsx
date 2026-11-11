import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FiMail,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { siteConfig } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import Button3D from '../components/Button3D';
import { showToast, triggerClickBurst } from '../three/hooks/useSceneStore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

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

      setStatus('success');
      showToast({
        title: 'Message Sent!',
        message: 'Thank you for reaching out.',
        type: 'success',
      });
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch {
      openMailtoFallback();
      setStatus('success');
      showToast({
        title: 'Opened Mail Client Fallback',
        message: `Opened direct mailto:${siteConfig.email}.`,
        type: 'info',
      });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="contact-heading"
        title="Contact"
        highlight="Me"
        subtitle="Reach out for Data Science and Python Developer opportunities."
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Direct Contact Channels */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col justify-between gap-6"
        >
          <GlassCard
            glow="purple"
            maxTilt={5}
            className="h-full"
            innerClassName="p-6 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div>
              <h3 className="font-display text-2xl font-bold text-white mb-5">
                Direct Channels
              </h3>

              <div className="space-y-3.5">
                {/* Direct Email Card */}
                <a
                  href={`mailto:${siteConfig.email}`}
                  onClick={(e) =>
                    triggerClickBurst(e.clientX, e.clientY, '#22d3ee')
                  }
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/45 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 group-hover:scale-105 transition-transform">
                    <FiMail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-400">
                      Direct Email
                    </p>
                    <p className="font-mono-tabular text-sm font-semibold text-white truncate">
                      {siteConfig.email}
                    </p>
                  </div>
                </a>

                {/* LinkedIn Card */}
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    triggerClickBurst(e.clientX, e.clientY, '#a855f7')
                  }
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] hover:bg-purple-500/15 border border-white/10 hover:border-purple-400/45 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
                    <FiLinkedin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-400">LinkedIn</p>
                    <p className="text-sm font-semibold text-white truncate">
                      linkedin.com/in/MohitCodebyte
                    </p>
                  </div>
                </a>

                {/* GitHub Card */}
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    triggerClickBurst(e.clientX, e.clientY, '#22d3ee')
                  }
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-400/45 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 group-hover:scale-105 transition-transform">
                    <FiGithub className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-400">GitHub</p>
                    <p className="text-sm font-semibold text-white truncate">
                      github.com/MohitCodebyte
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <FiMapPin className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                {siteConfig.location}
              </span>
              <span className="text-emerald-300 font-medium">
                Remote / Hybrid / Onsite
              </span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Right: Glass 3D Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <GlassCard
            glow="cyan"
            tilt={false}
            innerClassName="p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name Field */}
                <div className="flex flex-col gap-2">
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
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'error-name' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-500 transition-colors focus:bg-white/[0.07] ${
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

                {/* Email Field */}
                <div className="flex flex-col gap-2">
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
                    required
                    autoComplete="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'error-email' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-500 transition-colors focus:bg-white/[0.07] ${
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

              {/* Message Field */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
                >
                  Message <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'error-message' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-zinc-500 transition-colors focus:bg-white/[0.07] resize-y ${
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

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <Button3D
                  type="submit"
                  variant="primary"
                  icon={FiSend}
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto min-w-[190px]"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </Button3D>

                {status === 'success' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                    <FiCheckCircle className="w-4 h-4" aria-hidden="true" />
                    Message sent!
                  </span>
                )}
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
