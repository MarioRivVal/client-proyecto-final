import { formatDate } from "@/lib/format";
import { Event } from "@/lib/types";
import styles from "./EventHero.module.css";

export default function EventHero({ event }: { event: Event }) {
  return (
    <section className={styles.hero}>
      <p className={styles.kicker}>Clasificatorio de CrossFit</p>
      <h1>
        {event.name} {event.edition}
      </h1>
      <p className={styles.date}>{formatDate(event.startsOn)}</p>
      <p className={styles.venue}>
        {event.venueName} · {event.venueAddress}
      </p>
    </section>
  );
}
