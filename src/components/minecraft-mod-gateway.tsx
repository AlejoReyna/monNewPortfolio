"use client";

import styles from "./minecraft-mod-gateway.module.css";

type MinecraftModGatewayProps = {
  onSeeMore?: () => void;
};

export default function MinecraftModGateway({ onSeeMore }: MinecraftModGatewayProps) {
  return (
    <section className={styles.screen} aria-labelledby="minecraft-mod-title">
      <div className={styles.content}>
        <p className={styles.eyebrow}>Playable Web3 Experiment</p>
        <h2 id="minecraft-mod-title" className={styles.title}>
          Crypto Minecraft Mod
        </h2>
        <button type="button" className={styles.cta} onClick={onSeeMore}>
          See more
        </button>
      </div>
    </section>
  );
}
