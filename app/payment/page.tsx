// /app/payment/page.tsx (pagina de pagamento)
import Checkout from "@/components/Checkout";
import EmbeddedCheckoutButton from "@/components/EmbeddedCheckoutButton";

export default function Payment() {
  return <EmbeddedCheckoutButton />;
}
