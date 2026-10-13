import { STATUS_TEXTS } from "@/lib/format";
import { RegistrationStatus } from "@/lib/types";
import styles from "./StatusBadge.module.css";

const STATUS_CLASSES: Record<RegistrationStatus, string> = {
  PENDING: styles.pending,
  ACCEPTED: styles.accepted,
  REJECTED: styles.rejected,
  WITHDRAWN: styles.withdrawn,
};

export default function StatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <span className={`${styles.badge} ${STATUS_CLASSES[status]}`}>
      {STATUS_TEXTS[status]}
    </span>
  );
}
