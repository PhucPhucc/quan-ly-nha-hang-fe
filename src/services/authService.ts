type LoginPayload = {
  employeeCode: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

export const login = async ({ employeeCode, password }: LoginPayload) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeCode, password }),
    },
  );

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};