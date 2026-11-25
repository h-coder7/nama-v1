import { gsap } from "@/lib/gsap";

/** Roll every `[data-odo]` strip inside `scope` to its digit, right-most digit last. */
export function rollOdometers(strips: Element[], opts: { delay?: number; trigger?: Element; start?: string } = {}) {
  if (!strips.length) return;
  gsap.fromTo(
    strips,
    { y: 0, yPercent: 0, filter: "blur(3px)" },
    {
      y: 0,
      yPercent: (_i, el) => -((10 + Number((el as HTMLElement).dataset.odo)) / 20) * 100,
      filter: "blur(0px)",
      duration: 2,
      ease: "expo.out",
      stagger: 0.09,
      delay: opts.delay ?? 0,
      clearProps: "filter",
      scrollTrigger: opts.trigger ? { trigger: opts.trigger, start: opts.start ?? "top 85%", once: true } : undefined,
    },
  );
}
