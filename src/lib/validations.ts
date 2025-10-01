import { z } from "zod";

// Schéma pour un téléphone individuel
const phoneSchema = z.object({
  id: z.string(),
  type: z.enum(["pro", "perso", "accueil", "mobile", "autre"], {
    errorMap: () => ({ message: "Type de téléphone invalide" }),
  }),
  number: z
    .string()
    .regex(
      /^[0-9+\-\s()]+$/,
      "Le numéro de téléphone contient des caractères invalides"
    )
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
});

// Schéma de validation pour les entreprises
export const companySchema = z
  .object({
    name: z
      .string()
      .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
    address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    phones: z.array(phoneSchema).default([]),
  })
  .refine(
    (data) => {
      // Si l'adresse est remplie, au moins un téléphone doit être renseigné
      if (data.address && data.address.length > 0) {
        return data.phones && data.phones.length > 0;
      }
      return true; // Si pas d'adresse, pas de problème
    },
    {
      message:
        "Au moins un numéro de téléphone est obligatoire quand une adresse est renseignée",
      path: ["phones"], // L'erreur sera associée au champ phones
    }
  );

export const createCompanySchema = companySchema;
export const updateCompanySchema = companySchema;

// Types TypeScript dérivés des schémas d'entreprise
export type CompanyFormData = z.infer<typeof companySchema>;
export type CreateCompanyData = z.infer<typeof createCompanySchema>;
export type UpdateCompanyData = z.infer<typeof updateCompanySchema>;
