import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import { SymbolView, SFSymbol } from "expo-symbols";
import { Feather } from "@expo/vector-icons";

type FeatherIconName = keyof typeof Feather.glyphMap;

const iconMapping: Record<string, { sf: SFSymbol; feather: FeatherIconName }> = {
  home: { sf: "house.fill", feather: "home" },
  calendar: { sf: "calendar", feather: "calendar" },
  plus: { sf: "plus", feather: "plus" },
  "plus.circle": { sf: "plus.circle.fill", feather: "plus-circle" },
  sparkles: { sf: "sparkles", feather: "star" },
  person: { sf: "person.fill", feather: "user" },
  settings: { sf: "gearshape.fill", feather: "settings" },
  droplet: { sf: "drop.fill", feather: "droplet" },
  book: { sf: "book.fill", feather: "book-open" },
  moon: { sf: "moon.fill", feather: "moon" },
  star: { sf: "star.fill", feather: "star" },
  heart: { sf: "heart.fill", feather: "heart" },
  bell: { sf: "bell.fill", feather: "bell" },
  checkmark: { sf: "checkmark", feather: "check" },
  "checkmark.circle": { sf: "checkmark.circle.fill", feather: "check-circle" },
  xmark: { sf: "xmark", feather: "x" },
  "xmark.circle": { sf: "xmark.circle.fill", feather: "x-circle" },
  chevronRight: { sf: "chevron.right", feather: "chevron-right" },
  chevronLeft: { sf: "chevron.left", feather: "chevron-left" },
  chevronDown: { sf: "chevron.down", feather: "chevron-down" },
  chevronUp: { sf: "chevron.up", feather: "chevron-up" },
  "arrow.left": { sf: "arrow.left", feather: "arrow-left" },
  "arrow.right": { sf: "arrow.right", feather: "arrow-right" },
  trash: { sf: "trash.fill", feather: "trash-2" },
  pencil: { sf: "pencil", feather: "edit-2" },
  share: { sf: "square.and.arrow.up", feather: "share" },
  camera: { sf: "camera.fill", feather: "camera" },
  photo: { sf: "photo.fill", feather: "image" },
  sun: { sf: "sun.max.fill", feather: "sun" },
  "moon.stars": { sf: "moon.stars.fill", feather: "moon" },
  cloud: { sf: "cloud.fill", feather: "cloud" },
  location: { sf: "location.fill", feather: "map-pin" },
  clock: { sf: "clock.fill", feather: "clock" },
  envelope: { sf: "envelope.fill", feather: "mail" },
  phone: { sf: "phone.fill", feather: "phone" },
  lock: { sf: "lock.fill", feather: "lock" },
  unlock: { sf: "lock.open.fill", feather: "unlock" },
  eye: { sf: "eye.fill", feather: "eye" },
  "eye.slash": { sf: "eye.slash.fill", feather: "eye-off" },
  info: { sf: "info.circle.fill", feather: "info" },
  "question.mark": { sf: "questionmark.circle.fill", feather: "help-circle" },
  exclamation: { sf: "exclamationmark.triangle.fill", feather: "alert-triangle" },
  person2: { sf: "person.2.fill", feather: "users" },
  gift: { sf: "gift.fill", feather: "gift" },
  cart: { sf: "cart.fill", feather: "shopping-cart" },
  bag: { sf: "bag.fill", feather: "shopping-bag" },
  creditcard: { sf: "creditcard.fill", feather: "credit-card" },
  doc: { sf: "doc.fill", feather: "file" },
  folder: { sf: "folder.fill", feather: "folder" },
  search: { sf: "magnifyingglass", feather: "search" },
  filter: { sf: "line.3.horizontal.decrease", feather: "filter" },
  list: { sf: "list.bullet", feather: "list" },
  grid: { sf: "square.grid.2x2.fill", feather: "grid" },
  refresh: { sf: "arrow.clockwise", feather: "refresh-cw" },
  download: { sf: "arrow.down.circle.fill", feather: "download" },
  upload: { sf: "arrow.up.circle.fill", feather: "upload" },
  link: { sf: "link", feather: "link" },
  paperclip: { sf: "paperclip", feather: "paperclip" },
  bookmark: { sf: "bookmark.fill", feather: "bookmark" },
  flag: { sf: "flag.fill", feather: "flag" },
  tag: { sf: "tag.fill", feather: "tag" },
  smile: { sf: "face.smiling.fill", feather: "smile" },
  meh: { sf: "face.smiling", feather: "meh" },
  frown: { sf: "facemask.fill", feather: "frown" },
  articles: { sf: "newspaper.fill", feather: "file-text" },
  "alert.circle": { sf: "exclamationmark.circle.fill", feather: "alert-circle" },
  minus: { sf: "minus", feather: "minus" },
  "minus.circle": { sf: "minus.circle.fill", feather: "minus-circle" },
  water: { sf: "drop.fill", feather: "droplet" },
  flame: { sf: "flame.fill", feather: "zap" },
  leaf: { sf: "leaf.fill", feather: "feather" },
  bolt: { sf: "bolt.fill", feather: "zap" },
  hands: { sf: "hands.clap.fill", feather: "heart" },
  figure: { sf: "figure.stand", feather: "user" },
  waveform: { sf: "waveform.path.ecg", feather: "activity" },
  bed: { sf: "bed.double.fill", feather: "moon" },
  "share.2": { sf: "square.and.arrow.up", feather: "share-2" },
  wind: { sf: "wind", feather: "wind" },
  zap: { sf: "bolt.fill", feather: "zap" },
};

interface AppIconProps {
  name: keyof typeof iconMapping;
  size?: number;
  color?: string;
  weight?: "ultraLight" | "thin" | "light" | "regular" | "medium" | "semibold" | "bold" | "heavy" | "black";
}

export function AppIcon({
  name,
  size = 24,
  color = "#000000",
  weight = "regular",
}: AppIconProps) {
  const mapping = iconMapping[name];
  
  if (!mapping) {
    return (
      <View style={[styles.placeholder, { width: size, height: size }]} />
    );
  }

  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name={mapping.sf}
        size={size}
        tintColor={color}
        weight={weight}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Feather
      name={mapping.feather}
      size={size}
      color={color}
    />
  );
}

export type AppIconName = keyof typeof iconMapping;

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "transparent",
  },
});
