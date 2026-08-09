export const config = {
  dummyMode: process.env.NEXT_PUBLIC_DUMMY_MODE !== "false", // default true unless explicitly false
  apiBase: process.env.NEXT_PUBLIC_API_BASE || "",
  isProd: process.env.NODE_ENV === "production",
};

export const businessUnits = ["Create", "Connect", "Care", "Banking", "Industry", "Transform"] as const;
export type BusinessUnit = typeof businessUnits[number];
