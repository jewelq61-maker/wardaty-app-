interface PartnerCode {
  code: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

interface PartnerConnection {
  partnerId: string;
  mainUserId: string;
  connectedAt: Date;
}

const partnerCodes: Map<string, PartnerCode> = new Map();
const partnerConnections: Map<string, PartnerConnection> = new Map();

const CODE_EXPIRY_HOURS = 24;

function generateCode(): string {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generatePartnerCode(userId: string): { code: string; expiresAt: Date } {
  for (const [code, data] of partnerCodes.entries()) {
    if (data.userId === userId) {
      partnerCodes.delete(code);
    }
  }

  let code = generateCode();
  while (partnerCodes.has(code)) {
    code = generateCode();
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + CODE_EXPIRY_HOURS * 60 * 60 * 1000);

  const partnerCode: PartnerCode = {
    code,
    userId,
    createdAt: now,
    expiresAt,
  };

  partnerCodes.set(code, partnerCode);

  return { code, expiresAt };
}

export function validatePartnerCode(code: string): { valid: boolean; linkedUserId?: string; error?: string } {
  const partnerCode = partnerCodes.get(code);

  if (!partnerCode) {
    return { valid: false, error: "Invalid code" };
  }

  if (new Date() > partnerCode.expiresAt) {
    partnerCodes.delete(code);
    return { valid: false, error: "Code expired" };
  }

  return { valid: true, linkedUserId: partnerCode.userId };
}

export function connectPartner(code: string, partnerId: string): { success: boolean; linkedUserId?: string; error?: string } {
  const validation = validatePartnerCode(code);
  
  if (!validation.valid || !validation.linkedUserId) {
    return { success: false, error: validation.error };
  }

  const connection: PartnerConnection = {
    partnerId,
    mainUserId: validation.linkedUserId,
    connectedAt: new Date(),
  };

  partnerConnections.set(partnerId, connection);
  partnerCodes.delete(code);

  return { success: true, linkedUserId: validation.linkedUserId };
}

export function disconnectPartner(partnerId: string): boolean {
  return partnerConnections.delete(partnerId);
}

export function getPartnerConnection(partnerId: string): PartnerConnection | undefined {
  return partnerConnections.get(partnerId);
}

export function getPartnerSummary(mainUserId: string): {
  cycleDay: number | null;
  phase: string;
  nextPeriodDate: string | null;
  daysUntilNextPeriod: number | null;
  fertileWindow: { start: string; end: string } | null;
  moodTrend: string | null;
  partnerName: string;
} {
  return {
    cycleDay: 14,
    phase: "follicular",
    nextPeriodDate: getNextPeriodDateDemo(),
    daysUntilNextPeriod: 14,
    fertileWindow: getFertileWindowDemo(),
    moodTrend: "good",
    partnerName: "Partner",
  };
}

function getNextPeriodDateDemo(): string {
  const today = new Date();
  today.setDate(today.getDate() + 14);
  return today.toISOString().split("T")[0];
}

function getFertileWindowDemo(): { start: string; end: string } {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() + 7);
  const end = new Date(today);
  end.setDate(end.getDate() + 12);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export function cleanupExpiredCodes(): void {
  const now = new Date();
  for (const [code, data] of partnerCodes.entries()) {
    if (now > data.expiresAt) {
      partnerCodes.delete(code);
    }
  }
}

setInterval(cleanupExpiredCodes, 60 * 60 * 1000);
