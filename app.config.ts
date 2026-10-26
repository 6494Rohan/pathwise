import dotenv from "dotenv";

dotenv.config();

const PERMISSIONS = {
  notifications: "We use notifications to keep you updated about important alerts.",
};

function getBundleIdentifier() {
  const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT;
  const baseBundleId = "com.pathwise.app";
  if (appVariant === "prod") return baseBundleId;
  if (appVariant === "preprod") return `${baseBundleId}.preprod`;
  if (appVariant === "qa") return `${baseBundleId}.qa`;
  return `${baseBundleId}.develop`;
}

function getAndroidPackage() {
  const bundleId = getBundleIdentifier();
  return bundleId;
}

function getIconPath(prefix: string) {
  const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT;
  if (appVariant === "prod") return `./src/assets/icons/${prefix}-prod.png`;
  if (appVariant === "preprod") return `./src/assets/icons/${prefix}-preprod.png`;
  if (appVariant === "qa") return `./src/assets/icons/${prefix}-qa.png`;
  return `./src/assets/icons/${prefix}-develop.png`;
}

function getSplashPath() {
  return getAppIcon();
}

function getAppIcon() {
  return getIconPath("icon");
}

const PLUS_JAKARTA_SANS_WEIGHTS = {
  400: "400Regular",
  500: "500Medium",
  600: "600SemiBold",
  700: "700Bold",
  800: "800ExtraBold",
};

const plusJakartaSansFonts = Object.entries(PLUS_JAKARTA_SANS_WEIGHTS).map(([weight, face]) => ({
  weight: Number(weight),
  path: `./node_modules/@expo-google-fonts/plus-jakarta-sans/${face}/PlusJakartaSans_${face}.ttf`,
}));

function getAdaptiveIcon() {
  return getIconPath("adaptive-icon");
}

export default {
  name: "pathwise",
  slug: "pathwise",
  version: "1.0.0",
  orientation: "portrait",
  icon: getAppIcon(),
  splash: {
    image: getSplashPath(),
    resizeMode: "cover",
    backgroundColor: "#000000",
  },
  scheme: getBundleIdentifier(),
  userInterfaceStyle: "automatic",
  experiments: {
    reactCompiler: true,
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: getBundleIdentifier(),
    icon: getAppIcon(),
    infoPlist: {
      NSUserNotificationUsageDescription: PERMISSIONS.notifications,
    },
  },
  android: {
    package: getAndroidPackage(),
    icon: getAppIcon(),
    adaptiveIcon: {
      foregroundImage: getAdaptiveIcon(),
      backgroundColor: "#ffffff",
    },
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          useLegacyPackaging: true,
        },
      },
    ],
    [
      "expo-font",
      {
        ios: { fonts: plusJakartaSansFonts.map((font) => font.path) },
        android: {
          fonts: [{ fontFamily: "Plus Jakarta Sans", fontDefinitions: plusJakartaSansFonts }],
        },
      },
    ],
    "expo-localization",
    "expo-status-bar",
    [
      "expo-notifications",
      {
        icon: getAppIcon(),
        color: "#ffffff",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: false,
      },
    ],
  ],
};

