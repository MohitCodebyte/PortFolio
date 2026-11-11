import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiCode, FiDownload, FiExternalLink } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import { showToast, triggerClickBurst } from '../three/hooks/useSceneStore';
import Tooltip from './Tooltip';

// Cache HEAD check results so clicks are instantaneous while still verifying on demand
const resumeAvailabilityCache = new Map();

export async function verifyResumeFile(fileUrl) {
  try {
    const res = await fetch(fileUrl, { method: 'HEAD', cache: 'no-cache' });
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    // In a SPA, a missing file might fall back to index.html (text/html)
    const isPdf = res.ok && !contentType.includes('text/html');
    resumeAvailabilityCache.set(fileUrl, isPdf);
    return isPdf;
  } catch {
    resumeAvailabilityCache.set(fileUrl, false);
    return false;
  }
}

export function SingleResumeAction({
  resume,
  compact = false,
  footerMode = false,
  fullWidthMobile = true,
  onActionComplete,
}) {
  const [tiltStyle, setTiltStyle] = useState({});
  const isPurple = resume.color === 'purple';
  const MainIcon = resume.icon === 'chart' ? FiBarChart2 : FiCode;

  useEffect(() => {
    if (!resumeAvailabilityCache.has(resume.file)) {
      verifyResumeFile(resume.file);
    }
  }, [resume.file]);

  const handleMouseMove = (e) => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = (-y / (rect.height / 2)) * 5;
    const rotY = (x / (rect.width / 2)) * 5;
    setTiltStyle({
      transform: `perspective(600px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(
        1
      )}deg) translateY(-2px)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({});
  };

  const handleDownloadClick = async (e) => {
    if (e.clientX && e.clientY) {
      triggerClickBurst(e.clientX, e.clientY, isPurple ? '#a855f7' : '#22d3ee');
    }

    const cached = resumeAvailabilityCache.get(resume.file);
    if (cached === false) {
      e.preventDefault();
      const nowExists = await verifyResumeFile(resume.file);
      if (!nowExists) {
        showToast({
          title: 'Resume file not found',
          message: `Please place ${resume.file.replace('/resumes/', '')} inside public/resumes/.`,
          type: 'error',
        });
        return;
      }
      const tempLink = document.createElement('a');
      tempLink.href = resume.file;
      tempLink.download = resume.downloadName;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    } else if (cached === undefined) {
      e.preventDefault();
      const exists = await verifyResumeFile(resume.file);
      if (!exists) {
        showToast({
          title: 'Resume file not found',
          message: `Please place ${resume.file.replace('/resumes/', '')} inside public/resumes/.`,
          type: 'error',
        });
        return;
      }
      const tempLink = document.createElement('a');
      tempLink.href = resume.file;
      tempLink.download = resume.downloadName;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }

    showToast({
      title: 'Downloading Resume',
      message: `Saving ${resume.downloadName}`,
      type: 'success',
      duration: 3000,
    });

    if (onActionComplete) onActionComplete();
  };

  const handleViewClick = async (e) => {
    if (e.clientX && e.clientY) {
      triggerClickBurst(e.clientX, e.clientY, isPurple ? '#a855f7' : '#22d3ee');
    }

    const cached = resumeAvailabilityCache.get(resume.file);
    if (cached === false) {
      e.preventDefault();
      const exists = await verifyResumeFile(resume.file);
      if (!exists) {
        showToast({
          title: 'Resume file not found',
          message: `Please place ${resume.file.replace('/resumes/', '')} inside public/resumes/.`,
          type: 'error',
        });
        return;
      }
      window.open(resume.file, '_blank', 'noopener,noreferrer');
    }
    if (onActionComplete) onActionComplete();
  };

  const shellStyles = isPurple
    ? 'border-purple-400/45 bg-purple-600/15 hover:bg-purple-600/25 text-purple-100 shadow-[0_0_26px_-6px_rgba(168,85,247,0.5)] hover:shadow-[0_0_34px_-4px_rgba(168,85,247,0.75)]'
    : 'border-cyan-400/45 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 shadow-[0_0_26px_-6px_rgba(34,211,238,0.5)] hover:shadow-[0_0_34px_-4px_rgba(34,211,238,0.75)]';

  const iconTone = isPurple ? 'text-purple-300' : 'text-cyan-300';

  return (
    <div
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-stretch justify-between rounded-full border backdrop-blur-md transition-all duration-200 ${shellStyles} ${
        footerMode
          ? 'w-full lg:w-auto'
          : fullWidthMobile
          ? 'w-full sm:w-auto'
          : 'w-full'
      } ${compact ? 'min-h-[44px] text-xs' : 'min-h-[48px] text-xs sm:text-sm'}`}
    >
      {/* Direct Download Anchor */}
      <a
        href={resume.file}
        download={resume.downloadName}
        onClick={handleDownloadClick}
        className={`group flex-1 inline-flex items-center justify-center sm:justify-start gap-1.5 font-semibold tracking-tight whitespace-nowrap touch-manipulation active:scale-[0.97] transition-transform ${
          footerMode
            ? 'pl-3 pr-2 py-2'
            : compact
            ? 'pl-3.5 pr-2.5 py-2.5'
            : 'pl-4 pr-3 py-3'
        }`}
      >
        <MainIcon
          className={`w-3.5 h-3.5 shrink-0 ${iconTone} transition-transform duration-200 group-hover:scale-110`}
          aria-hidden="true"
        />
        <span>{resume.label}</span>
        <FiDownload
          className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:translate-y-0.5 transition-transform"
          aria-hidden="true"
        />
      </a>

      {/* Secondary "View in new tab" icon button (>= 44x44px tap target) */}
      <Tooltip content={`View ${resume.shortLabel} in new tab`}>
        <a
          href={resume.file}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleViewClick}
          aria-label={`View ${resume.shortLabel} PDF in new tab`}
          className={`inline-flex items-center justify-center min-w-[40px] sm:min-w-[42px] min-h-[44px] border-l border-white/15 hover:bg-white/10 active:bg-white/15 rounded-r-full touch-manipulation transition-colors active:scale-95 ${
            footerMode ? 'px-2.5' : 'px-3'
          }`}
        >
          <FiExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </Tooltip>
    </div>
  );
}

export default function ResumeButtons({
  className = '',
  compact = false,
  footerMode = false,
  onActionComplete,
}) {
  return (
    <div
      className={
        footerMode
          ? `flex flex-col lg:flex-row lg:flex-nowrap items-stretch lg:items-center gap-2.5 w-full lg:w-auto ${className}`
          : `flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto ${className}`
      }
    >
      {siteConfig.resumes.map((resume) => (
        <SingleResumeAction
          key={resume.id}
          resume={resume}
          compact={compact}
          footerMode={footerMode}
          onActionComplete={onActionComplete}
        />
      ))}
    </div>
  );
}
