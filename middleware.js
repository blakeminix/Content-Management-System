import { updateSession } from "./app/lib";

export async function middleware(request) {
  return await updateSession(request);
}
