import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type Tab = { path: string; label: string; icon?: React.ReactNode };

export default function NavTabs({ tabs }: { tabs: Tab[] }) {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-16 z-10 bg-bg/85 backdrop-blur-md border-b border-[var(--ring)]">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
        <ul className="flex gap-2 overflow-x-auto py-2">
          {tabs.map(t => {
            const isDashboard = t.path.endsWith('dashboard');
            // Dashboard is only active on exact match, other tabs are active if the path starts with their path.
            const active = isDashboard
                ? pathname === t.path
                : (pathname === t.path || pathname.startsWith(t.path + '/'));

            return (
              <li key={t.path}>
                <Link
                  to={t.path}
                  className={[
                    'inline-flex items-center gap-2 px-3 py-2 rounded-md',
                    'transition-colors text-body font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--blue-500)]',
                    active
                      ? 'text-[var(--blue-800)] bg-[var(--muted)]'
                      : 'text-[var(--subtext)] hover:bg-[var(--muted)] hover:text-[var(--text)]'
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {t.icon}{t.label}
                </Link>
                <div className={[
                  'h-0.5 mt-1 rounded-full',
                  active ? 'bg-[var(--blue-500)]' : 'bg-transparent'
                ].join(' ')} />
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}