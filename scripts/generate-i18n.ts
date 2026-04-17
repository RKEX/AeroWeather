import { SUPPORTED_LOCALES } from "../src/lib/locales";
import { warmLocaleMessages } from "../src/lib/message-loader";

async function main() {
  await warmLocaleMessages(SUPPORTED_LOCALES);
  console.log(`Generated/warmed messages for locales: ${SUPPORTED_LOCALES.join(", ")}`);
}

main().catch((error) => {
  console.error("Failed to generate i18n messages", error);
  process.exit(1);
});
