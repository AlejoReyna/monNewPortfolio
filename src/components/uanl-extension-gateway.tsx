import styles from "./uanl-extension-gateway.module.css";

const features = [
  "SIASE dashboard",
  "Nexus activity widget",
  "Kardex progress",
  "Schedule export",
];

export default function UANLExtensionGateway() {
  return (
    <section className={styles.screen} aria-labelledby="uanl-extension-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>UANL Extension · MV3</p>
          <h2 id="uanl-extension-title" className={styles.title}>
            UANL Interface+
          </h2>
          <p className={styles.lede}>
            A browser extension that modernizes the UANL student portal: cleaner navigation,
            academic progress, Nexus context, and useful student workflows layered over legacy
            SIASE frames.
          </p>

          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>

          <div className={styles.actions}>
            <a className={styles.primary} href="https://uanl-interface.vercel.app" target="_blank" rel="noreferrer">
              View demo
            </a>
            <a className={styles.secondary} href="https://github.com/AlejoReyna/UANLInterface" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>

        <div className={styles.media} aria-label="UANL Interface extension preview">
          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <span />
              <span />
              <span />
              <strong>deimos.dgi.uanl.mx</strong>
              <em>U+</em>
            </div>
            <video autoPlay muted loop playsInline preload="metadata">
              <source src="/preview-siase.mp4" type="video/mp4" />
            </video>
          </div>
          <div className={styles.metrics} aria-hidden="true">
            <span>
              <strong>3</strong>
              frames
            </span>
            <span>
              <strong>MV3</strong>
              extension
            </span>
            <span>
              <strong>UANL</strong>
              palette
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
