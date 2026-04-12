import { MonetizationStatus } from "@/lib/types";

export default function MonetizationBadge({
  monetization,
}: {
  monetization: MonetizationStatus;
}) {
  const bothMet = monetization.subscribersMet && monetization.watchHoursMet;

  if (bothMet) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        수익화 가능
      </span>
    );
  }

  const progress = Math.round(
    (monetization.subscriberProgress + monetization.watchHoursProgress) / 2
  );

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      {progress}% 달성
    </span>
  );
}
