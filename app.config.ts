import dotenv from "dotenv";

dotenv.config();

const PERMISSIONS = {
  notifications: "We use notifications to keep you updated about important alerts.",
  location: "We use your location to search places on the jobs map and show jobs near you.",
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

// The splash always shows the plain logo (no DEV/QA badge) so it matches the animated splash's logo.
function getSplashPath() {
  return "./src/assets/icons/icon-prod.png";
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

// The Google Sign-In plugin only configures iOS and requires the iOS client's reversed ID, so add it once that exists.
function googleSignInPlugin() {
  const iosUrlScheme = process.env.GOOGLE_IOS_URL_SCHEME;
  return iosUrlScheme ? [["@react-native-google-signin/google-signin", { iosUrlScheme }]] : [];
}

// Android App Links: verified against /.well-known/assetlinks.json on the web host (hosting/ folder).
function appLinkIntentFilters() {
  const webUrl = process.env.EXPO_PUBLIC_WEB_URL;
  if (!webUrl) return [];
  return [
    {
      action: "VIEW",
      autoVerify: true,
      data: [{ scheme: "https", host: new URL(webUrl).host }],
      category: ["BROWSABLE", "DEFAULT"],
    },
  ];
}

function getAdaptiveIcon() {
  return getIconPath("adaptive-icon");
}

export default {
  name: "pathwise",
  slug: "pathwise",
  version: "1.0.0",
  orientation: "portrait",
  icon: getAppIcon(),
  scheme: ["pathwise", getBundleIdentifier()],
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
    intentFilters: appLinkIntentFilters(),
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          useLegacyPackaging: true,
          // Room loads each database's generated `_Impl` class by name; R8 renamed WorkManager's and the release build crashed on launch.
          extraProguardRules: "-keep class * extends androidx.room.RoomDatabase { <init>(); }",
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
    [
      "expo-splash-screen",
      {
        // Same logo, size and colour as the animated splash (src/features/splash), so the hand-off doesn't jump.
        image: getSplashPath(),
        imageWidth: 120,
        resizeMode: "contain",
        backgroundColor: "#4F46E5",
      },
    ],
    "expo-localization",
    "./plugins/withAndroidImeInsets",
    ["expo-secure-store", { faceIDPermission: false }],
    ["expo-location", { locationWhenInUsePermission: PERMISSIONS.location }],
    ["react-native-maps", { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY }],
    ...googleSignInPlugin(),
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

