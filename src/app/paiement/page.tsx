import { PaymentForm } from "@/components/PaymentForm";

export default function PaiementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuration du Paiement
          </h1>
          <p className="text-gray-600">
            Créez et configurez votre plan de paiement avec des étapes
            personnalisables
          </p>
        </div>
        <PaymentForm />
      </div>
    </div>
  );
}
