import { useEffect } from "react";
import "./App.css";
import {
  Cards,
  githubUsername,
  codeRepository,
  slogan,
  heading,
} from "../content";

export default function App() {
  useEffect(() => {
    document.title = heading;
  }, []);
  return (
    <main className="main" style={{ fontFamily: "Inter" }}>
      <div
        className="description animate-enter"
        style={{ "--stagger": "4" } as React.CSSProperties}
      >
        <p>
          "{slogan.words}&nbsp;
          <code className="code">{slogan.hightlight}</code>."
        </p>
        <div>
          <a
            href={`https://github.com/pruthivithejan/${codeRepository}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by Pruthivi Thejan{" "}
            <img
              src="./github.svg"
              alt="Github Logo"
              className="vercelLogo"
              width={24}
              height={24}
            />
          </a>
        </div>
      </div>

      <div className="center animate-enter">
        <div className="thirteen">
          <img
            src={`https://avatars.githubusercontent.com/${githubUsername}`}
            alt="Avatar"
            width={280}
            height={280}
          />
        </div>
      </div>

      <div className="grid">
        {Cards.map((card, index) => {
          return (
            <a
              href={card.href}
              className="card animate-enter"
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              style={{ "--stagger": index } as React.CSSProperties}
            >
              <h2 className="className">
                <img
                  src={`./${card.icon}.svg`}
                  alt="Icon"
                  className="vercelLogo"
                  width={24}
                  height={24}
                />
                {card.title} <span>-&gt;</span>
              </h2>
              <p className="className">{card.description}</p>
            </a>
          );
        })}
      </div>
    </main>
  );
}
