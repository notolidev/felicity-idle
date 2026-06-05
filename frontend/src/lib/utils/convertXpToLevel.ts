import { xpToLevelTable } from "../data/xpToLevelTable";

export default function convertXpToLevel(userXp: number) {
    let userLevel = 0;
    let currentLevelXp = 0;

    for (const [tableLevel, tableExperience] of xpToLevelTable.entries()) {
        if (userXp < tableExperience) {
            break;
        }
        userLevel = tableLevel;
        currentLevelXp = tableExperience;
    }

    return {
        userLevel,
        xpIntoLevel: userXp - currentLevelXp,
    };
}
