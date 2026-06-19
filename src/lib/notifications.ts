type NewPostNotification = {
  title: string;
  category: string;
  school: string;
  city: string;
  authorName: string;
  contactInfo: string;
  excerpt: string;
  adminUrl: string;
};

function siteBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "";
}

export async function sendNewPostNotification(payload: NewPostNotification) {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? "";

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        type: "new_post_pending_review",
        admin_email: adminEmail,
        message: "Malaysia Student Wall 有新投稿待审核。",
        ...payload,
        admin_url: payload.adminUrl
      })
    });
  } catch (error) {
    console.error("Failed to send new post notification", error);
  }
}

export function adminReviewUrl() {
  const baseUrl = siteBaseUrl();
  return baseUrl ? `${baseUrl}/admin` : "/admin";
}
