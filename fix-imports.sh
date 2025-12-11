#!/bin/bash

# Fix all @/ imports to relative paths in screens/
find screens/ -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i 's|from "@/components/|from "../components/|g' "$file"
  sed -i 's|from "@/hooks/|from "../hooks/|g' "$file"
  sed -i 's|from "@/lib/|from "../lib/|g' "$file"
  sed -i 's|from "@/constants/|from "../constants/|g' "$file"
  sed -i 's|from "@/navigation/|from "../navigation/|g' "$file"
  sed -i 's|from "@/data/|from "../data/|g' "$file"
  sed -i 's|from "@/contexts/|from "../contexts/|g' "$file"
  echo "Fixed: $file"
done

# Fix all @/ imports to relative paths in components/
find components/ -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i 's|from "@/components/|from "./|g' "$file"
  sed -i 's|from "@/hooks/|from "../hooks/|g' "$file"
  sed -i 's|from "@/lib/|from "../lib/|g' "$file"
  sed -i 's|from "@/constants/|from "../constants/|g' "$file"
  sed -i 's|from "@/navigation/|from "../navigation/|g' "$file"
  sed -i 's|from "@/data/|from "../data/|g' "$file"
  sed -i 's|from "@/contexts/|from "../contexts/|g' "$file"
  echo "Fixed: $file"
done

# Fix all @/ imports to relative paths in navigation/
find navigation/ -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i 's|from "@/components/|from "../components/|g' "$file"
  sed -i 's|from "@/hooks/|from "../hooks/|g' "$file"
  sed -i 's|from "@/lib/|from "../lib/|g' "$file"
  sed -i 's|from "@/constants/|from "../constants/|g' "$file"
  sed -i 's|from "@/navigation/|from "./|g' "$file"
  sed -i 's|from "@/screens/|from "../screens/|g' "$file"
  sed -i 's|from "@/data/|from "../data/|g' "$file"
  sed -i 's|from "@/contexts/|from "../contexts/|g' "$file"
  echo "Fixed: $file"
done

# Fix all @/ imports to relative paths in hooks/
find hooks/ -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i 's|from "@/components/|from "../components/|g' "$file"
  sed -i 's|from "@/hooks/|from "./|g' "$file"
  sed -i 's|from "@/lib/|from "../lib/|g' "$file"
  sed -i 's|from "@/constants/|from "../constants/|g' "$file"
  sed -i 's|from "@/navigation/|from "../navigation/|g' "$file"
  sed -i 's|from "@/data/|from "../data/|g' "$file"
  sed -i 's|from "@/contexts/|from "../contexts/|g' "$file"
  echo "Fixed: $file"
done

# Fix all @/ imports to relative paths in lib/
find lib/ -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i 's|from "@/components/|from "../components/|g' "$file"
  sed -i 's|from "@/hooks/|from "../hooks/|g' "$file"
  sed -i 's|from "@/lib/|from "./|g' "$file"
  sed -i 's|from "@/constants/|from "../constants/|g' "$file"
  sed -i 's|from "@/navigation/|from "../navigation/|g' "$file"
  sed -i 's|from "@/data/|from "../data/|g' "$file"
  sed -i 's|from "@/contexts/|from "../contexts/|g' "$file"
  echo "Fixed: $file"
done

# Fix all @/ imports to relative paths in contexts/
find contexts/ -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i 's|from "@/components/|from "../components/|g' "$file"
  sed -i 's|from "@/hooks/|from "../hooks/|g' "$file"
  sed -i 's|from "@/lib/|from "../lib/|g' "$file"
  sed -i 's|from "@/constants/|from "../constants/|g' "$file"
  sed -i 's|from "@/navigation/|from "../navigation/|g' "$file"
  sed -i 's|from "@/data/|from "../data/|g' "$file"
  sed -i 's|from "@/contexts/|from "./|g' "$file"
  echo "Fixed: $file"
done

echo "✅ All imports fixed!"
