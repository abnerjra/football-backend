import { DateFnsTzPluging } from "../plugins/date-fns-tz.pluging";
import { envPlugin } from "../plugins/env.plugin";

const tz = envPlugin.TIME_ZONE;

export class DateHandler {
    /**
     * Converts a Unix timestamp to a readable date
     * @param {Date} unixTime UNIX timestamp
     * @returns 
     */
    
    static convertUnixToDate = (unixTime: number, timeZone: string = tz) => {
        const date = new Date(unixTime * 1000);

        // Ajustar la fecha a la zona horaria especificada
        const zonedDate = DateFnsTzPluging.utcToZonedTime({ date: date, timeZone });

        // Formatear la fecha al formato ISO 8601
        const fullDate = DateFnsTzPluging.format({ date: zonedDate, fmt: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timeZone });

        return {
            year: zonedDate.getFullYear(),
            month: zonedDate.getMonth() + 1,
            day: zonedDate.getDate(),
            hour: zonedDate.getHours(),
            minute: zonedDate.getMinutes(),
            second: zonedDate.getSeconds(),
            fullDate
        };
    }
}