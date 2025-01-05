import { Resend } from "resend";

let __resend: Resend | null = null;

export function getResend(): Resend {
    if (__resend == null) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error("RESEND_API_KEY is not set in the environment variables.");
        }
        __resend = new Resend(apiKey);
    }
    return __resend;
}
