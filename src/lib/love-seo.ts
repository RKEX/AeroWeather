/**
 * Love & Dating SEO Content Engine
 * Generates dynamic, human-readable SEO content per city.
 * Weather + behavioral psychology — NOT astrology.
 */

export interface LoveSeoContent {
  title: string;
  description: string;
  keywords: string[];
  faqItems: { question: string; answer: string }[];
  longContent: string;
  discoverTitle: string;
}

const LOVE_KEYWORDS = [
  "love forecast today",
  "dating weather",
  "relationship mood today",
  "emotional energy forecast",
  "best day for love",
  "romantic weather today",
  "weather and mood",
  "weather affect relationships",
  "dating conditions today",
  "romantic day forecast",
  "emotional weather forecast",
  "love compatibility weather",
  "best weather for dates",
  "weather mood connection",
  "relationship forecast",
];

export function generateLoveSeoContent(city: string, date?: string): LoveSeoContent {
  const formattedDate = date
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`))
    : "Today";

  const cityKeywords = [
    `love forecast ${city}`,
    `dating weather ${city}`,
    `romantic forecast ${city}`,
    `relationship mood ${city}`,
    `best day for love ${city}`,
    `emotional energy ${city} today`,
  ];

  return {
    title: `Love & Dating Forecast ${formattedDate !== "Today" ? `– ${formattedDate}` : "Today"} in ${city} | Relationship Mood & Compatibility`,

    description: `Check ${formattedDate.toLowerCase()}'s love forecast, dating conditions, emotional energy, and relationship insights based on real weather data in ${city}. Plan your perfect day for love.`,

    keywords: [...LOVE_KEYWORDS, ...cityKeywords],

    discoverTitle: `${formattedDate !== "Today" ? formattedDate + "'s" : "Today's"} Weather Might Affect Your Love Life in ${city} – See How`,

    faqItems: [
      {
        question: `Is today a good day for dating in ${city}?`,
        answer: `Our Love & Dating Intelligence analyzes real-time weather conditions in ${city}—including temperature, humidity, wind patterns, and atmospheric pressure—to generate a data-driven dating conditions score. Clear, mild weather typically correlates with higher social energy and openness, while extreme conditions can affect mood and communication. Check the daily romance score above for today's specific recommendation.`,
      },
      {
        question: "How does weather affect relationships and emotions?",
        answer: "Scientific research in environmental psychology shows that weather significantly impacts human mood, energy levels, and social behavior. Sunlight boosts serotonin production, improving mood and confidence. Rain can foster intimacy and emotional depth through cozy environments. High heat and humidity are linked to irritability and reduced patience. Wind instability correlates with mood fluctuations. AeroWeather's Love Intelligence synthesizes these factors into actionable relationship insights.",
      },
      {
        question: "What is the best weather for romantic activities?",
        answer: "Mild temperatures between 18–28°C (64–82°F) with low wind and clear skies create optimal conditions for outdoor dates and social interactions. Light rain can be ideal for cozy indoor dates, fostering emotional bonding. The key factors are comfort (no extreme heat or cold), stability (low wind), and ambiance (natural lighting conditions). Our algorithm weighs all these variables to generate your daily love forecast.",
      },
      {
        question: `What does the Love Score mean for ${city}?`,
        answer: `The Love Score is a composite metric (0–100) calculated from four sub-dimensions: Romance Mood, Emotional Stability, Communication Level, and Attraction Energy. Each dimension is derived from real meteorological data specific to ${city}. A score of 80+ indicates "Excellent" conditions for romantic activities, 60–79 is "Good," 40–59 is "Neutral," and below 40 suggests focusing on self-care and patience.`,
      },
      {
        question: "Is this based on astrology?",
        answer: "No. AeroWeather's Love & Dating Intelligence is entirely based on atmospheric science and environmental psychology research. We analyze measurable weather variables—temperature, humidity, barometric pressure, wind speed, and precipitation—and their documented effects on human neurotransmitter production, social behavior, and emotional regulation. There are zero astrological inputs in our algorithm.",
      },
      {
        question: "Can weather really predict relationship compatibility?",
        answer: "Weather doesn't predict compatibility between specific individuals, but it does measurably affect the emotional and social conditions under which interactions occur. Studies show that shared positive experiences (like enjoying pleasant weather together) strengthen bonding. Our tool helps you choose optimal days for important conversations, first dates, or quality time—maximizing the environmental factors that support positive outcomes.",
      },
    ],

    longContent: generateLongContent(city),
  };
}

function generateLongContent(city: string): string {
  return `<h3>The Science Behind Weather and Romantic Behavior</h3>
<p>The relationship between atmospheric conditions and human emotional states has been studied extensively in the fields of environmental psychology, biometeorology, and behavioral science. Research published in journals like <em>Psychological Science</em> and <em>The Journal of Environmental Psychology</em> consistently demonstrates that weather variables have measurable effects on mood, social behavior, and interpersonal dynamics.</p>

<p>AeroWeather's Love & Dating Intelligence for ${city} leverages these findings to provide actionable insights. Rather than relying on subjective interpretations, our system processes real-time meteorological data—temperature gradients, humidity levels, barometric pressure, wind velocity, and precipitation probability—through behavioral models derived from peer-reviewed research.</p>

<h3>How Temperature Affects Emotional Connection</h3>
<p>Ambient temperature is one of the strongest predictors of social behavior. Moderate temperatures (18–28°C) correlate with increased outdoor activity, higher social engagement, and improved mood states. When temperatures exceed comfort thresholds—particularly above 35°C—research shows significant increases in irritability, impatience, and conflict frequency. This is partly due to the body's thermoregulatory stress response, which diverts cognitive resources from social processing to physiological maintenance.</p>

<p>For residents of ${city}, understanding these temperature-emotion dynamics can help in planning meaningful interactions. Our Romance Mood metric directly incorporates thermal comfort indices to reflect how today's temperature profile supports or challenges emotional connection.</p>

<h3>Rain, Humidity, and Emotional Depth</h3>
<p>Contrary to the common assumption that rainy days are "bad" for romance, research suggests that precipitation can actually enhance emotional intimacy. The cozy atmosphere created by rain—reduced ambient noise, softer lighting, the psychological comfort of shelter—activates bonding behaviors. Studies on "cocooning" show that shared indoor experiences during inclement weather can accelerate trust-building and emotional disclosure.</p>

<p>However, high humidity without rain can produce the opposite effect: lethargy, reduced motivation, and physical discomfort that impairs social energy. Our algorithm distinguishes between these scenarios, scoring rainy-but-comfortable conditions differently from humid-and-oppressive ones.</p>

<h3>Wind, Pressure, and Communication Quality</h3>
<p>Barometric pressure changes and wind patterns affect the nervous system in subtle but measurable ways. Rapid pressure drops—associated with approaching storm systems—have been linked to headaches, anxiety, and mood instability. High winds create environmental noise and physical discomfort that reduce the quality of face-to-face communication.</p>

<p>Our Communication Level metric tracks these atmospheric factors specific to ${city}, helping you identify days when the environment naturally supports clear, calm, and productive conversations—essential for both new relationships and long-term partnerships.</p>

<h3>Practical Applications for Every Relationship Stage</h3>
<p>Whether you're single and exploring connections, dating and building a new relationship, or married and maintaining long-term partnership health, atmospheric conditions affect your experience. Singles benefit from knowing when social energy peaks for meeting new people. Couples can plan meaningful dates on days with optimal emotional conditions. Married partners can use low-stability days as reminders to practice patience and choose conversations carefully.</p>

<p>The Love & Dating Intelligence in ${city} updates daily with fresh meteorological data, ensuring every recommendation reflects the actual conditions you'll experience. Combined with our 30-day outlook, you can plan ahead for the most important romantic moments in your life.</p>`;
}

/**
 * Generate JSON-LD structured data for the love forecast page
 */
export function generateLoveJsonLd(city: string, url: string, date?: string) {
  const formattedDate = date ?? new Date().toISOString().split("T")[0];

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Love & Dating Forecast in ${city}`,
    description: `Daily love forecast, dating conditions, emotional energy, and relationship insights based on real weather data in ${city}.`,
    url,
    datePublished: formattedDate,
    dateModified: new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "AeroWeather",
      url: "https://www.aeroweather.app",
    },
    mainEntity: {
      "@type": "Article",
      headline: `Love & Dating Forecast Today in ${city} – Relationship Mood & Compatibility`,
      description: `Check today's love forecast and dating conditions in ${city}. Data-driven emotional energy and romance insights based on real weather.`,
      datePublished: formattedDate,
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Person",
        name: "Rick Das",
        url: "https://www.aeroweather.app/rick-das",
      },
      publisher: {
        "@type": "Organization",
        name: "AeroWeather",
        url: "https://www.aeroweather.app",
      },
      about: {
        "@type": "Place",
        name: city,
      },
    },
  };

  const faqContent = generateLoveSeoContent(city);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqContent.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.aeroweather.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Love Forecast",
        item: "https://www.aeroweather.app/love-forecast",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city,
        item: url,
      },
    ],
  };

  return { webPage, faqSchema, breadcrumb };
}
