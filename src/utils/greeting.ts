export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      title: "Good morning ☀️",
      subtitle: "A great day to get stronger.",
    };
  }

  if (hour < 18) {
    return {
      title: "Good afternoon 👋",
      subtitle: "Keep building momentum.",
    };
  }

  return {
    title: "Good evening 🌙",
    subtitle: "Finish the day with a great workout.",
  };
}