import { auth } from "./auth.js";

type AuthResult = NonNullable<
  Awaited<
    ReturnType<
      typeof auth.api.getSession
    >
  >
>;

export async function getSession(
  request: Request,
): Promise<AuthResult | null> {
  return auth.api.getSession({
    headers: request.headers,
  });
}

export async function requireSession(
  request: Request,
): Promise<
  | {
      session: AuthResult["session"];
      user: AuthResult["user"];
    }
  | null
> {
  const result =
    await getSession(request);

  if (!result) {
    return null;
  }

  return {
    session: result.session,
    user: result.user,
  };
}

export function unauthorizedResponse() {
  return Response.json(
    {
      error: "Unauthorized",
    },
    {
      status: 401,
    },
  );
}

export function methodNotAllowedResponse(
  allowedMethods: string[],
) {
  return new Response(
    "Method Not Allowed",
    {
      status: 405,
      headers: {
        Allow:
          allowedMethods.join(", "),
      },
    },
  );
}

export function internalServerErrorResponse(
  message = "Internal server error.",
) {
  return Response.json(
    {
      error: message,
    },
    {
      status: 500,
    },
  );
}