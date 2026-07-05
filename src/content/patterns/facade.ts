import { Pattern } from "@/lib/types";

export const facade: Pattern = {
  slug: "facade",
  category: "structural",
  code: "S-03",
  name: "Facade",
  oneLiner: "Hide a tangle of subsystems behind one simple hook or function.",
  problem:
    "A checkout flow might need to: validate the cart, create a Stripe PaymentIntent, confirm the card element, update the order in your database, fire an analytics event, and redirect on success. If a `<CheckoutButton>` component orchestrates all of that inline, the component becomes a 200-line file mixing UI with business logic from four different subsystems — and every place that needs to trigger checkout has to re-learn all of it.",
  solution:
    "Introduce one function or hook — `useCheckout()` — that internally coordinates all the subsystems and exposes a small, purpose-built API: `{ submit, isProcessing, error }`. Components call the facade; they never talk to Stripe's SDK, the analytics client, or the order API directly. The complexity doesn't disappear, it just has exactly one place to live.",
  whenToUse: [
    "Orchestrating a payment flow across an SDK (Stripe/PayPal), your backend, and analytics",
    "Wrapping a complex third-party SDK (maps, video calls, rich text editors) behind an app-specific hook with just the methods you actually use",
    "Coordinating multiple stores/contexts that always change together (e.g. cart + user + shipping address at checkout)",
    "Giving a simple hook API to a multi-step wizard whose internal steps involve several services",
  ],
  avoidWhen: [
    "There's really only one subsystem involved — a facade around a single API call just adds indirection",
    "Different callers genuinely need different subsets of the underlying APIs — a one-size-fits-all facade would force everyone through the same narrow door",
  ],
  realWorldExamples: [
    {
      name: "Stripe's own `useStripe()` / `useElements()` hooks",
      detail:
        "Stripe.js itself ships hooks that hide the underlying imperative SDK (mounting elements, tokenizing cards) behind a small React-friendly API — a facade over their own lower-level SDK.",
    },
    {
      name: "Firebase/Supabase auth hooks (`useAuth`)",
      detail:
        "Teams commonly wrap a BaaS SDK's token refresh, session persistence, and multiple auth methods behind one `useAuth()` hook exposing just `{ user, signIn, signOut }`.",
    },
    {
      name: "Video-call SDK wrappers (Twilio, Daily, LiveKit)",
      detail:
        "Products building on real-time video SDKs typically wrap connection setup, device permissions, and room state behind one `useCall()` hook so components never touch the raw SDK.",
    },
    {
      name: "Map SDK wrappers (`useMap`)",
      detail:
        "Products on Mapbox or Google Maps wrap tile setup, marker layers, and viewport state behind one `useMap()` hook, so components add pins without ever touching the imperative map SDK.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/checkout/useCheckout.ts",
      language: "ts",
      description:
        "A facade hook hiding Stripe SDK calls, order creation, and analytics behind one simple submit() method — the pattern behind most production checkout flows.",
      code: `import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { apiClient } from "@/lib/apiClient";
import { trackEvent } from "@/lib/analytics";
import { useCartStore } from "@/features/cart/cartStore";

interface CheckoutResult {
  success: boolean;
  orderId?: string;
}

export function useCheckout() {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(): Promise<CheckoutResult> {
    if (!stripe || !elements) return { success: false };

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create the order + PaymentIntent on the backend.
      const { clientSecret, orderId } = await apiClient.request<{
        clientSecret: string;
        orderId: string;
      }>("/orders", { method: "POST", body: JSON.stringify({ items: cart }) });

      // 2. Confirm the card payment with Stripe's SDK.
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement("card")! },
      });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed");
        return { success: false };
      }

      // 3. Side effects: analytics + local cart state.
      trackEvent("checkout_completed", { orderId, itemCount: cart.length });
      clearCart();

      return { success: true, orderId };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  }

  return { submit, isProcessing, error };
}

// The component using it never touches Stripe, the order API, or analytics:
// const { submit, isProcessing, error } = useCheckout();
// <button onClick={submit} disabled={isProcessing}>Pay now</button>`,
    },
    {
      filename: "src/features/upload/useFileUpload.ts",
      language: "ts",
      description:
        "A facade hook hiding the presigned-URL fetch, the direct-to-storage PUT, progress tracking, and the metadata save behind one upload() call and a simple { progress, error } state.",
      code: `import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

export function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<{ success: boolean; fileId?: string }> {
    setError(null);
    setProgress(0);
    try {
      // 1. Ask the backend for a presigned URL + a file record.
      const { uploadUrl, fileId } = await apiClient.request<{ uploadUrl: string; fileId: string }>(
        "/uploads",
        { method: "POST", body: JSON.stringify({ name: file.name, size: file.size }) }
      );

      // 2. Upload the bytes straight to storage, reporting progress.
      await putWithProgress(uploadUrl, file, setProgress);

      // 3. Mark the record complete.
      await apiClient.request(\`/uploads/\${fileId}/complete\`, { method: "POST" });
      return { success: true, fileId };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return { success: false };
    }
  }

  return { upload, progress, error };
}

function putWithProgress(url: string, file: File, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) =>
      e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(\`HTTP \${xhr.status}\`)));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(file);
  });
}

// The component just calls upload(file) — three subsystems, one method:
// const { upload, progress, error } = useFileUpload();`,
    },
  ],
  pros: [
    "Components stay focused on rendering; orchestration logic lives in one testable hook",
    "Swapping a subsystem (e.g. Stripe → another PSP) only touches the facade, not every component that triggers checkout",
    "Gives new team members one obvious entry point instead of four SDKs to learn",
  ],
  cons: [
    "Can become a 'god hook' if it keeps absorbing unrelated responsibilities over time",
    "Hides genuine complexity, which is good for callers but means the facade itself needs solid tests",
  ],
};
