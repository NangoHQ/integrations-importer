interface EnvEntry {
  name: string;
  value: string;
}

export const getEnv = (env: EnvEntry[] | null, name: string) => {
  return env?.find((v) => v.name === name)?.value;
};

