import agentsSource from "../../AGENTS.md?raw";

const START_MARKER = "<!-- build-prompt:start -->";
const END_MARKER = "<!-- build-prompt:end -->";

const extractBuildPrompt = (source: string) => {
  const start = source.indexOf(START_MARKER);
  const end = source.indexOf(END_MARKER);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AGENTS.md is missing the build-prompt start/end markers.");
  }

  return source.slice(start + START_MARKER.length, end).trim();
};

export const buildPrompt = extractBuildPrompt(agentsSource);
