import { motion } from "framer-motion";
import styles from "./this-cafeteria-gateway.module.css";

const simpleIcon = (slug: string, color: string) => `https://cdn.simpleicons.org/${slug}/${color}`;

const techStack = [
  { label: ".NET 10", logo: simpleIcon("dotnet", "512BD4") },
  { label: "ASP.NET Core", logo: simpleIcon("dotnet", "512BD4") },
  { label: "Blazor", logo: simpleIcon("blazor", "512BD4") },
  { label: "PostgreSQL", logo: simpleIcon("postgresql", "4169E1") },
  {
    label: "AWS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  },
  { label: "Ethereum", logo: simpleIcon("ethereum", "3C3C3D") },
  { label: "Solidity", logo: simpleIcon("solidity", "363636") },
  { label: "Docker", logo: simpleIcon("docker", "2496ED") },
  { label: "Nginx", logo: simpleIcon("nginx", "009639") },
  { label: "GitHub", logo: simpleIcon("github", "181717") },
];

export default function ThisCafeteriaGateway({ isActive = false }: { isActive?: boolean }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 1.1 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className={styles.screen} aria-labelledby="this-cafeteria-title">
      <motion.div 
        className={styles.content}
        variants={container}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
        <motion.h1 id="this-cafeteria-title" className={styles.title} variants={item}>
          Artisanal Brew
        </motion.h1>
        <motion.p className={styles.stackLead} variants={item}>
          A cloud-ready ASP.NET commerce platform for specialty coffee, pairing durable product
          and order flows with Identity access, Blazor interfaces, AWS services, and Ethereum
          Sepolia token payments, staking, and rewards.
        </motion.p>

        <motion.div className={styles.actions} variants={item}>
          <a className={styles.cta} href="https://cafe.alexisreyna.dev">
            Visit the cafe
          </a>
          <span className={styles.status}>Clean Architecture · Web3 commerce · AWS-ready backend</span>
        </motion.div>

        <motion.div className={styles.carouselShell} aria-label="Artisanal Brew technical stack" variants={item}>
          <div className={styles.stackTrack}>
            {techStack.map((item) => (
              <span className={styles.stackChip} key={item.label}>
                <img className={styles.stackLogo} src={item.logo} alt="" aria-hidden="true" />
                <span>{item.label}</span>
              </span>
            ))}
            {techStack.map((item) => (
              <span className={styles.stackChip} key={`${item.label}-duplicate`} aria-hidden="true">
                <img className={styles.stackLogo} src={item.logo} alt="" />
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
