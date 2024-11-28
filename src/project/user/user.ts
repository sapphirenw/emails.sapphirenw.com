import { createUser, getUserProject, GetUserRow } from "../../database/queries_sql";
import pool from "../../database/database";
import { Span, trace } from "@opentelemetry/api";

const tracer = trace.getTracer('user');

export async function fetchUser(email: string, projectId: number, name?: string): Promise<{user: GetUserRow, created: boolean}> {
    return tracer.startActiveSpan('fetchUser', async (span: Span) => {
        span.setAttribute("email", email)
        span.setAttribute("projectId", projectId)
        const user = await getUserProject(pool, {email: email, projectId: projectId})
        if (!user) {
            // create the user
            await createUser(pool, {
                email: email,
                projectId: projectId,
                name: name ?? "",
            })
            
            // get the user again
            const u = await getUserProject(pool, {email: email, projectId: projectId})
            if (!u) {
                throw Error(`failed to create the new user: email=${email} projectId=${projectId}`)
            }

            span.end()
            return {user: u, created: true}
        }
        
        span.end()
        return {user: user, created: false}
    })
}