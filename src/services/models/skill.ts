interface SkillInterface {
    id?: string,
    name?: string,
    description?: string,
    monthsOfExperience?: number
    dateLastUsed?: string
}

export type Skill = keyof SkillInterface;
