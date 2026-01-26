
    export function uuid() {
  // Generate real UUID v4
  const uuid = crypto.randomUUID(); // RFC 4122 v4

  // Remove dashes and convert to base36
  const hex = uuid.replace(/-/g, "");
  const base36 = BigInt("0x" + hex).toString(36);

  // Return last 16 chars (high entropy)
  return base36.slice(-16);
}