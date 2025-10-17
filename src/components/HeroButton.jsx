// src/components/HeroButton.jsx
import { Button, HeroUIProvider } from "@heroui/react";
export default function HeroButton() {
  return (
    <HeroUIProvider>
      <Button>押してね</Button>
    </HeroUIProvider>
  );
}