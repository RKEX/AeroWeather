import { LanguageCode } from "@/lib/i18n";

export type RickDasCopy = {
  metadata: {
    title: string;
    description: string;
    openGraphDescription: string;
    twitterDescription: string;
    personDescription: string;
  };
  hero: {
    backToHome: string;
    title: string;
    paragraphs: [string, string, string];
  };
  projects: {
    title: string;
    gameSaveSyncTitle: string;
    paragraphs: [string, string];
  };
  biography: {
    title: string;
    earlyProfile: {
      title: string;
      paragraphs: [string, string];
    };
    flagship: {
      title: string;
      paragraphs: [string, string];
    };
    technical: {
      title: string;
      intro: string;
      outro: string;
    };
    googleCloud: {
      title: string;
      intro: string;
      stats: {
        labsCompleted: string;
        courses: string;
        skillChecks: string;
        lessons: string;
        games: string;
        skillBadges: string;
        totalActivities: string;
        profileStatus: string;
        googleDevProfile: string;
      };
      profileLabel: string;
      badgeListTitle: string;
      badgeListDescription: string;
    };
  };
  spaceResearch: {
    title: string;
    nasa: {
      title: string;
      paragraphs: [string, string];
    };
    isro: {
      title: string;
      paragraphs: [string, string];
    };
  };
  quantum: {
    title: string;
    paragraphs: [string, string, string];
  };
  community: {
    title: string;
    description: string;
  };
  officialLinksTitle: string;
  officialGoogleDeveloperProfileLabel: string;
  navigation: {
    aboutAeroWeather: string;
    aeroWeatherHome: string;
  };
  faq: {
    inLanguage: string;
    whoQuestion: string;
    whoAnswer: string;
    whatQuestion: string;
    whatAnswer: string;
    nasaQuestion: string;
    nasaAnswer: string;
    isroQuestion: string;
    isroAnswer: string;
  };
};

const rickDasCopy: Record<"en" | "bn" | "hi", RickDasCopy> = {
  en: {
    metadata: {
      title: "Rick Das - Founder of AeroWeather",
      description:
        "Rick Das is the founder and developer of AeroWeather. Explore his background, technical expertise, research work, and upcoming projects.",
      openGraphDescription:
        "Rick Das is the founder and developer of AeroWeather, based in West Bengal, India.",
      twitterDescription:
        "Rick Das - Founder of AeroWeather, full-stack developer, and researcher based in West Bengal, India.",
      personDescription:
        "Rick Das is the founder and developer of AeroWeather, a real-time weather intelligence platform based in West Bengal, India. He is a full-stack developer and quantum computing researcher, a registered NASA Virtual Guest, and an ISRO START-2026 participant.",
    },
    hero: {
      backToHome: "Back to Home",
      title: "Who is Rick Das?",
      paragraphs: [
        "Rick Das is the founder and developer of AeroWeather, a real-time weather intelligence platform based in West Bengal, India.",
        "He is an Indian full-stack developer, quantum computing researcher, and active participant in international space science programs, based in Kolkata, India. Rick Das holds an official NASA Virtual Guest designation with confirmed participation in NASA's Artemis mission activities, and is enrolled as an ISRO Student in the Scientific Observations from Space program (START-2026) conducted by the Indian Space Research Organisation. He is currently pursuing a four-year Bachelor of Science degree in Computer Science with Honours, and completed his Full Stack IT training at the Central Institute of Technology, Barasat, in 2023.",
        "Rick Das is recognized through participation in NASA's public outreach and virtual engagement programs, including a NASA Virtual Guest Passport (Second Edition) issued on February 28, 2026. Alongside this, he is engaged with ISRO's START-2026 educational initiative to study space science and satellite observations. His quantum computing research explores quantum algorithms, entanglement, gate operations, and optimization use-cases, while his education combines formal computer science foundations with practical product engineering.",
      ],
    },
    projects: {
      title: "Projects",
      gameSaveSyncTitle: "GameSaveSync",
      paragraphs: [
        "GameSaveSync is a cloud-based game save synchronization platform developed by Rick Das, allowing users to sync and manage game progress across multiple devices.",
        "This is an upcoming project focused on reliable cross-device continuity, secure cloud backups, and smooth restore workflows for modern gaming experiences.",
      ],
    },
    biography: {
      title: "Full Biography of Rick Das - Founder of AeroWeather",
      earlyProfile: {
        title: "Early Profile and Developer Journey",
        paragraphs: [
          "Rick Das is an Indian full-stack developer based in Kolkata, West Bengal, India. From the early stages of his career, he focused on high-performance web applications, real-time data systems, and cloud-native architectures. He completed Full Stack IT training at the Central Institute of Technology, Barasat, in 2023.",
          "He is currently pursuing a four-year Bachelor of Science degree in Computer Science with Honours, studying advanced subjects including data structures, operating systems, networks, software engineering, and artificial intelligence. This foundation supports his practical development work and product architecture decisions.",
        ],
      },
      flagship: {
        title: "AeroWeather - The Flagship Platform",
        paragraphs: [
          "Rick Das is the founder and developer of AeroWeather, a real-time weather intelligence platform designed to deliver comprehensive and visually engaging weather data for users worldwide. The platform includes current conditions, hourly forecasts, 7-day outlooks, AQI monitoring, interactive radar, and AI-based weather insights.",
          "AeroWeather is built with Next.js and TypeScript using a performance-first architecture. Rick Das leads the platform end-to-end, from API integration and data processing to interface design, feature development, and continuous optimization.",
        ],
      },
      technical: {
        title: "Technical Expertise and Stack",
        intro:
          "Rick Das commands a versatile technical stack spanning multiple languages, frameworks, databases, and cloud platforms, enabling full-stack delivery from architecture to production.",
        outro:
          "He works across front-end, back-end, cloud infrastructure, data systems, and AI integrations, which enables him to independently build and maintain complex products such as AeroWeather.",
      },
      googleCloud: {
        title: "Google Cloud Ecosystem - Achievements and Profile",
        intro:
          "Rick Das is deeply active in the Google Cloud ecosystem. His Google Cloud Skills Boost profile reflects extensive hands-on labs, coursework, and verified skill assessments across cloud infrastructure, AI/ML, data analytics, security, networking, and app development.",
        stats: {
          labsCompleted: "Labs Completed",
          courses: "Courses",
          skillChecks: "Skill Checks",
          lessons: "Lessons",
          games: "Games",
          skillBadges: "Skill Badges",
          totalActivities: "Total Activities",
          profileStatus: "Active",
          googleDevProfile: "Google Dev Profile",
        },
        profileLabel: "Google Developer Profile",
        badgeListTitle: "Complete List of Google Cloud Skill Badges Earned by Rick Das",
        badgeListDescription:
          "The following is the complete list of skill badges and certifications earned by Rick Das on Google Cloud Skills Boost through hands-on labs and verified assessments.",
      },
    },
    spaceResearch: {
      title: "Space Science and Research Involvement",
      nasa: {
        title: "NASA - Virtual Guest and Artemis Mission Engagement",
        paragraphs: [
          "Rick Das is a registered NASA Virtual Guest, recognized through participation in mission launches and space exploration events organized by NASA. He holds an officially issued NASA Virtual Guest Passport (Second Edition), dated February 28, 2026, confirming his engagement with Artemis program activities.",
          "His involvement reflects sustained interest in aerospace engineering, orbital mechanics, planetary science, and deep-space communication systems. The principles of precision, reliability, and telemetry in NASA mission systems directly influence his engineering approach in real-time platforms such as AeroWeather.",
        ],
      },
      isro: {
        title: "ISRO - Student Enrollment and START-2026 Program",
        paragraphs: [
          "Rick Das is also an enrolled ISRO Student participating in the Scientific Observations from Space program (START-2026), organized by the Indian Space Research Organisation via the E-Class collaborative learning platform.",
          "His ISRO participation strengthens his knowledge of atmospheric data processing, satellite imagery interpretation, and earth observation methodologies, which directly supports his weather intelligence development work.",
        ],
      },
    },
    quantum: {
      title: "Quantum Computing Research",
      paragraphs: [
        "Rick Das is engaged in advanced research in quantum computing under academic supervision, positioned at the intersection of theoretical computer science and applied physics.",
        "His work examines how quantum principles can support optimization, secure communications, and future computational systems, including quantum-enhanced machine learning and simulation use-cases.",
        "This research complements his practical engineering work by strengthening analytical depth and problem-solving rigor across cloud architecture and real-time product systems.",
      ],
    },
    community: {
      title: "Community Memberships and Programs",
      description:
        "Rick Das maintains active memberships across Google developer communities and global technology programs, including Google Cloud, GDG chapters, Firebase, NVIDIA, and related ecosystems.",
    },
    officialLinksTitle: "Official Links and Profiles",
    officialGoogleDeveloperProfileLabel: "Google Developer Profile",
    navigation: {
      aboutAeroWeather: "About AeroWeather",
      aeroWeatherHome: "AeroWeather Home",
    },
    faq: {
      inLanguage: "en",
      whoQuestion: "Who is Rick Das?",
      whoAnswer:
        "Rick Das is an Indian full-stack developer and quantum computing researcher based in Kolkata, India. He is the founder and developer of AeroWeather, a real-time weather intelligence platform.",
      whatQuestion: "What is AeroWeather?",
      whatAnswer:
        "AeroWeather is a real-time weather intelligence platform founded and developed by Rick Das. Built with Next.js and TypeScript, it provides live forecasts, AQI monitoring, interactive radar, and AI-driven weather insights.",
      nasaQuestion: "Is Rick Das involved with NASA?",
      nasaAnswer:
        "Yes. Rick Das is a registered NASA Virtual Guest and holds an official NASA Virtual Guest Passport (Second Edition), reflecting participation in Artemis-related public engagement events.",
      isroQuestion: "Is Rick Das involved with ISRO?",
      isroAnswer:
        "Yes. Rick Das is an enrolled ISRO Student and participates in the START-2026 Scientific Observations from Space program.",
    },
  },
  bn: {
    metadata: {
      title: "রিক দাস - AeroWeather-এর প্রতিষ্ঠাতা",
      description:
        "রিক দাস AeroWeather-এর প্রতিষ্ঠাতা ও ডেভেলপার। তাঁর ব্যাকগ্রাউন্ড, প্রযুক্তিগত দক্ষতা, গবেষণা কাজ এবং আসন্ন প্রকল্পগুলি সম্পর্কে জানুন।",
      openGraphDescription:
        "রিক দাস পশ্চিমবঙ্গ, ভারতের বাসিন্দা এবং AeroWeather-এর প্রতিষ্ঠাতা ও ডেভেলপার।",
      twitterDescription:
        "রিক দাস - AeroWeather-এর প্রতিষ্ঠাতা, ফুল-স্ট্যাক ডেভেলপার এবং গবেষক।",
      personDescription:
        "রিক দাস AeroWeather-এর প্রতিষ্ঠাতা ও ডেভেলপার। তিনি একজন ফুল-স্ট্যাক ডেভেলপার ও কোয়ান্টাম কম্পিউটিং গবেষক, NASA Virtual Guest এবং ISRO START-2026 অংশগ্রহণকারী।",
    },
    hero: {
      backToHome: "হোমে ফিরে যান",
      title: "রিক দাস কে?",
      paragraphs: [
        "রিক দাস AeroWeather-এর প্রতিষ্ঠাতা ও ডেভেলপার, যা পশ্চিমবঙ্গ, ভারত ভিত্তিক একটি রিয়েল-টাইম আবহাওয়া ইন্টেলিজেন্স প্ল্যাটফর্ম।",
        "তিনি কলকাতা-ভিত্তিক একজন ভারতীয় ফুল-স্ট্যাক ডেভেলপার, কোয়ান্টাম কম্পিউটিং গবেষক এবং আন্তর্জাতিক স্পেস সায়েন্স প্রোগ্রামের সক্রিয় অংশগ্রহণকারী। NASA-এর Artemis মিশন কার্যক্রমে অংশগ্রহণের জন্য তিনি NASA Virtual Guest স্বীকৃতি পেয়েছেন এবং ISRO-এর START-2026 প্রোগ্রামে শিক্ষার্থী হিসেবে যুক্ত আছেন। তিনি বর্তমানে কম্পিউটার সায়েন্সে অনার্সসহ চার বছর মেয়াদি BSc ডিগ্রি করছেন এবং ২০২৩ সালে Central Institute of Technology, Barasat থেকে Full Stack IT প্রশিক্ষণ সম্পন্ন করেছেন।",
        "NASA-এর জনসম্পৃক্ততা এবং ভার্চুয়াল প্রোগ্রামে অংশগ্রহণের মাধ্যমে রিক দাস স্বীকৃত, যেখানে ২৮ ফেব্রুয়ারি ২০২৬ তারিখে ইস্যুকৃত NASA Virtual Guest Passport (Second Edition) রয়েছে। একই সঙ্গে তিনি ISRO-এর START-2026 উদ্যোগে স্পেস সায়েন্স ও স্যাটেলাইট পর্যবেক্ষণ নিয়ে পড়াশোনা করছেন। তাঁর কোয়ান্টাম গবেষণার মূল ক্ষেত্র হলো কোয়ান্টাম অ্যালগরিদম, এনট্যাংলমেন্ট, গেট অপারেশন এবং অপ্টিমাইজেশন।",
      ],
    },
    projects: {
      title: "প্রকল্পসমূহ",
      gameSaveSyncTitle: "GameSaveSync",
      paragraphs: [
        "GameSaveSync হলো রিক দাসের তৈরি একটি ক্লাউড-ভিত্তিক গেম সেভ সিঙ্ক্রোনাইজেশন প্ল্যাটফর্ম, যা ব্যবহারকারীদের একাধিক ডিভাইসে গেম প্রগ্রেস সিঙ্ক ও ম্যানেজ করতে সাহায্য করে।",
        "এটি একটি আসন্ন প্রকল্প, যার ফোকাস হলো নির্ভরযোগ্য ক্রস-ডিভাইস কন্টিনিউটি, নিরাপদ ক্লাউড ব্যাকআপ এবং দ্রুত রিস্টোর ওয়ার্কফ্লো।",
      ],
    },
    biography: {
      title: "রিক দাসের পূর্ণ জীবনী - AeroWeather-এর প্রতিষ্ঠাতা",
      earlyProfile: {
        title: "প্রাথমিক প্রোফাইল ও ডেভেলপার যাত্রা",
        paragraphs: [
          "রিক দাস কলকাতা, পশ্চিমবঙ্গের একজন ভারতীয় ফুল-স্ট্যাক ডেভেলপার। ক্যারিয়ারের শুরু থেকেই তিনি হাই-পারফরম্যান্স ওয়েব অ্যাপ, রিয়েল-টাইম ডেটা সিস্টেম এবং ক্লাউড-নেটিভ আর্কিটেকচারে কাজ করছেন। ২০২৩ সালে তিনি Central Institute of Technology, Barasat থেকে Full Stack IT প্রশিক্ষণ সম্পন্ন করেন।",
          "তিনি বর্তমানে কম্পিউটার সায়েন্সে অনার্সসহ চার বছর মেয়াদি BSc করছেন, যেখানে ডেটা স্ট্রাকচার, অপারেটিং সিস্টেম, নেটওয়ার্ক, সফটওয়্যার ইঞ্জিনিয়ারিং এবং AI পড়ছেন। এই একাডেমিক ভিত্তি তাঁর বাস্তব প্রোডাক্ট ডেভেলপমেন্টকে শক্তিশালী করে।",
        ],
      },
      flagship: {
        title: "AeroWeather - প্রধান প্ল্যাটফর্ম",
        paragraphs: [
          "রিক দাস AeroWeather-এর প্রতিষ্ঠাতা ও ডেভেলপার। এটি একটি রিয়েল-টাইম আবহাওয়া প্ল্যাটফর্ম, যেখানে বর্তমান অবস্থা, ঘণ্টাভিত্তিক পূর্বাভাস, ৭ দিনের পূর্বাভাস, AQI, ইন্টারঅ্যাকটিভ রাডার এবং AI-ভিত্তিক ইনসাইটস দেওয়া হয়।",
          "AeroWeather Next.js এবং TypeScript দিয়ে তৈরি। API ইন্টিগ্রেশন, ডেটা প্রসেসিং, UI ডিজাইন, ফিচার ডেলিভারি এবং পারফরম্যান্স অপ্টিমাইজেশন পর্যন্ত পুরো পণ্য উন্নয়ন রিক দাস নিজেই পরিচালনা করেন।",
        ],
      },
      technical: {
        title: "প্রযুক্তিগত দক্ষতা ও স্ট্যাক",
        intro:
          "রিক দাসের প্রযুক্তিগত স্ট্যাক বিস্তৃত এবং বহুমুখী, যা আর্কিটেকচার থেকে প্রোডাকশন পর্যন্ত সম্পূর্ণ ফুল-স্ট্যাক ডেলিভারি সম্ভব করে।",
        outro:
          "ফ্রন্টএন্ড, ব্যাকএন্ড, ক্লাউড, ডেটা সিস্টেম এবং AI ইন্টিগ্রেশন জুড়ে কাজ করার দক্ষতাই তাঁকে AeroWeather-এর মতো জটিল পণ্য এককভাবে তৈরি ও রক্ষণাবেক্ষণে সক্ষম করে।",
      },
      googleCloud: {
        title: "Google Cloud ইকোসিস্টেম - অর্জন ও প্রোফাইল",
        intro:
          "রিক দাস Google Cloud ইকোসিস্টেমে অত্যন্ত সক্রিয়। তাঁর Google Cloud Skills Boost প্রোফাইলে ক্লাউড ইনফ্রা, AI/ML, ডেটা অ্যানালিটিক্স, সিকিউরিটি, নেটওয়ার্কিং এবং অ্যাপ ডেভেলপমেন্টে বিস্তৃত ল্যাব, কোর্স এবং স্কিল অ্যাসেসমেন্ট রয়েছে।",
        stats: {
          labsCompleted: "ল্যাব সম্পন্ন",
          courses: "কোর্স",
          skillChecks: "স্কিল চেক",
          lessons: "লেসন",
          games: "গেমস",
          skillBadges: "স্কিল ব্যাজ",
          totalActivities: "মোট কার্যক্রম",
          profileStatus: "সক্রিয়",
          googleDevProfile: "গুগল ডেভ প্রোফাইল",
        },
        profileLabel: "Google Developer Profile",
        badgeListTitle: "রিক দাস অর্জিত Google Cloud Skill Badge-এর সম্পূর্ণ তালিকা",
        badgeListDescription:
          "নিচে Google Cloud Skills Boost-এ রিক দাসের অর্জিত স্কিল ব্যাজ এবং সার্টিফিকেশনগুলোর পূর্ণ তালিকা দেওয়া হয়েছে।",
      },
    },
    spaceResearch: {
      title: "স্পেস সায়েন্স ও গবেষণায় সম্পৃক্ততা",
      nasa: {
        title: "NASA - Virtual Guest এবং Artemis মিশন অংশগ্রহণ",
        paragraphs: [
          "রিক দাস একজন নিবন্ধিত NASA Virtual Guest। NASA আয়োজিত মিশন লঞ্চ ও স্পেস ইভেন্টে সক্রিয় অংশগ্রহণের স্বীকৃতি হিসেবে তাঁর কাছে ২৮ ফেব্রুয়ারি ২০২৬ তারিখের NASA Virtual Guest Passport (Second Edition) রয়েছে।",
          "এই সম্পৃক্ততা তাঁর এরোস্পেস ইঞ্জিনিয়ারিং, অরবিটাল মেকানিক্স, প্ল্যানেটারি সায়েন্স এবং ডিপ-স্পেস কমিউনিকেশন নিয়ে দীর্ঘমেয়াদি আগ্রহকে প্রতিফলিত করে। NASA-র নির্ভুলতা ও রিয়েল-টাইম টেলিমেট্রির নীতিগুলো তাঁর ইঞ্জিনিয়ারিং দৃষ্টিভঙ্গিকে প্রভাবিত করে।",
        ],
      },
      isro: {
        title: "ISRO - শিক্ষার্থী নিবন্ধন ও START-2026 প্রোগ্রাম",
        paragraphs: [
          "রিক দাস ISRO-এর Scientific Observations from Space (START-2026) প্রোগ্রামে নিবন্ধিত শিক্ষার্থী, যা ISRO-এর E-Class প্ল্যাটফর্মের মাধ্যমে পরিচালিত হয়।",
          "এই প্রোগ্রাম তাঁর বায়ুমণ্ডলীয় ডেটা প্রসেসিং, স্যাটেলাইট ইমেজ ব্যাখ্যা এবং আর্থ অবজারভেশন পদ্ধতিগত জ্ঞানকে উন্নত করে, যা তাঁর আবহাওয়া প্ল্যাটফর্ম উন্নয়নকাজে সরাসরি সহায়তা করে।",
        ],
      },
    },
    quantum: {
      title: "কোয়ান্টাম কম্পিউটিং গবেষণা",
      paragraphs: [
        "রিক দাস একাডেমিক তত্ত্বাবধানে উন্নত কোয়ান্টাম কম্পিউটিং গবেষণায় যুক্ত, যেখানে তাত্ত্বিক কম্পিউটার সায়েন্স এবং প্রয়োগিক পদার্থবিজ্ঞানের সমন্বয় ঘটে।",
        "তাঁর গবেষণায় কোয়ান্টাম নীতির মাধ্যমে অপ্টিমাইজেশন, নিরাপদ যোগাযোগ এবং ভবিষ্যৎ কম্পিউটিং ব্যবস্থার সম্ভাবনা বিশ্লেষণ করা হয়।",
        "এই গবেষণা তাঁর বাস্তব ইঞ্জিনিয়ারিং কাজকে আরও বিশ্লেষণধর্মী ও শক্তিশালী করে, বিশেষ করে ক্লাউড আর্কিটেকচার এবং রিয়েল-টাইম প্রোডাক্ট সিস্টেমে।",
      ],
    },
    community: {
      title: "কমিউনিটি সদস্যপদ ও প্রোগ্রাম",
      description:
        "রিক দাস Google ডেভেলপার কমিউনিটি এবং বৈশ্বিক প্রযুক্তি প্রোগ্রামগুলোতে সক্রিয়ভাবে যুক্ত, যার মধ্যে Google Cloud, GDG, Firebase, NVIDIA এবং অন্যান্য কমিউনিটি রয়েছে।",
    },
    officialLinksTitle: "অফিসিয়াল লিংক ও প্রোফাইল",
    officialGoogleDeveloperProfileLabel: "Google Developer Profile",
    navigation: {
      aboutAeroWeather: "AeroWeather সম্পর্কে",
      aeroWeatherHome: "AeroWeather হোম",
    },
    faq: {
      inLanguage: "bn",
      whoQuestion: "রিক দাস কে?",
      whoAnswer:
        "রিক দাস কলকাতা-ভিত্তিক একজন ভারতীয় ফুল-স্ট্যাক ডেভেলপার এবং কোয়ান্টাম কম্পিউটিং গবেষক। তিনি AeroWeather-এর প্রতিষ্ঠাতা ও ডেভেলপার।",
      whatQuestion: "AeroWeather কী?",
      whatAnswer:
        "AeroWeather হলো রিক দাস প্রতিষ্ঠিত একটি রিয়েল-টাইম আবহাওয়া ইন্টেলিজেন্স প্ল্যাটফর্ম, যা লাইভ পূর্বাভাস, AQI, রাডার ও AI ইনসাইটস দেয়।",
      nasaQuestion: "রিক দাস কি NASA-এর সঙ্গে যুক্ত?",
      nasaAnswer:
        "হ্যাঁ। তিনি NASA Virtual Guest হিসেবে নিবন্ধিত এবং তাঁর NASA Virtual Guest Passport (Second Edition) রয়েছে।",
      isroQuestion: "রিক দাস কি ISRO-এর সঙ্গে যুক্ত?",
      isroAnswer:
        "হ্যাঁ। তিনি ISRO-এর START-2026 Scientific Observations from Space প্রোগ্রামে অংশগ্রহণকারী শিক্ষার্থী।",
    },
  },
  hi: {
    metadata: {
      title: "रिक दास - AeroWeather के संस्थापक",
      description:
        "रिक दास AeroWeather के संस्थापक और डेवलपर हैं। उनके बैकग्राउंड, तकनीकी विशेषज्ञता, शोध कार्य और आगामी प्रोजेक्ट्स के बारे में जानें।",
      openGraphDescription:
        "रिक दास पश्चिम बंगाल, भारत से हैं और AeroWeather के संस्थापक व डेवलपर हैं।",
      twitterDescription:
        "रिक दास - AeroWeather के संस्थापक, फुल-स्टैक डेवलपर और शोधकर्ता।",
      personDescription:
        "रिक दास AeroWeather के संस्थापक और डेवलपर हैं। वे फुल-स्टैक डेवलपर, क्वांटम कंप्यूटिंग शोधकर्ता, NASA Virtual Guest और ISRO START-2026 प्रतिभागी हैं।",
    },
    hero: {
      backToHome: "होम पर वापस जाएं",
      title: "रिक दास कौन हैं?",
      paragraphs: [
        "रिक दास AeroWeather के संस्थापक और डेवलपर हैं, जो पश्चिम बंगाल, भारत पर आधारित एक रियल-टाइम वेदर इंटेलिजेंस प्लेटफॉर्म है।",
        "वे कोलकाता स्थित एक भारतीय फुल-स्टैक डेवलपर, क्वांटम कंप्यूटिंग शोधकर्ता और अंतरराष्ट्रीय स्पेस साइंस कार्यक्रमों के सक्रिय प्रतिभागी हैं। NASA Artemis गतिविधियों में भागीदारी के लिए उन्हें NASA Virtual Guest मान्यता मिली है और वे ISRO के START-2026 कार्यक्रम में छात्र के रूप में शामिल हैं। वे वर्तमान में कंप्यूटर साइंस (ऑनर्स) में चार वर्षीय BSc कर रहे हैं और 2023 में Central Institute of Technology, Barasat से Full Stack IT प्रशिक्षण पूरा कर चुके हैं।",
        "रिक दास NASA के सार्वजनिक वर्चुअल कार्यक्रमों में भागीदारी के लिए पहचाने जाते हैं और उनके पास 28 फरवरी 2026 को जारी NASA Virtual Guest Passport (Second Edition) है। साथ ही वे ISRO START-2026 के अंतर्गत स्पेस साइंस और सैटेलाइट ऑब्जर्वेशन का अध्ययन कर रहे हैं। उनका क्वांटम शोध एल्गोरिदम, एंटैंगलमेंट, गेट ऑपरेशन और ऑप्टिमाइजेशन पर केंद्रित है।",
      ],
    },
    projects: {
      title: "प्रोजेक्ट्स",
      gameSaveSyncTitle: "GameSaveSync",
      paragraphs: [
        "GameSaveSync रिक दास द्वारा विकसित एक क्लाउड-आधारित गेम सेव सिंक्रोनाइज़ेशन प्लेटफॉर्म है, जो उपयोगकर्ताओं को कई डिवाइसों पर गेम प्रगति सिंक और मैनेज करने देता है।",
        "यह एक आगामी प्रोजेक्ट है, जिसका फोकस विश्वसनीय क्रॉस-डिवाइस कंटिन्यूटी, सुरक्षित क्लाउड बैकअप और तेज रिस्टोर वर्कफ्लो पर है।",
      ],
    },
    biography: {
      title: "रिक दास की पूरी जीवनी - AeroWeather के संस्थापक",
      earlyProfile: {
        title: "प्रारंभिक प्रोफाइल और डेवलपर यात्रा",
        paragraphs: [
          "रिक दास कोलकाता, पश्चिम बंगाल के भारतीय फुल-स्टैक डेवलपर हैं। करियर की शुरुआत से ही उन्होंने हाई-परफॉर्मेंस वेब ऐप्स, रियल-टाइम डेटा सिस्टम और क्लाउड-नेटिव आर्किटेक्चर पर काम किया है। 2023 में उन्होंने Central Institute of Technology, Barasat से Full Stack IT प्रशिक्षण पूरा किया।",
          "वे वर्तमान में कंप्यूटर साइंस (ऑनर्स) में चार वर्षीय BSc कर रहे हैं, जिसमें डेटा स्ट्रक्चर, ऑपरेटिंग सिस्टम, नेटवर्क, सॉफ्टवेयर इंजीनियरिंग और AI जैसे विषय शामिल हैं। यही आधार उनके प्रोडक्ट इंजीनियरिंग निर्णयों को मजबूत बनाता है।",
        ],
      },
      flagship: {
        title: "AeroWeather - प्रमुख प्लेटफॉर्म",
        paragraphs: [
          "रिक दास AeroWeather के संस्थापक और डेवलपर हैं। यह एक रियल-टाइम वेदर प्लेटफॉर्म है, जिसमें करंट कंडीशन, आवरली फोरकास्ट, 7-दिन आउटलुक, AQI, इंटरैक्टिव रडार और AI वेदर इनसाइट्स शामिल हैं।",
          "AeroWeather को Next.js और TypeScript से बनाया गया है। API इंटीग्रेशन, डेटा प्रोसेसिंग, UI डिज़ाइन, फीचर डिलीवरी और परफॉर्मेंस ऑप्टिमाइज़ेशन तक पूरी उत्पाद यात्रा रिक दास लीड करते हैं।",
        ],
      },
      technical: {
        title: "तकनीकी विशेषज्ञता और स्टैक",
        intro:
          "रिक दास का तकनीकी स्टैक व्यापक और बहुमुखी है, जो आर्किटेक्चर से लेकर प्रोडक्शन तक पूर्ण फुल-स्टैक डिलीवरी सक्षम बनाता है।",
        outro:
          "फ्रंटएंड, बैकएंड, क्लाउड, डेटा सिस्टम और AI इंटीग्रेशन में उनकी पकड़ ही उन्हें AeroWeather जैसे जटिल उत्पाद को स्वतंत्र रूप से बनाने और बनाए रखने में सक्षम बनाती है।",
      },
      googleCloud: {
        title: "Google Cloud इकोसिस्टम - उपलब्धियां और प्रोफाइल",
        intro:
          "रिक दास Google Cloud इकोसिस्टम में बेहद सक्रिय हैं। उनके Google Cloud Skills Boost प्रोफाइल में क्लाउड इन्फ्रास्ट्रक्चर, AI/ML, डेटा एनालिटिक्स, सिक्योरिटी, नेटवर्किंग और ऐप डेवलपमेंट से जुड़े व्यापक लैब्स, कोर्स और स्किल असेसमेंट शामिल हैं।",
        stats: {
          labsCompleted: "लैब्स पूर्ण",
          courses: "कोर्स",
          skillChecks: "स्किल चेक",
          lessons: "लेसन्स",
          games: "गेम्स",
          skillBadges: "स्किल बैज",
          totalActivities: "कुल गतिविधियां",
          profileStatus: "सक्रिय",
          googleDevProfile: "गूगल डेवलपर प्रोफाइल",
        },
        profileLabel: "Google Developer Profile",
        badgeListTitle: "रिक दास द्वारा अर्जित Google Cloud Skill Badges की पूरी सूची",
        badgeListDescription:
          "नीचे Google Cloud Skills Boost पर रिक दास द्वारा अर्जित स्किल बैज और सर्टिफिकेशन की पूर्ण सूची दी गई है।",
      },
    },
    spaceResearch: {
      title: "स्पेस साइंस और रिसर्च सहभागिता",
      nasa: {
        title: "NASA - Virtual Guest और Artemis मिशन सहभागिता",
        paragraphs: [
          "रिक दास एक पंजीकृत NASA Virtual Guest हैं। NASA द्वारा आयोजित मिशन लॉन्च और स्पेस इवेंट्स में सक्रिय भागीदारी के लिए उन्हें मान्यता मिली है। उनके पास 28 फरवरी 2026 दिनांकित NASA Virtual Guest Passport (Second Edition) है।",
          "यह सहभागिता एयरोस्पेस इंजीनियरिंग, ऑर्बिटल मैकेनिक्स, प्लैनेटरी साइंस और डीप-स्पेस कम्युनिकेशन में उनकी दीर्घकालिक रुचि को दर्शाती है। NASA की सटीकता और रियल-टाइम टेलीमेट्री के सिद्धांत उनके इंजीनियरिंग दृष्टिकोण को प्रभावित करते हैं।",
        ],
      },
      isro: {
        title: "ISRO - छात्र नामांकन और START-2026 कार्यक्रम",
        paragraphs: [
          "रिक दास ISRO के Scientific Observations from Space (START-2026) कार्यक्रम में नामांकित छात्र हैं, जो ISRO के E-Class प्लेटफॉर्म के माध्यम से संचालित होता है।",
          "इस कार्यक्रम से उन्हें वायुमंडलीय डेटा प्रोसेसिंग, सैटेलाइट इमेज विश्लेषण और अर्थ ऑब्जर्वेशन मेथडोलॉजी की गहरी समझ मिली है, जो उनके वेदर इंटेलिजेंस कार्य में सीधे उपयोग होती है।",
        ],
      },
    },
    quantum: {
      title: "क्वांटम कंप्यूटिंग शोध",
      paragraphs: [
        "रिक दास अकादमिक मार्गदर्शन में उन्नत क्वांटम कंप्यूटिंग शोध में संलग्न हैं, जहां सैद्धांतिक कंप्यूटर साइंस और एप्लाइड फिजिक्स का मेल होता है।",
        "उनका शोध यह समझता है कि क्वांटम सिद्धांतों का उपयोग ऑप्टिमाइजेशन, सुरक्षित संचार और भविष्य की कंप्यूटिंग प्रणालियों में कैसे किया जा सकता है।",
        "यह शोध उनके व्यावहारिक इंजीनियरिंग कार्य को और मजबूत बनाता है, खासकर क्लाउड आर्किटेक्चर और रियल-टाइम प्रोडक्ट सिस्टम में।",
      ],
    },
    community: {
      title: "कम्युनिटी सदस्यताएं और कार्यक्रम",
      description:
        "रिक दास Google डेवलपर समुदायों और वैश्विक टेक कार्यक्रमों में सक्रिय सदस्य हैं, जिनमें Google Cloud, GDG चैप्टर्स, Firebase, NVIDIA और अन्य इकोसिस्टम शामिल हैं।",
    },
    officialLinksTitle: "आधिकारिक लिंक और प्रोफाइल",
    officialGoogleDeveloperProfileLabel: "Google Developer Profile",
    navigation: {
      aboutAeroWeather: "AeroWeather के बारे में",
      aeroWeatherHome: "AeroWeather होम",
    },
    faq: {
      inLanguage: "hi",
      whoQuestion: "रिक दास कौन हैं?",
      whoAnswer:
        "रिक दास कोलकाता स्थित भारतीय फुल-स्टैक डेवलपर और क्वांटम कंप्यूटिंग शोधकर्ता हैं। वे AeroWeather के संस्थापक और डेवलपर हैं।",
      whatQuestion: "AeroWeather क्या है?",
      whatAnswer:
        "AeroWeather रिक दास द्वारा स्थापित रियल-टाइम वेदर इंटेलिजेंस प्लेटफॉर्म है, जो लाइव फोरकास्ट, AQI, रडार और AI इनसाइट्स प्रदान करता है।",
      nasaQuestion: "क्या रिक दास NASA से जुड़े हैं?",
      nasaAnswer:
        "हां। वे पंजीकृत NASA Virtual Guest हैं और उनके पास NASA Virtual Guest Passport (Second Edition) है।",
      isroQuestion: "क्या रिक दास ISRO से जुड़े हैं?",
      isroAnswer:
        "हां। वे ISRO के START-2026 Scientific Observations from Space कार्यक्रम में नामांकित छात्र हैं।",
    },
  },
};

export function getRickDasCopy(language: LanguageCode): RickDasCopy {
  if (language === "bn") return rickDasCopy.bn;
  if (language === "hi") return rickDasCopy.hi;
  return rickDasCopy.en;
}
