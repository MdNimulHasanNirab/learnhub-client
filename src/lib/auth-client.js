"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [jwtClient(), inferAdditionalFields()],
});

export async function getAccessToken() {
  const result = await authClient.token();
  if (result.error || !result.data?.token) {
    throw new Error(result.error?.message || "Could not retrieve an access token");
  }
  return result.data.token;
}
