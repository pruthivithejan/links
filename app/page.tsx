import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { Cards, githubUsername, codeRepository, slogan } from "./content";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          "{slogan.words}&nbsp;
          <code className={styles.code}>{slogan.hightlight}</code>."
        </p>
        <div>
          <a
            href={`https://github.com/pruthivithejan/${codeRepository}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by Pruthivi Thejan{" "}
            <Image
              src="/github.svg"
              alt="Github Logo"
              className={styles.vercelLogo}
              width={24}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.thirteen}>
          <Image
            src={`https://avatars.githubusercontent.com/${githubUsername}`}
            alt="Avatar"
            width={280}
            height={280}
          />
        </div>
      </div>

      <div className={styles.grid}>
        {Cards.map((card, index) => {
          return (
            <a
              href={card.href}
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              <h2 className={inter.className}>
                <Image
                  src={`/${card.icon}.svg`}
                  alt="Icon"
                  className={styles.vercelLogo}
                  width={24}
                  height={24}
                />
                {card.title} <span>-&gt;</span>
              </h2>
              <p className={inter.className}>{card.description}</p>
            </a>
          );
        })}
      </div>
    </main>
  );
}
