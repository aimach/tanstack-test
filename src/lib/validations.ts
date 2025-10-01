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

// Schéma pour une étape de paiement
const paymentStepSchema = z
  .object({
    id: z.string(),
    percentage: z
      .number()
      .min(0, "Le pourcentage doit être positif")
      .max(100, "Le pourcentage ne peut pas dépasser 100%")
      .multipleOf(0.01, "Le pourcentage doit avoir au maximum 2 décimales"),
    term: z.enum(
      [
        "due_now",
        "due_on_receipt",
        "net_30",
        "net_45",
        "net_60",
        "30_days_eom",
        "custom",
      ],
      {
        errorMap: () => ({ message: "Terme de paiement invalide" }),
      }
    ),
    customTerm: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si le terme est "custom", customTerm doit être renseigné
      if (data.term === "custom") {
        return data.customTerm && data.customTerm.length > 0;
      }
      return true;
    },
    {
      message:
        "Le terme personnalisé est obligatoire quand 'custom' est sélectionné",
      path: ["customTerm"],
    }
  );

// Schéma de validation pour le formulaire de paiement
export const paymentSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    steps: z
      .array(paymentStepSchema)
      .min(1, "Au moins une étape de paiement est requise"),
  })
  .refine(
    (data) => {
      // Vérifier que la somme des pourcentages ne dépasse pas 100%
      const totalPercentage = data.steps.reduce(
        (sum, step) => sum + step.percentage,
        0
      );
      return totalPercentage === 100;
    },
    {
      message: "La somme des pourcentages doit être égale à 100%",
      path: ["steps"],
    }
  );

// Types TypeScript dérivés des schémas d'entreprise
export type CompanyFormData = z.infer<typeof companySchema>;
export type CreateCompanyData = z.infer<typeof createCompanySchema>;
export type UpdateCompanyData = z.infer<typeof updateCompanySchema>;

// Types TypeScript dérivés des schémas de paiement
export type PaymentStepData = z.infer<typeof paymentStepSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
