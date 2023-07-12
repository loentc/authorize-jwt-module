
class Data {
    id: number
    email: string
    first_name: string
    last_name: string
    avatar: string
    fullname?: string
}
export class FecthDataDto {
    page: number
    per_page: number
    total: number
    total_pages: number
    data: Data[]
    support: {
        url: string
        text: string
    }
}