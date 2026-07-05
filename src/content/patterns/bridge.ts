import { Pattern } from "@/lib/types";

export const bridge: Pattern = {
  slug: "bridge",
  category: "structural",
  code: "S-06",
  name: "Bridge",
  oneLiner: "Split an abstraction from its implementation so the two can vary independently.",
  problem:
    "You have two dimensions that both change: notifications come in several *kinds* (welcome, alert, receipt) and go out over several *channels* (email, SMS, push, in-app). If you make a class for every combination — `WelcomeEmail`, `WelcomeSMS`, `AlertEmail`, `AlertPush`… — the count explodes multiplicatively, and adding one new channel means adding a class for every existing kind.",
  solution:
    "Separate the two dimensions into an abstraction (the notification kind, which decides *what* to say) and an implementation (the channel, which decides *how* to deliver), and connect them with a reference — the 'bridge'. Now kinds and channels vary independently: adding a channel is one new implementation, usable by every existing kind, instead of N new classes.",
  whenToUse: [
    "A message/notification kind × delivery-channel matrix that would otherwise explode combinatorially",
    "Rendering the same content to multiple targets (screen, PDF, print) via swappable renderers",
    "Storage abstractions where the same data operations run over different backends (localStorage, IndexedDB, remote API)",
    "Any 'what' × 'how' pairing where both sides evolve on their own timeline",
  ],
  avoidWhen: [
    "One of the two dimensions is fixed and never varies — you don't need to decouple it",
    "There's only a couple of combinations and they're stable — direct code is simpler than the abstraction",
  ],
  realWorldExamples: [
    {
      name: "Notification systems (kind × channel)",
      detail:
        "A notification's content logic is written once per kind; delivery is written once per channel. A new SMS channel instantly works for every notification kind without touching them.",
    },
    {
      name: "Multi-target renderers",
      detail:
        "The same document/report abstraction renders through swappable implementations — an HTML renderer for the screen, a PDF renderer for export — decoupling content structure from output format.",
    },
    {
      name: "Storage backends behind one interface",
      detail:
        "A persistence abstraction (save/load/list) is bridged to interchangeable implementations (localStorage, IndexedDB, remote sync) so feature code doesn't change when the backend does.",
    },
    {
      name: "Payment: method × processor",
      detail:
        "A payment 'method' (card, wallet, bank transfer) is bridged to a 'processor' implementation (Stripe, Adyen); adding a processor works for every method without a class per pair.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/notifications/bridge.ts",
      language: "ts",
      description:
        "Notification kinds (the abstraction) and delivery channels (the implementation) vary independently. Adding a channel is one object; every kind can already use it.",
      code: `// Implementation side: HOW a message is delivered.
export interface NotificationChannel {
  send(to: string, subject: string, body: string): Promise<void>;
}

export const emailChannel: NotificationChannel = {
  async send(to, subject, body) {
    /* call email provider */
  },
};

export const smsChannel: NotificationChannel = {
  async send(to, _subject, body) {
    /* call SMS provider — ignores subject */
  },
};

// Abstraction side: WHAT is being said. It holds a bridge to a channel.
abstract class Notification {
  constructor(protected readonly channel: NotificationChannel) {}
  abstract notify(to: string, data: Record<string, string>): Promise<void>;
}

export class WelcomeNotification extends Notification {
  notify(to: string, data: Record<string, string>) {
    return this.channel.send(to, "Welcome!", \`Hi \${data.name}, thanks for joining.\`);
  }
}

export class SecurityAlertNotification extends Notification {
  notify(to: string, data: Record<string, string>) {
    return this.channel.send(to, "Security alert", \`New login from \${data.location}.\`);
  }
}

// Any kind pairs with any channel — no combinatorial classes:
// await new WelcomeNotification(emailChannel).notify(user.email, { name: user.name });
// await new SecurityAlertNotification(smsChannel).notify(user.phone, { location: "Kyiv" });`,
    },
    {
      filename: "src/lib/storage/typedStore.ts",
      language: "ts",
      description:
        "A persistence abstraction bridged to interchangeable storage backends: the same save/load API runs over localStorage or a remote API, chosen once — data type and transport vary independently.",
      code: `// Implementation side: HOW bytes are stored.
export interface StorageBackend {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
}

export const localBackend: StorageBackend = {
  async read(key) {
    return localStorage.getItem(key);
  },
  async write(key, value) {
    localStorage.setItem(key, value);
  },
};

export const apiBackend: StorageBackend = {
  async read(key) {
    const res = await fetch(\`/api/kv/\${key}\`);
    return res.ok ? (await res.json()).value : null;
  },
  async write(key, value) {
    await fetch(\`/api/kv/\${key}\`, { method: "PUT", body: JSON.stringify({ value }) });
  },
};

// Abstraction side: WHAT is stored. It holds a bridge to a backend.
export class TypedStore<T> {
  constructor(
    private readonly key: string,
    private readonly backend: StorageBackend
  ) {}

  async load(): Promise<T | null> {
    const raw = await this.backend.read(this.key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async save(value: T): Promise<void> {
    await this.backend.write(this.key, JSON.stringify(value));
  }
}

// Pair any data type with any backend — no combinatorial classes:
// const draft = new TypedStore<Draft>("draft", localBackend);
// const prefs = new TypedStore<Prefs>("prefs", apiBackend);`,
    },
  ],
  pros: [
    "Two independently-changing dimensions stop multiplying into N×M classes",
    "Adding a new implementation (channel) instantly benefits every abstraction (kind)",
    "Abstraction and implementation can be tested and evolved separately",
  ],
  cons: [
    "Adds indirection that's unjustified when one dimension is fixed",
    "The initial split takes design thought — picking the wrong axis makes it awkward",
  ],
};
