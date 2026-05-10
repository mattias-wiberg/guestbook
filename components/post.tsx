import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp, Reply } from "lucide-react";
import { Badge } from "./ui/badge";
import { TypographyMuted } from "./ui/typography";

type PostProps = {
  title: string;
  message: string;
  authorEmail: string;
  createdAt: Date;
};

export function Post({ title, message, authorEmail, createdAt }: PostProps) {
  return (
    <Card className="w-full max-w-md gap-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant={"outline"}>
            {createdAt.toLocaleString(undefined, {
              hour12: true,
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{message} </p>
      </CardContent>
      <CardFooter className="flex-col items-start w-full gap-4">
        <p className="text-sm leading-none font-medium italic">{authorEmail}</p>
        <div className="flex w-full justify-between">
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm">
              <ArrowUp />
            </Button>
            <Button variant="outline" size="sm">
              <ArrowDown />
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <TypographyMuted>12 replies</TypographyMuted>
            <Button variant="outline" size="sm">
              <Reply />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
