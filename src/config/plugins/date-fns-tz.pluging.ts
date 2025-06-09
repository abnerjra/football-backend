// src/adapters/DateFnsTzAdapter.ts
import { toZonedTime, format as formatTz } from 'date-fns-tz';

type ToZoneTimeOptions = {
    date: Date | string,
    timeZone: string
}

type FormateOptions = {
    date: Date,
    fmt: string,
    timeZone: string
}

export class DateFnsTzPluging {
    static utcToZonedTime(options: ToZoneTimeOptions): Date {
        const { date, timeZone } = options
        return toZonedTime(date, timeZone);
    }

    static format(options: FormateOptions): string {
        const { date, fmt, timeZone } = options
        return formatTz(date, fmt, { timeZone });
    }
}
