import { Badge } from "./ui/badge";

export enum ENVIRONMENT {
  PROD,
  STAGING,
  DEV,
  LOCALHOST,
}

export function EnvBadge({ environment }: { environment: ENVIRONMENT }) {
  return environment === ENVIRONMENT.PROD ? (
    <Badge variant={"destructive"} className="font-normal">
      Production
    </Badge>
  ) : environment === ENVIRONMENT.STAGING ? (
    <Badge variant={"warning"} className="font-normal">
      Staging
    </Badge>
  ) : environment === ENVIRONMENT.DEV ? (
    <Badge variant={"success"} className="font-normal">
      Development
    </Badge>
  ) : environment === ENVIRONMENT.LOCALHOST ? (
    <Badge variant={"info"} className="font-normal">
      Localhost
    </Badge>
  ) : null;
}
