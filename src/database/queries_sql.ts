import mysql, { RowDataPacket } from "mysql2/promise";

type Client = mysql.Connection | mysql.Pool;

export const createEmailQuery = `-- name: CreateEmail :exec
INSERT INTO email (
    id, recipient, project_id, template_id, attributes,
    subject, cc, bcc, scheduled_at, tags
) VALUES (
    ?,?,?,?,?,?,?,?,?,?
)`;

export interface CreateEmailArgs {
    id: string;
    recipient: string;
    projectId: number;
    templateId: number;
    attributes: any | null;
    subject: string;
    cc: string | null;
    bcc: string | null;
    scheduledAt: string | null;
    tags: string | null;
}

export async function createEmail(client: Client, args: CreateEmailArgs): Promise<void> {
    await client.query({
        sql: createEmailQuery,
        values: [args.id, args.recipient, args.projectId, args.templateId, args.attributes, args.subject, args.cc, args.bcc, args.scheduledAt, args.tags]
    });
}

export const getEmailQuery = `-- name: GetEmail :one
SELECT id, recipient, project_id, template_id, attributes, subject, cc, bcc, scheduled_at, tags, metadata, created_at, updated_at FROM email
WHERE id = ?`;

export interface GetEmailArgs {
    id: string;
}

export interface GetEmailRow {
    id: string;
    recipient: string;
    projectId: number;
    templateId: number;
    attributes: any | null;
    subject: string;
    cc: string | null;
    bcc: string | null;
    scheduledAt: string | null;
    tags: string | null;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getEmail(client: Client, args: GetEmailArgs): Promise<GetEmailRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getEmailQuery,
        values: [args.id],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        recipient: row[1],
        projectId: row[2],
        templateId: row[3],
        attributes: row[4],
        subject: row[5],
        cc: row[6],
        bcc: row[7],
        scheduledAt: row[8],
        tags: row[9],
        metadata: row[10],
        createdAt: row[11],
        updatedAt: row[12]
    };
}

export const getEmailsByUserProjectQuery = `-- name: GetEmailsByUserProject :one
SELECT
    u.email, u.project_id, u.name, u.notification_all, u.notification_marketing, u.metadata, u.created_at, u.updated_at,
    e.id, e.recipient, e.project_id, e.template_id, e.attributes, e.subject, e.cc, e.bcc, e.scheduled_at, e.tags, e.metadata, e.created_at, e.updated_at
FROM user as u
JOIN email e ON u.email = e.recipient AND u.project_id = e.project_id
WHERE u.email = ? AND u.project_id = ?`;

export interface GetEmailsByUserProjectArgs {
    email: string;
    projectId: number;
}

export interface GetEmailsByUserProjectRow {
    user: string | null;
    email: string | null;
}

export async function getEmailsByUserProject(client: Client, args: GetEmailsByUserProjectArgs): Promise<GetEmailsByUserProjectRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getEmailsByUserProjectQuery,
        values: [args.email, args.projectId],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        user: row[0],
        email: row[1]
    };
}

export const createProjectQuery = `-- name: CreateProject :exec
INSERT INTO project (
    title, metadata
) VALUES (?,?)`;

export interface CreateProjectArgs {
    title: string;
    metadata: any | null;
}

export async function createProject(client: Client, args: CreateProjectArgs): Promise<void> {
    await client.query({
        sql: createProjectQuery,
        values: [args.title, args.metadata]
    });
}

export const getProjectsQuery = `-- name: GetProjects :many
SELECT id, title, metadata, created_at, updated_at FROM project`;

export interface GetProjectsRow {
    id: number;
    title: string;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getProjects(client: Client): Promise<GetProjectsRow[]> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getProjectsQuery,
        values: [],
        rowsAsArray: true
    });
    return rows.map(row => {
        return {
            id: row[0],
            title: row[1],
            metadata: row[2],
            createdAt: row[3],
            updatedAt: row[4]
        };
    });
}

export const getProjectQuery = `-- name: GetProject :one
SELECT id, title, metadata, created_at, updated_at FROM project
WHERE id = ?`;

export interface GetProjectArgs {
    id: number;
}

export interface GetProjectRow {
    id: number;
    title: string;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getProject(client: Client, args: GetProjectArgs): Promise<GetProjectRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getProjectQuery,
        values: [args.id],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        title: row[1],
        metadata: row[2],
        createdAt: row[3],
        updatedAt: row[4]
    };
}

export const createTemplateQuery = `-- name: CreateTemplate :exec
INSERT INTO template (
    project_id, title, version, html, sender, subject, metadata
) VALUES (
    ?,?,?,?,?,?,?
)`;

export interface CreateTemplateArgs {
    projectId: number;
    title: string;
    version: string;
    html: string | null;
    sender: string | null;
    subject: string | null;
    metadata: any | null;
}

export async function createTemplate(client: Client, args: CreateTemplateArgs): Promise<void> {
    await client.query({
        sql: createTemplateQuery,
        values: [args.projectId, args.title, args.version, args.html, args.sender, args.subject, args.metadata]
    });
}

export const getTemplatesQuery = `-- name: GetTemplates :many
SELECT id, project_id, title, version, html, sender, subject, metadata, created_at, updated_at FROM template`;

export interface GetTemplatesRow {
    id: number;
    projectId: number;
    title: string;
    version: string;
    html: string | null;
    sender: string | null;
    subject: string | null;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getTemplates(client: Client): Promise<GetTemplatesRow[]> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getTemplatesQuery,
        values: [],
        rowsAsArray: true
    });
    return rows.map(row => {
        return {
            id: row[0],
            projectId: row[1],
            title: row[2],
            version: row[3],
            html: row[4],
            sender: row[5],
            subject: row[6],
            metadata: row[7],
            createdAt: row[8],
            updatedAt: row[9]
        };
    });
}

export const getProjectTemplatesQuery = `-- name: GetProjectTemplates :many
SELECT id, project_id, title, version, html, sender, subject, metadata, created_at, updated_at FROM template
WHERE project_id = ?`;

export interface GetProjectTemplatesArgs {
    projectId: number;
}

export interface GetProjectTemplatesRow {
    id: number;
    projectId: number;
    title: string;
    version: string;
    html: string | null;
    sender: string | null;
    subject: string | null;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getProjectTemplates(client: Client, args: GetProjectTemplatesArgs): Promise<GetProjectTemplatesRow[]> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getProjectTemplatesQuery,
        values: [args.projectId],
        rowsAsArray: true
    });
    return rows.map(row => {
        return {
            id: row[0],
            projectId: row[1],
            title: row[2],
            version: row[3],
            html: row[4],
            sender: row[5],
            subject: row[6],
            metadata: row[7],
            createdAt: row[8],
            updatedAt: row[9]
        };
    });
}

export const getTemplateQuery = `-- name: GetTemplate :one
SELECT id, project_id, title, version, html, sender, subject, metadata, created_at, updated_at FROM template
WHERE id = ?`;

export interface GetTemplateArgs {
    id: number;
}

export interface GetTemplateRow {
    id: number;
    projectId: number;
    title: string;
    version: string;
    html: string | null;
    sender: string | null;
    subject: string | null;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getTemplate(client: Client, args: GetTemplateArgs): Promise<GetTemplateRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getTemplateQuery,
        values: [args.id],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        projectId: row[1],
        title: row[2],
        version: row[3],
        html: row[4],
        sender: row[5],
        subject: row[6],
        metadata: row[7],
        createdAt: row[8],
        updatedAt: row[9]
    };
}

export const createUserQuery = `-- name: CreateUser :exec
INSERT INTO user (
    project_id, email, name
) VALUES ( ?,?,? )`;

export interface CreateUserArgs {
    projectId: number;
    email: string;
    name: string | null;
}

export async function createUser(client: Client, args: CreateUserArgs): Promise<void> {
    await client.query({
        sql: createUserQuery,
        values: [args.projectId, args.email, args.name]
    });
}

export const getUserQuery = `-- name: GetUser :one
SELECT email, project_id, name, notification_all, notification_marketing, metadata, created_at, updated_at FROM user
WHERE email = ?`;

export interface GetUserArgs {
    email: string;
}

export interface GetUserRow {
    email: string;
    projectId: number;
    name: string | null;
    notificationAll: number;
    notificationMarketing: number;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getUser(client: Client, args: GetUserArgs): Promise<GetUserRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getUserQuery,
        values: [args.email],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        email: row[0],
        projectId: row[1],
        name: row[2],
        notificationAll: row[3],
        notificationMarketing: row[4],
        metadata: row[5],
        createdAt: row[6],
        updatedAt: row[7]
    };
}

export const getUserProjectQuery = `-- name: GetUserProject :one
SELECT email, project_id, name, notification_all, notification_marketing, metadata, created_at, updated_at FROM user
WHERE email = ? AND project_id = ?`;

export interface GetUserProjectArgs {
    email: string;
    projectId: number;
}

export interface GetUserProjectRow {
    email: string;
    projectId: number;
    name: string | null;
    notificationAll: number;
    notificationMarketing: number;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function getUserProject(client: Client, args: GetUserProjectArgs): Promise<GetUserProjectRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getUserProjectQuery,
        values: [args.email, args.projectId],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        email: row[0],
        projectId: row[1],
        name: row[2],
        notificationAll: row[3],
        notificationMarketing: row[4],
        metadata: row[5],
        createdAt: row[6],
        updatedAt: row[7]
    };
}

export const userUnsubscribeQuery = `-- name: UserUnsubscribe :exec
UPDATE user
    SET notification_all = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE email = ? AND project_id = ?`;

export interface UserUnsubscribeArgs {
    notificationAll: number;
    email: string;
    projectId: number;
}

export async function userUnsubscribe(client: Client, args: UserUnsubscribeArgs): Promise<void> {
    await client.query({
        sql: userUnsubscribeQuery,
        values: [args.notificationAll, args.email, args.projectId]
    });
}

export const userUnsubscribeMarketingQuery = `-- name: UserUnsubscribeMarketing :exec
UPDATE user
    SET notification_marketing = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE email = ? AND project_id = ?`;

export interface UserUnsubscribeMarketingArgs {
    notificationMarketing: number;
    email: string;
    projectId: number;
}

export async function userUnsubscribeMarketing(client: Client, args: UserUnsubscribeMarketingArgs): Promise<void> {
    await client.query({
        sql: userUnsubscribeMarketingQuery,
        values: [args.notificationMarketing, args.email, args.projectId]
    });
}

