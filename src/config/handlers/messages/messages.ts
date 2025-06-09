
export default {
    response: {
        create: { message: "Registro creado correctamente", severity: "success", statusCode: 201 },
        update: { message: "Registro actualizado correctamente", severity: "success", statusCode: 200 },
        read: { message: "Información de registro", severity: "success", statusCode: 200 },
        reads: { message: "Información de registros", severity: "success", statusCode: 200 },
        delete: { message: "Registro eliminado correctamente", severity: "success", statusCode: 200 },
        empty: { message: "No hay registros", severity: "warning", statusCode: 200 }
    },
    fails: {
        register: { message: "Error al procesar la solicitud", severity: "error", statusCode: 400 },
        duplicate: { message: "El registro ya se encuentra en el sistema", severity: "warning", statusCode: 409 },
        implement: { message: 'Funcionalidad aún no implementada', severity: 'warning', statusCode: 400 }
    },
    auth: {
        invalidToken: { message: "Token inválido o expirado. Por favor, intente iniciar sesión nuevamente", severity: "error", statusCode: 401 },
        login: { message: "Inicio de sesión exitoso... bienvenido!!!", severity: "success", statusCode: 200 },
        logout: { message: "Cierre de sesión", severity: "success", statusCode: 200 },
        notFoundEmail: { message: "El correo proporcionado no se encuentra registrado en sistema", severity: "error", statusCode: 404 },
        notMatchPassword: { message: "La contraseña ingresada es incorrecta", severity: "error", statusCode: 401 },
        requiredToken: { message: "Es necesario proporcionar el token de acceso", severity: "error", statusCode: 401 },
        sessionExpire: { message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente", severity: "error", statusCode: 401 },
    },
    validate: {
        existsEmail: { message: "El correo ingresado ya existe en el sistema", severity: "warning", statusCode: 422 },
        notExists: { message: "El registro no existe", severity: "warning", statusCode: 422 },
        field: ({ message, level }: { message: string, level: number }) => ({
            message,
            severity: (level === 1) ? "error" : "warning",
            statusCode: (level === 1) ? 404 : 409
        }),
    },
    permission: {
        withoutPermission: { message: "No tienes permisos para ver esta sección", severity: "warning", statusCode: 403 },
    },
    match: {
        activeSeason: { message: 'La temporada no está activa y no es posible registrar partidos', severity: 'warning', statusCode: 409 },
        activeLeagueSeason: { message: 'La temporada ha finalizado y no es posible registrar partidos', severity: 'warning', statusCode: 409 },
        matchCount: { message: 'No es posible registrar partidos hasta el final de la temporada', severity: 'warning', statusCode: 409 },
        withoutTeams: ({ leagueName }: { leagueName: string }) => ({
            message: `Actualmente la liga ${leagueName} no tiene equipos registrados`,
            severity: "warning",
            statusCode: 409
        }),
        oddNumber: { message: 'Debe haber un número par de equipos', severity: 'warning', statusCode: 409 },
        created: ({ matchDay, season, league }: { matchDay: number, season: string, league: string }) => ({
            message: `Se registro un total de ${matchDay - 1} partidos para la temporada ${season} de la liga ${league}`,
            severity: "success",
            statusCode: 201
        }),
        finished: ({ matchday }: { matchday: number }) => ({
            message: `No es posible simular los partidos de la jornada ${matchday}, los partidos ya han finalizado`,
            severity: 'warning',
            statusCode: 409
        }),
        invalidMatchday: ({ matchday, maxMatchday }: { matchday: number, maxMatchday: number }) => ({
            message: `La liga solo cuenta con ${maxMatchday} jornadas y no es posible registrar partidos en la jornada ${matchday}, puesto que no existe`,
            severity: 'error',
            statusCode: 404
        }),
        matchdayNotFinished: ({ matchday }: { matchday: number }) => ({
            message: `No es posible simular los partidos de la jornada ${matchday}, aún no se jugan los partidos de la jornada ${matchday == 1 ? matchday : matchday - 1}`,
            severity: 'warning',
            statusCode: 409
        }),
        matchdayFinished: ({ matches, matchday }: { matches: number, matchday: number }) => ({
            message: `Se jugaron un total de ${matches} partidos en la jornada ${matchday}`,
            severity: 'success',
            statusCode: 409
        }),
    },
    standing: {
        empty: ({ seasonName, leagueName }: { seasonName: string, leagueName: string }) => ({
            message: `Aún no hay una clasificación para la temporada ${seasonName} de la liga ${leagueName}`,
            seveity: 'error',
            statusCode: 400
        }),
        notFound: ({ content }: { content: string }) => ({
            message: `No existe la ${content} ingresada para la búsqueda`,
            seveity: 'error',
            statusCode: 404
        }),
        champion: ({ season, league, team }: { season: string, league: string, team: string }) => ({
            message: `La temporada ${season} de la liga ${league} termino y el equipo ${team} es campeón de la liga`,
            severity: 'success',
            statusCode: 200
        })
    },
    team: {

    }
}