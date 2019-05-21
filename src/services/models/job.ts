interface JobInterface {
    id?: string,
    employer?: string,
    title?: string,
    startDate?: string
    endDate?: string
    responsibilities?: Array<string>
}

export type Job = keyof JobInterface;
