export function TypographyMuted({ children }: { children: string }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function TypographySmall({ children }: { children: string }) {
  return <small className="text-sm leading-none font-medium">{children}</small>;
}
