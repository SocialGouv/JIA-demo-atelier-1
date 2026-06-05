/* TerriTest — instrumentation du funnel (F5 / spec §8).
 *
 * Stub qui imite les événements Matomo. En production, remplacer le corps de
 * `track` par un push vers le tracker souverain, par ex. :
 *   window._paq?.push(["trackEvent", "funnel", event, JSON.stringify(props)]);
 *
 * Les événements suivent le funnel de la spec :
 *   page_view → simulateur_start → simulateur_result → porte_click / lead_submit
 */

export type FunnelEvent =
  | "page_view"
  | "simulateur_start"
  | "simulateur_result"
  | "porte_click"
  | "lead_submit";

export type FunnelProps = Record<string, string | number | boolean | undefined>;

export function track(event: FunnelEvent, props: FunnelProps = {}): void {
  // eslint-disable-next-line no-console
  console.log("[funnel]", event, props);
}
