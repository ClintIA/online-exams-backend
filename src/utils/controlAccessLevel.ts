const accessLevels = {
    patient: 1,
    default: 2,
    doctor: 3,
    marketing: 4,
    admin: 5,
    master: 6
};

export type AccessLevel = keyof typeof accessLevels;

export function hasAccess(userLevel: AccessLevel, requiredLevel: AccessLevel): boolean {
    return accessLevels[userLevel] >= accessLevels[requiredLevel];
}
