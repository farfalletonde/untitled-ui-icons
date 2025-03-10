import fs from "fs/promises";
import path from "path";
import { PATHS } from "./constants";
import generators from "./generators";

async function getCategories() {
  const iconDirs = await fs.readdir(PATHS.ICONS);
  const variantDir = path.join(PATHS.ICONS, "Line"); // We'll use Line as our base variant
  const categories = await fs.readdir(variantDir);

  const categoryData = await Promise.all(
    categories.map(async (name) => {
      const categoryPath = path.join(variantDir, name);
      const icons = await fs.readdir(categoryPath);
      return { name, icons };
    })
  );

  return {
    variants: iconDirs,
    categories: categoryData,
  };
}

async function main() {
  try {
    // Ensure the output directory exists
    const outputDir = path.join(PATHS.PACKAGES, "untitled-ui-icons-react-native", "src");
    await fs.mkdir(outputDir, { recursive: true });

    // Get the icon data
    const { variants, categories } = await getCategories();

    // Generate React Native icons
    await generators["react-native"](variants, categories);

    console.log("Icon generation completed successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
    process.exit(1);
  }
}

main();
