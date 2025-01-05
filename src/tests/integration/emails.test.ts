import "../../utils/env.dev";
import pool from "../../database/database";
import { getProjects, getProjectTemplates } from "../../database/queries_sql";
import emails from "../../email/handler";
import { PoolConnection } from "mysql2/promise";

describe('Emails', () => {
    // ensure the connection is closed properly
    let conn: PoolConnection
    beforeAll(async () => {
        conn = await pool.getConnection();
    });
    afterAll(async () => {
        if (conn) {
            conn.release();
        }
        await pool.end(); // Ensure the pool is closed
    });

    // render templates
    test('Render Templates', async () => {
        const projects = await getProjects(conn);
        expect(projects.length).toBeGreaterThan(0);

        for (let project of projects) {
            const templates = await getProjectTemplates(conn, {
                projectId: project.id,
            });
            expect(templates.length).toBeGreaterThan(0);

            for (let template of templates) {
                // send the request
                const res = await emails.request('/', {
                    method: 'PATCH',
                    body: JSON.stringify({
                        projectId: project.id,
                        templateId: template.id,
                        attributes: {},
                        subject: "",
                        from: "",
                        to: "jake@jakelanders.com",
                        cc: "",
                        bcc: "",
                        scheduledAt: "",
                        tags: [],
                    }),
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                });
                
                // ensure the status is good
                expect(res.status).toBe(200);

                // read the body
                const body = await res.text()

                // run expected workloads from the body
                expect(body).toContain("html");
                expect(body).toContain(template.title);
            }
        }
    });
});
