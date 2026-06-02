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

export default function ThisCafeteriaGateway() {
  return (
    <section className={styles.screen} aria-labelledby="this-cafeteria-title">
      <div className={styles.content}>
        <p className={styles.eyebrow}>Cafeteria commerce</p>
        <h1 id="this-cafeteria-title" className={styles.title}>
          Artisanal Brew
        </h1>
        <p className={styles.stackLead}>
          A cloud-ready ASP.NET commerce platform for specialty coffee, pairing durable product
          and order flows with Identity access, Blazor interfaces, AWS services, and Ethereum
          Sepolia token payments, staking, and rewards.
        </p>

        <div className={styles.carouselShell} aria-label="Artisanal Brew technical stack">
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
        </div>

        <div className={styles.actions}>
          <a className={styles.cta} href="https://cafe.alexisreyna.dev">
            Visit the cafe
          </a>
          <span className={styles.status}>Clean Architecture · Web3 commerce · AWS-ready backend</span>
        </div>
      </div>
    </section>
  );
}
