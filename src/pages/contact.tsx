import React from 'react';
import Layout from '@theme/Layout';
import styles from './contact.module.css';

export default function Contact(): JSX.Element {
  return (
    <Layout
      title="Contact Us"
      description="Get in touch with the Grid-Data-Models team">
      <div className={styles.contactPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Contact Us</h1>
          <p className={styles.pageDescription}>
            Interested in partnering with us or learning more about Grid-Data-Models? 
            We'd love to hear from you.
          </p>
          
          <div className={styles.contactCard}>
            <div className={styles.contactInfo}>
              <h2>Get in Touch</h2>
              <p>
                Grid-Data-Models is developed at the National Renewable Energy Laboratory (NREL)
                as part of our commitment to advancing grid modernization and renewable energy integration.
              </p>
              
              <div className={styles.infoSection}>
                <h3>🔗 Resources</h3>
                <ul>
                  <li>
                    <a href="https://github.com/NREL/grid-data-models" target="_blank" rel="noopener noreferrer">
                      GitHub Repository
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nrel.gov" target="_blank" rel="noopener noreferrer">
                      NREL Website
                    </a>
                  </li>
                </ul>
              </div>
              
              <div className={styles.infoSection}>
                <h3>💼 Partnership Opportunities</h3>
                <p>
                  We're actively seeking partnerships with utilities, technology providers,
                  and research institutions to advance grid data standards and interoperability.
                </p>
              </div>
              
              <div className={styles.infoSection}>
                <h3>📧 Contact Form</h3>
                <p className={styles.note}>
                  Contact form functionality to be implemented. For now, please reach out through
                  GitHub Issues or the NREL website contact forms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
