// utils/formatters.ts
export const formatId = (id: string, start: number = 6, end: number = 4) => {
  if (!id) return "";
  return `${id.slice(0, start)}...${id.slice(-end)}`;
};

// Specialized wrappers for readability
export const formatUUID = (uuid: string) => formatId(uuid, 8, 6);

export const formatTxHash = (hash: string) => formatId(hash, 10, 8);

export const formatAddress = (address: string) => formatId(address, 6, 6);
