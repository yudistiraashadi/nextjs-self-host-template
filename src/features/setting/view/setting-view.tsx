"use client";

import { languageOptions } from "@/features/setting/constants";
import {
  Select,
  Tabs,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconMoon, IconShadow, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const getDefaultLanguage = () => {
  if (typeof navigator === "undefined") return "en";
  const browserLang = navigator.language.slice(0, 2);
  return languageOptions.some((opt) => opt.value === browserLang)
    ? browserLang
    : "en";
};

export function SettingView() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [language, setLanguage] = useLocalStorage({
    key: "language",
    defaultValue: getDefaultLanguage(),
  });

  // RUN IN CLIENT ONLY
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  // END RUN IN CLIENT ONLY

  return (
    <section className="wrapper space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Chat Language</h2>

        <Select
          data={languageOptions}
          value={language}
          onChange={(value) => {
            if (value) {
              setLanguage(value);
            }
          }}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Color Theme</h2>

        <Tabs variant="pills" value={colorScheme ?? computedColorScheme}>
          <Tabs.List>
            <Tabs.Tab
              value="auto"
              onClick={() => setColorScheme("auto")}
              leftSection={<IconShadow />}
            >
              Auto
            </Tabs.Tab>
            <Tabs.Tab
              value="light"
              onClick={() => setColorScheme("light")}
              leftSection={<IconSun />}
            >
              Light
            </Tabs.Tab>
            <Tabs.Tab
              value="dark"
              onClick={() => setColorScheme("dark")}
              leftSection={<IconMoon />}
            >
              Dark
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </section>
  );
}
