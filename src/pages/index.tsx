import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

function GridGraphic() {
  return (
    <svg className={styles.gridGraphic} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      {/* Central hub */}
      <circle cx="200" cy="200" r="8" fill="#3b82f6" />
      
      {/* Radial lines and nodes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 80;
        const y1 = 200 + Math.sin(rad) * 80;
        const x2 = 200 + Math.cos(rad) * 150;
        const y2 = 200 + Math.sin(rad) * 150;
        
        return (
          <g key={i}>
            <line x1="200" y1="200" x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
            <circle cx={x1} cy={y1} r="6" fill="#06b6d4" />
            <circle cx={x2} cy={y2} r="6" fill="#06b6d4" />
          </g>
        );
      })}
      
      {/* Connecting rings */}
      <circle cx="200" cy="200" r="80" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
      <circle cx="200" cy="200" r="150" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.3" />
      
      {/* Animated pulses */}
      <circle cx="200" cy="200" r="30" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.6">
        <animate attributeName="r" from="30" to="100" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Grid-Data-Models</h1>
          <p className={styles.heroSubtitle}>
            A comprehensive platform for grid engineering and management, 
            enabling digital transformation of power distribution systems.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className="button button--primary button--lg"
              to="#value-stack">
              Advancing grid digitalization
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="#value-stack">
              Platform for grid engineering
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="#value-stack">
              Unlocking the value stack for grid data
            </Link>
          </div>
          <div className={styles.partnerSection}>
            <Link
              className="button button--outline"
              to="/contact">
              Partner with Us!
            </Link>
          </div>
        </div>
        <div className={styles.heroGraphic}>
          <GridGraphic />
        </div>
      </div>
    </section>
  );
}

function ValueStackSection() {
  return (
    <section className={styles.contentSection} id="value-stack">
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Value Stack</h2>
        <div className={styles.valueCard}>
          <div className={styles.cardContent}>
            <p className={styles.valueText}>
              <strong>Value Stack → Loss Reduction → Enabling Digital Twin</strong>
            </p>
            <p className={styles.cardBody}>
              GDM enables utilities to unlock the full value stack of their grid data,
              from basic asset management to advanced analytics and digital twin applications.
              By providing a standardized, validated data model, we reduce integration costs
              and accelerate the deployment of grid modernization initiatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Get Hip to New Way to Work with GDM</h2>
        <div className={styles.twoColumnGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Without GDM</h3>
            <div className={styles.cardBody}>
              <ul>
                <li>Exporter databases, not integrated or validated</li>
                <li>Multiple data silos across systems</li>
                <li>Manual data transformation processes</li>
                <li>Inconsistent data quality</li>
                <li>Limited interoperability</li>
              </ul>
            </div>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>With GDM</h3>
            <div className={styles.cardBody}>
              <ul>
                <li>GDM as SQL database ready for production</li>
                <li>Unified data model across platforms</li>
                <li>Automated validation and quality checks</li>
                <li>Standardized schema for all assets</li>
                <li>Seamless integration with analytics tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Plans of GDM and Future Roadmap</h2>
        <div className={styles.twoColumnGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>GDM Today</h3>
            <div className={styles.cardBody}>
              <ul>
                <li>Comprehensive distribution system data model</li>
                <li>Support for major grid formats (OpenDSS, CYME, Synergi)</li>
                <li>SQL database backend with PostGIS support</li>
                <li>Python API for data manipulation</li>
                <li>Time series data management</li>
                <li>Equipment catalog system</li>
              </ul>
            </div>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Future Development to Ensure Success</h3>
            <div className={styles.cardBody}>
              <ul>
                <li>Enhanced transmission system support</li>
                <li>Real-time data streaming capabilities</li>
                <li>Advanced analytics and ML integration</li>
                <li>Cloud-native deployment options</li>
                <li>Expanded interoperability standards</li>
                <li>Enhanced visualization tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapEmbedSection() {
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Bring in your GIS data</h2>
        <p className={styles.sectionDescription}>
          Seamlessly integrate your existing GIS data into the GDM framework. 
          Our platform supports multiple coordinate systems and spatial data formats.
        </p>
        <div className={styles.mapEmbedSection}>
          <div className={styles.mapEmbedContainer}>
            <iframe 
              src="https://clausa.app.carto.com/map/a1c93ac6-2965-43f9-8990-3963415b40ff"
              title="GIS Map Viewer"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SchemaPreviewSection() {
  return (
    <section className={styles.contentSection}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Manage your asset data as a catalogue</h2>
        <p className={styles.sectionDescription}>
          Explore the comprehensive schema documentation with detailed field descriptions,
          types, and constraints for all distribution system components.
        </p>
        <div className={styles.schemaPreview}>
          <div className={styles.schemaPreviewLayout}>
            {/* Mini Sidebar */}
            <div className={styles.previewSidebar}>
              <div className={styles.previewSearch}>
                <span className={styles.searchIcon}>🔍</span>
                <span className={styles.searchPlaceholder}>Search datasets...</span>
              </div>
              <div className={styles.previewNavSection}>
                <div className={styles.previewCategoryLabel}>Equipment</div>
                <div className={styles.previewDatasetList}>
                  <div className={styles.previewDatasetItem}>
                    <span>Distribution Bus</span>
                    <span className={styles.fieldCount}>12</span>
                  </div>
                  <div className={`${styles.previewDatasetItem} ${styles.active}`}>
                    <span>Distribution Transformer</span>
                    <span className={styles.fieldCount}>18</span>
                  </div>
                  <div className={styles.previewDatasetItem}>
                    <span>Distribution Line</span>
                    <span className={styles.fieldCount}>15</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.previewMainContent}>
              <div className={styles.previewHeader}>
                <h3 className={styles.previewTitle}>Distribution Transformer</h3>
                <div className={styles.previewMetadata}>
                  <span><strong>Table:</strong> distribution_transformer</span>
                  <span><strong>Fields:</strong> 18</span>
                </div>
              </div>

              <div className={styles.previewFieldsLabel}>Fields</div>
              <div className={styles.previewFieldGrid}>
                <div className={styles.previewFieldCard}>
                  <div className={styles.previewCardHeader}>
                    <span className={styles.previewFieldName}>rated_power</span>
                    <span className={styles.previewPkBadge}>PK</span>
                  </div>
                  <div className={styles.previewCardBadges}>
                    <span className={styles.previewTypeBadge}>REAL</span>
                    <span className={styles.previewRequiredBadge}>Required</span>
                  </div>
                  <div className={styles.previewFieldDesc}>The rated power of the transformer in kVA</div>
                </div>

                <div className={styles.previewFieldCard}>
                  <div className={styles.previewCardHeader}>
                    <span className={styles.previewFieldName}>rated_voltage</span>
                  </div>
                  <div className={styles.previewCardBadges}>
                    <span className={styles.previewTypeBadge}>REAL</span>
                    <span className={styles.previewRequiredBadge}>Required</span>
                  </div>
                  <div className={styles.previewFieldDesc}>The rated voltage of the transformer primary</div>
                </div>

                <div className={styles.previewFieldCard}>
                  <div className={styles.previewCardHeader}>
                    <span className={styles.previewFieldName}>phase_count</span>
                  </div>
                  <div className={styles.previewCardBadges}>
                    <span className={styles.previewTypeBadge}>INTEGER</span>
                  </div>
                  <div className={styles.previewFieldDesc}>Number of phases in the transformer</div>
                </div>

                <div className={styles.previewFieldCard}>
                  <div className={styles.previewCardHeader}>
                    <span className={styles.previewFieldName}>connection_type</span>
                  </div>
                  <div className={styles.previewCardBadges}>
                    <span className={styles.previewTypeBadge}>TEXT</span>
                  </div>
                  <div className={styles.previewFieldDesc}>Connection configuration (wye, delta, etc.)</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.schemaActions}>
            <Link
              className="button button--primary"
              to="/schema">
              Explore Full Schema Documentation →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.sectionContainer}>
        <h2 className={styles.ctaSectionTitle}>Sign up CTA</h2>
        <p className={styles.ctaDescription}>
          Get started with Grid-Data-Models and transform your grid data management.
        </p>
        <div className={styles.ctaForm}>
          <input 
            type="email" 
            placeholder="Email address input" 
            className={styles.emailInput}
          />
          <button className="button button--primary button--lg">
            Sign up CTA button
          </button>
        </div>
        <div className={styles.navigationHints}>
          <div className={styles.navBox}>Navigation text</div>
          <div className={styles.navBox}>Navigation text</div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Grid-Data-Models"
      description="Platform for grid engineering and management">
      <HeroSection />
      <ValueStackSection />
      <ComparisonSection />
      <RoadmapSection />
      <MapEmbedSection />
      <SchemaPreviewSection />
      <CTASection />
    </Layout>
  );
}
