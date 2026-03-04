import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="统一 URL，推送到 100+ 通知渠道">
      {/* 使用 homeWrapper 包装，实现垂直居中布局 */}
      <div className={styles.homeWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.heroContainer}>
            <h1 className={styles.title}>{siteConfig.title}</h1>
            <p className={styles.subtitle}>
              极简、无服务器、一次接入覆盖 100+ 通知渠道
            </p>

            <div className={styles.actions}>
              <Link className={styles.primaryBtn} to="/docs/QuicSet">
                快速开始
              </Link>
            </div>
          </div>
          
          <HomepageFeatures/>
        </main>
      </div>
    </Layout>
  );
}