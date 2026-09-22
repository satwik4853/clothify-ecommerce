import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export default function Breadcrumb({ crumbs }) {
  // crumbs: [{ label, path }, ...]  — last one is current (no link)
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i > 0 && <FiChevronRight size={12} className="text-gray-400 flex-shrink-0" />}
          {i === crumbs.length - 1 ? (
            <span className="text-primary font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-primary transition-colors">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
