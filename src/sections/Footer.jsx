import React from 'react';
import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import ResumeButtons from '../components/ResumeButtons';
import { triggerClickBurst } from '../three/hooks/useSceneStore';

export default function Footer({ onNavigate }) {
  const handleScrollTop = (e) => {
    if (e.clientX && e.clientY) {
      triggerClickBurst(e.clientX, e.clientY, '#22d3ee');
    }
    onNavigate('home');
  };

  return (
    <footer className="relative z-10 mt-12 border-t border-white/10 bg-[#05060d]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-white/10">
          {/* Logo/Name + Compact Resume Buttons (No extra heading or description paragraph) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/40 to-cyan-500/40 border border-purple-400/45 font-display font-bold text-white">
                MK
              </span>
              <div>
                <p className="font-display font-bold text-lg text-white">
                  {siteConfig.name}
                </p>
                <p className="text-xs text-cyan-300">{siteConfig.headline}</p>
              </div>
            </div>

            <ResumeButtons compact />
          </div>

          {/* Nav Links */}
          <ul className="flex flex-wrap items-center gap-4 text-sm">
            {siteConfig.navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.id);
                  }}
                  className="text-zinc-400 hover:text-cyan-300 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Bar: Social Icons, Email, Copyright & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-purple-500/20 border border-white/12 hover:border-purple-400/50 text-zinc-200 hover:text-white transition-all"
            >
              <FiGithub className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-cyan-500/20 border border-white/12 hover:border-cyan-400/50 text-zinc-200 hover:text-white transition-all"
            >
              <FiLinkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label={`Email ${siteConfig.email}`}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-indigo-500/20 border border-white/12 hover:border-indigo-400/50 text-zinc-200 hover:text-white transition-all"
            >
              <FiMail className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-mono-tabular text-zinc-300 hover:text-cyan-300 transition-colors ml-1"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}
            </p>
            <button
              type="button"
              onClick={handleScrollTop}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-gradient-to-r hover:from-purple-600/35 hover:to-cyan-500/35 border border-white/15 hover:border-cyan-400/50 text-xs font-semibold text-white transition-all active:scale-95"
            >
              <span>Back to Top</span>
              <FiArrowUp className="w-3.5 h-3.5 text-cyan-300 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
