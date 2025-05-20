import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserOrganizations } from "@/api";
import type { Organization } from "@/types";

interface OrganizationContextType {
  organizations: Organization[];
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  useEffect(() => {
    const getOrganizations = async () => {
      try {
        const orgs = await fetchUserOrganizations();
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setCurrentOrg(orgs[0]);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    getOrganizations();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{ organizations, currentOrg, setCurrentOrg }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
}
