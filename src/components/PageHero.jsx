/**
 * Reusable Page Hero Component
 * Used across ResourceDirectory, Blog, and Events pages
 * Accepts title, subtitle, and optional className for page-specific styling
 */

import PropTypes from 'prop-types';
import '../css/pageHero.css';

const PageHero = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`page-hero ${className}`}>
      {/* Animated background layers */}
      <div className="page-hero-bg">
        <div className="page-bg-layer page-bg-layer-1"></div>
        <div className="page-bg-layer page-bg-layer-2"></div>
        <div className="page-accent-shape accent-1"></div>
        <div className="page-accent-shape accent-2"></div>
        <div className="page-accent-shape accent-3"></div>
        <div className="page-accent-shape accent-4"></div>
      </div>

      <div className="page-hero-content">
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
        <div className="page-hero-accent"></div>
      </div>
    </div>
  );
};

PageHero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default PageHero;
