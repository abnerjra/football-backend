interface Data {
    [key: string]: any
}

interface Paginate {
    totalRecords: number,
    totalPerPage: number,
    totalPages: number,
    page: number,
    limit: number
}

export class ResponseEntity {
    constructor(
        public readonly severity: string,
        public readonly statusCode: number,
        public readonly message: string,
        public readonly data: Data[] = [],
        public readonly paginated?: Paginate,
    ) { }

    static fromJson(props: { [key: string]: any }): ResponseEntity {
        const { severity, statusCode, message, data, paginated } = props;

        return new ResponseEntity(severity, statusCode, message, data, paginated)
    }
}