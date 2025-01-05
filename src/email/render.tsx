import { Span, trace } from '@opentelemetry/api';
import WNWelcomeEmail from '../../emails/workout-notepad/WNWelcome';
import pool from '../database/database';
import { getProject, getTemplate, GetTemplateRow } from '../database/queries_sql';
import { render } from '@react-email/components';
import { encodeUnsubscribe } from '../project/user/unsubscribe';
import { v4 } from 'uuid';
import WNFeedback from '../../emails/workout-notepad/WNFeedback';

export type EmailBody = {
	projectId: number
	templateId: number
	attributes: Object
	type: string | "marketing"

	subject: string
	from: string
	to: string
	cc?: string
	bcc?: string
	scheduledAt?: string
	tags?: { name: string, value: string }[]
}

export type RenderEmailResponse = {
	template: GetTemplateRow
	body: EmailBody
	react: JSX.Element
	plainText: string
	headers: Record<string, string>
}

const tracer = trace.getTracer('email');

export async function renderEmail(body: EmailBody): Promise<RenderEmailResponse> {
	return tracer.startActiveSpan('renderEmail', async (span: Span) => {
		// validate the fields
		if (body.to == "") {
			throw Error("The `to` field is required")
		}

		const project = await getProject(pool, { id: body.projectId })
		if (!project) {
			throw Error(`failed to get the project with id: ${body.projectId}`)
		}

		// fetch the template
		const template = await getTemplate(pool, { id: body.templateId })
		if (!template) {
			throw Error("failed to get the template")
		}

		// add field overrides
		body.from = template.sender ?? body.from
		body.subject = template.subject ?? body.subject

		// add extra tags
		if (body.tags === undefined) {
			body.tags = []
		}
		body.tags.push({
			name: "project",
			value: body.projectId.toString(),
		})
		body.tags.push({
			name: "templateId",
			value: body.templateId.toString(),
		})

		// create some metadata for emails
		var unsubLink = `${process.env.APP_BASE_URL}/unsubscribe/${encodeUnsubscribe(body.to, project.id)}`
		var headers = {
			"X-Entity-Ref-ID": v4(), // force emails not to chain
			"List-Unsubscribe": `<${unsubLink}>`,
			"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
		}

		// parse the template based on the id
		var rendered: JSX.Element | null = null
		switch (template.id) {
			case 1:
				rendered = <WNWelcomeEmail
					recipient={body.to}
					unsubscribeLink={unsubLink}
				/>
				break
			case 2:
				rendered = <WNFeedback
					recipient={body.to}
					unsubscribeLink={unsubLink}
				/>
				break
			default:
				throw Error(`Invalid templateId: ${body.templateId}`)
		}
		if (rendered === null) {
			throw Error("No template defined")
		}

		// create the object and return
		span.end()
		return {
			template: template,
			body: body,
			react: rendered,
			plainText: await render(rendered, { plainText: true }),
			headers: headers,
		}
	})

}