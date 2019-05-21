interface EducationInterface {
    id?: string,
    school?: string,
    location?: string,
    isCurrentlyAttending?: boolean,
    graduationDate?: string,
    degree?: string
}

export type Education = keyof EducationInterface;
