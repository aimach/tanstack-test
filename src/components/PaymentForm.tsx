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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/hooks/useAppForm";
import {
  paymentSchema,
  type PaymentFormData,
  type PaymentStepData,
} from "@/lib/validations";
import { Minus, Plus } from "lucide-react";

const TERM_OPTIONS = [
  { value: "due_now", label: "Due now" },
  { value: "due_on_receipt", label: "Due on receipt" },
  { value: "net_30", label: "Net 30" },
  { value: "net_45", label: "Net 45" },
  { value: "net_60", label: "Net 60" },
  { value: "30_days_eom", label: "30 days EOM" },
  { value: "custom", label: "Custom" },
];

export function PaymentForm() {
  const form = useAppForm(paymentSchema, {
    defaultValues: {
      name: "",
      steps: [
        {
          id: `step-${Date.now()}`,
          percentage: 0,
          term: "due_now" as const,
          customTerm: "",
        },
      ],
    },
    onSubmit: async (values: PaymentFormData) => {
      console.log("Données de paiement:", values);
      const stepsInfo = values.steps
        .map((step) => {
          const termLabel =
            step.term === "custom"
              ? step.customTerm
              : TERM_OPTIONS.find((opt) => opt.value === step.term)?.label;
          return `${step.percentage}% - ${termLabel}`;
        })
        .join(", ");
      alert(`Plan de paiement créé : ${values.name} - ${stepsInfo}`);
    },
  });

  const addStep = () => {
    const newStep: PaymentStepData = {
      id: `step-${Date.now()}`,
      percentage: 0,
      term: "due_now",
      customTerm: "",
    };
    form.setFieldValue("steps", [...form.getFieldValue("steps"), newStep]);
  };

  const removeStep = (stepId: string) => {
    const currentSteps = form.getFieldValue("steps");
    if (currentSteps && currentSteps.length > 1) {
      form.setFieldValue(
        "steps",
        currentSteps.filter((step) => step.id !== stepId)
      );
    }
  };

  const getTotalPercentage = (steps: PaymentStepData[]) => {
    return steps && steps.length > 0
      ? steps.reduce((sum, step) => sum + (step.percentage || 0), 0)
      : 0;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Formulaire de Paiement</CardTitle>
        <CardDescription>
          Configurez votre plan de paiement avec les étapes et pourcentages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Champ nom */}
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Nom</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ex: Plan de paiement standard"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]?.message.toString()}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Étapes de paiement */}
          <form.Field name="steps" mode="array">
            {(stepsField) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Étapes de paiement</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStep}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une étape
                  </Button>
                </div>

                {stepsField.state.value?.map((step, index) => (
                  <div
                    key={step.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Étape {index + 1}</h4>
                      {stepsField.state.value &&
                        stepsField.state.value.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeStep(step.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pourcentage */}
                      <form.Field
                        key={`${step.id}-percentage`}
                        name={`steps[${index}].percentage`}
                      >
                        {(percentageField) => (
                          <div className="space-y-2">
                            <Label htmlFor={percentageField.name}>
                              Pourcentage (%)
                            </Label>
                            <Input
                              id={percentageField.name}
                              name={percentageField.name}
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={percentageField.state.value ?? 0}
                              onBlur={percentageField.handleBlur}
                              onChange={(e) =>
                                percentageField.handleChange(
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              placeholder="0.00"
                            />
                            {percentageField.state.meta.errors.length > 0 && (
                              <p className="text-sm text-red-600">
                                {percentageField.state.meta.errors[0]?.message.toString()}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      {/* Terme de paiement */}
                      <form.Field
                        key={`${step.id}-term`}
                        name={`steps[${index}].term`}
                      >
                        {(termField) => (
                          <div className="space-y-2">
                            <Label htmlFor={termField.name}>
                              Terme de paiement
                            </Label>
                            <Select
                              value={termField.state.value ?? "due_now"}
                              onValueChange={(value) =>
                                termField.handleChange(value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un terme" />
                              </SelectTrigger>
                              <SelectContent>
                                {TERM_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {termField.state.meta.errors.length > 0 && (
                              <p className="text-sm text-red-600">
                                {termField.state.meta.errors[0]?.message.toString()}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>

                    {/* Champ terme personnalisé (conditionnel) */}
                    <form.Field
                      key={`${step.id}-term-check`}
                      name={`steps[${index}].term`}
                    >
                      {(termField) => (
                        <form.Field
                          key={`${step.id}-customTerm`}
                          name={`steps[${index}].customTerm`}
                        >
                          {(customTermField) => {
                            if (termField.state.value !== "custom") {
                              return null;
                            }
                            return (
                              <div className="space-y-2">
                                <Label htmlFor={customTermField.name}>
                                  Terme personnalisé
                                </Label>
                                <Input
                                  id={customTermField.name}
                                  name={customTermField.name}
                                  value={customTermField.state.value ?? ""}
                                  onBlur={customTermField.handleBlur}
                                  onChange={(e) =>
                                    customTermField.handleChange(e.target.value)
                                  }
                                  placeholder="Ex: 15 jours après livraison"
                                />
                                {customTermField.state.meta.errors.length >
                                  0 && (
                                  <p className="text-sm text-red-600">
                                    {customTermField.state.meta.errors[0]?.message.toString()}
                                  </p>
                                )}
                              </div>
                            );
                          }}
                        </form.Field>
                      )}
                    </form.Field>
                  </div>
                ))}

                {stepsField.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {stepsField.state.meta.errors[0]?.message.toString()}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Total des pourcentages (lecture seule) */}
          <form.Subscribe selector={(state) => state.values.steps}>
            {(steps) => {
              const totalPercentage = getTotalPercentage(steps || []);
              return (
                <div className="space-y-2">
                  <Label>Total des pourcentages</Label>
                  <Input
                    value={`${totalPercentage.toFixed(2)}%`}
                    readOnly
                    className="bg-gray-50"
                  />
                  {totalPercentage > 100 && (
                    <p className="text-sm text-red-600">
                      Attention : Le total dépasse 100%
                    </p>
                  )}
                </div>
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
              : "Créer le plan de paiement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
