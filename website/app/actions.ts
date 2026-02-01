"use server";

import { isValidIsraeliPhone } from "@/lib/validation";

/**
 * Form state for lead submission
 */
export interface FormState {
  success: boolean;
  error: string | null;
}

/**
 * Server action for lead form submission
 *
 * Validates name and phone, optionally posts to webhook if configured.
 * Returns FormState with Hebrew error messages for user feedback.
 *
 * @param prevState - Previous form state (for useActionState)
 * @param formData - Form data containing name and phone fields
 * @returns FormState with success/error status
 */
export async function submitLead(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract form data
    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;

    // Validate name: minimum 2 characters
    if (!name || name.trim().length < 2) {
      return { success: false, error: "נא להזין שם" };
    }

    // Validate phone: must be valid Israeli mobile number
    if (!phone || !isValidIsraeliPhone(phone)) {
      return { success: false, error: "נא להזין מספר טלפון ישראלי תקין" };
    }

    // Prepare lead data
    const leadData = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ""), // Store digits only
      timestamp: new Date().toISOString(),
    };

    // Post to webhook if configured, otherwise log
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        console.error("Webhook error:", response.status, response.statusText);
        return { success: false, error: "משהו השתבש, נסה שוב" };
      }
    } else {
      // Development mode: log lead data
      console.log("Lead submitted (no webhook configured):", leadData);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Lead submission error:", error);
    return { success: false, error: "משהו השתבש, נסה שוב" };
  }
}
