export const fetchUserOrganizations = async () => {
  const token = localStorage.getItem("token") || "";
  if (!token) {
    throw new Error("No token found");
  }
  const response = await fetch(`http://localhost:3000/api/organizations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const fetchOrganizationSources = async (orgId: string) => {
  const token = localStorage.getItem("token") || "";
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await fetch(`http://localhost:3000/api/sources/${orgId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sources");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching organization sources:", error);
    return [];
  }
};
