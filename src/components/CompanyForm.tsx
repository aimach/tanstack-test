"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppForm } from "@/hooks/useAppForm";
import { companySchema, type CompanyFormData } from "@/lib/validations";
import { Plus } from "lucide-react";
import { PhoneField, type PhoneData } from "./PhoneField";

export function CompanyForm() {
  const form = useAppForm(companySchema, {
    defaultValues: {
      name: "",
      address: "",
      phones: [],
    },
    onSubmit: async (values: CompanyFormData) => {
      console.log("Données de l'entreprise:", values);
      const phoneInfo =
        values.phones.length > 0
          ? ` - Tél: ${values.phones
              .map((p) => `${p.type}: ${p.number}`)
              .join(", ")}`
          : "";
      alert(
        `Entreprise créée : ${values.name} - ${values.address}${phoneInfo}`
      );
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Formulaire Entreprise</CardTitle>
        <CardDescription>
          Saisissez les informations de votre entreprise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Nom de l&apos;entreprise</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ex: Mon Entreprise SARL"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]?.message.toString()}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="address">
            {(field) => {
              console.log(field.state.meta);
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Adresse</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ex: 123 Rue de la Paix, 75001 Paris"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]?.message.toString()}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Subscribe selector={(state) => state.values.address}>
            {(addressField) => {
              return (
                addressField && (
                  <form.Field name="phones" mode="array">
                    {(phonesField) => {
                      const addPhone = () => {
                        const newPhone: PhoneData = {
                          id: `phone-${Date.now()}`,
                          type: "pro",
                          number: "",
                        };
                        phonesField.pushValue(newPhone);
                      };

                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Téléphones</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addPhone}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Ajouter un téléphone
                            </Button>
                          </div>
                          <PhoneField field={phonesField} />
                          {phonesField.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-600">
                              {phonesField.state.meta.errors[0]?.message.toString()}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  </form.Field>
                )
              );
            }}
          </form.Subscribe>

          <Button
            type="submit"
            className="w-full"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting
              ? "Envoi en cours..."
              : "Créer l'entreprise"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
