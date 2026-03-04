import type {ReactNode} from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: ReactNode;
  description: ReactNode;
  link?: string;
  linkLabel?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '一键部署',
    icon: (
      /* Zap / Lightning Icon */
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    description: (
      <>
        无需服务器，点击按钮即可免费部署至 <strong>Vercel</strong>。开箱即用，免去运维烦恼。
      </>
    ),
    link: 'https://vercel.com/new/clone?repository-url=https://github.com/sinspired/apprise_vercel',
    linkLabel: 'Deploy to Vercel'
  },
  {
    title: '全渠道通知',
    icon: (
      /* Bell / Notification Icon */
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    ),
    description: (
      <>
        原生支持 Telegram、钉钉、企微、邮件等 <code>100+</code> 渠道。配置简单，只需一个 URL。
      </>
    ),
    link: '/docs/QuicSet',
    linkLabel: '查看支持列表'
  },
  {
    title: '极简 API',
    icon: (
      /* Terminal / Code Icon */
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
    ),
    description: (
      <>
        仅需简单的 <strong>POST</strong> 请求。支持 Text、Markdown、HTML 多种格式，响应极速。
      </>
    ),
  },
];

function Feature({title, icon, description, link, linkLabel}: FeatureItem) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>{icon}</div>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <p className={styles.cardDesc}>{description}</p>
      {link && (
        <a className={styles.cardLink} href={link} target={link.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
          {linkLabel} <span className={styles.arrow}>→</span>
        </a>
      )}
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className={styles.grid}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}