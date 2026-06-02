import styles from "./plebes-project-gateway.module.css";

export default function PlebesProjectGateway() {
  return (
    <section className={styles.screen} aria-labelledby="plebes-project-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="plebes-project-title" className={styles.title}>
            part of the{" "}
            <img className={styles.logoWord} src="/plebeslogo.svg" alt="plebes" />
            project
          </h2>
          <a className={styles.cta} href="https://plebes.xyz" target="_blank" rel="noreferrer">
            Visit plebes.xyz
          </a>
        </div>

        <div className={styles.media}>
          <img src="/mon_frame.png" alt="Mon frame artwork for the Plebes project" />
        </div>
      </div>
    </section>
  );
}
